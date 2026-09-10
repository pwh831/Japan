const { chromium } = require('playwright');
const fs = require('fs');

/* 이 컨테이너에는 Chromium 이 미리 깔려 있고 Playwright 가 기대하는 판번호와
   다를 수 있다. 있으면 그것을 쓰고, 없으면 Playwright 가 알아서 찾게 둔다. */
function launchOpts(){
  const pinned = process.env.CHROME_PATH ||
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  return fs.existsSync(pinned) ? { executablePath: pinned } : {};
}
const E = require(process.env.ENGINE || '/tmp/engine.js');
(async () => {
  const b = await chromium.launch(launchOpts());
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  /* ★ 산출물을 빈 디렉터리에 복사해서 연다.
     저장소 안에서 열면 data/*.js 가 상대 경로로 우연히 잡혀, 인라인이 빠져도
     통과해 버린다. 실제로 verbs.js 누락을 이 테스트가 놓쳤다. */
  const os = require('os'), path = require('path');
  const built = path.resolve(__dirname, '../일본어-단어시험.html');
  const alone = fs.mkdtempSync(path.join(os.tmpdir(), 'jp-alone-'));
  fs.copyFileSync(built, path.join(alone, 'app.html'));
  await p.goto('file://' + path.join(alone, 'app.html'));
  await p.waitForTimeout(400);
  let fail = 0; const t = (ok, m) => { if (!ok) fail++; console.log((ok?'  ✓ ':'  ✗ ')+m); };

  t(!fs.readFileSync(built,'utf8').includes('<script src='),
    '산출물에 외부 스크립트가 없다 (파일 하나로 자립)');
  t((await p.$$('.test')).length === 3, '빈 디렉터리에서도 홈이 뜬다 (시험 카드 3개)');

  const byName = {}; E.VERBS.forEach(v => byName[v.kana] = v);
  const formOf = ask => (E.FORMS.find(f => ask.indexOf(f.nm) === 0) || {}).k;

  await p.click('.test >> nth=1'); await p.waitForTimeout(150);
  await p.click('#startBtn'); await p.waitForTimeout(250);

  let right = 0, typed = 0, checked = { H:0, J:0 };
  for (let i = 0; i < 30; i++) {
    if (await p.$eval('#result', e => !e.hidden)) break;
    const ask  = (await p.textContent('#qBody .q-ask')).trim();
    const main = (await p.textContent('#qBody .q-main')).trim();
    const choicesOpen = await p.$eval('#choices', e => !e.hidden);

    if (choicesOpen) {                      // 유형 I — 정답 그룹을 눌러 본다
      const v = byName[main];
      await p.click(`#choices .choice:has-text("${E.FORMS && v ? (v.group+'류') : '1류'}")`);
      await p.waitForTimeout(120); await p.click('#fb .btn');
    } else {
      let want;
      if (ask.indexOf('기본형은') >= 0) {   // 유형 J — 활용형 → 기본형
        const cands = E.deconj(main, E.VERBS);
        want = cands.length ? cands[0].kana : null; checked.J++;
      } else {                              // 유형 H — 기본형 → 활용형
        want = E.conj(byName[main], formOf(ask)); checked.H++;
      }
      if (!want) { await p.click('#skipBtn'); await p.waitForTimeout(100); await p.click('#submitBtn'); continue; }
      await p.fill('#ans', want);
      await p.click('#submitBtn'); await p.waitForTimeout(150);
      const verdict = await p.textContent('#fb b').catch(() => '');
      if (verdict === '정답') right++; else console.log('    ✗ ' + main + ' + ' + ask + ' → 입력 ' + want + ' 인데 ' + verdict);
      typed++;
      await p.click('#submitBtn');
    }
    await p.waitForTimeout(120);
  }
  t(typed > 0, '타이핑 문제 ' + typed + '개 (H ' + checked.H + ' · J ' + checked.J + ')');
  t(right === typed, '엔진이 낸 정답이 앱 채점을 통과: ' + right + '/' + typed);

  // 오답 경로: 일부러 틀리게 (예외 동사에 규칙만 적용한 답)
  await p.click('#homeBtn'); await p.waitForTimeout(150);
  await p.evaluate(() => localStorage.clear());
  await p.reload(); await p.waitForTimeout(400);
  await p.click('.test >> nth=1'); await p.waitForTimeout(150);
  await p.click('#typeChips .chip >> nth=1'); // 그룹 고르기 끄기
  await p.click('#typeChips .chip >> nth=2'); // 기본형 되찾기 끄기
  await p.click('#startBtn'); await p.waitForTimeout(250);
  const main2 = (await p.textContent('#qBody .q-main')).trim();
  const ask2  = (await p.textContent('#qBody .q-ask')).trim();
  const v2 = byName[main2], f2 = formOf(ask2);
  const wrong = (v2.group === 1 && v2.kana.slice(-1) === 'る')
      ? v2.kana.slice(0,-1) + E.FORMS.find(f=>f.k===f2).suffix   // かえる → かえます (틀린 답)
      : 'さかな';
  await p.fill('#ans', wrong);
  await p.click('#submitBtn'); await p.waitForTimeout(200);
  const fbTxt = await p.textContent('#fb');
  t(/오답|다릅니다|맞았습니다/.test(fbTxt), '틀린 답이 오답으로 잡힘 (' + wrong + ')');

  // ── 시험 2 · 표현 ──
  /* 어느 화면에 있든 홈으로 — 퀴즈 중이면 그만두기, 결과면 처음으로 */
  if (await p.$eval('#quiz', e => !e.hidden)) await p.click('#quitBtn');
  else if (await p.$eval('#result', e => !e.hidden)) await p.click('#homeBtn');
  await p.waitForTimeout(200);
  t(await p.$eval('#home', e => !e.hidden), '홈으로 돌아왔다');
  await p.click('.test >> nth=2'); await p.waitForTimeout(200);
  const pRange = await p.$$eval('#rangeChips .chip span:first-child', e => e.map(x => x.textContent));
  t(pRange.length === 3, '표현 범위 3개 (교재 쪽): ' + pRange.join(' '));
  const pTypes = await p.$$eval('#typeChips .chip span:first-child', e => e.map(x => x.textContent));
  t(pTypes.join(',') === '대비 고르기,뜻 고르기,상황 → 표현,핵심어 쓰기', '표현 유형 4개');
  t(/표현 10항목/.test(await p.textContent('#startBtn')), '시작: ' + await p.textContent('#startBtn'));

  await p.click('#startBtn'); await p.waitForTimeout(250);
  const pk = {}; let blanks = 0, dSeen = 0;
  for (let i = 0; i < 25; i++) {
    if (await p.$eval('#result', e => !e.hidden)) break;
    const kind = await p.textContent('#qKind');
    pk[kind] = (pk[kind] || 0) + 1;
    if (kind === '대비 고르기') {
      dSeen++;
      const n = (await p.$$('#choices .choice')).length;
      t(n === 2, '  대비는 2지선다 (' + n + ')');
      const shown = await p.textContent('#qBody');
      t(shown.indexOf('____') >= 0, '  대비 문장에 빈칸이 있다');
      t(!/[가-힣]/.test((await p.$eval('#qBody', e => e.textContent)).replace('빈칸에 알맞은 말은?','')),
        '  대비 문제에 한국어 뜻이 안 보인다 (답 노출 방지)');
    }
    if (await p.$eval('#choices', e => !e.hidden)) {
      await p.click('#choices .choice >> nth=0'); await p.waitForTimeout(120);
      await p.click('#fb .btn');
    } else {
      blanks++;
      await p.click('#skipBtn'); await p.waitForTimeout(120); await p.click('#submitBtn');
    }
    await p.waitForTimeout(110);
  }
  t(await p.$eval('#result', e => !e.hidden), '표현 세션이 결과 화면까지 간다');
  t(dSeen > 0, '대비 문제가 나왔다 (' + dSeen + '회)');
  console.log('    표현 유형 분포:', JSON.stringify(pk));

  t(errs.length === 0, errs.length ? '페이지 오류:\n     ' + errs.join('\n     ') : '페이지 오류 없음');
  await b.close();
  console.log('\n' + (fail ? fail + '건 실패' : '전부 통과'));
  process.exit(fail ? 1 : 0);
})();
