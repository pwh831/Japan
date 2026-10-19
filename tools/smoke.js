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

  /* 동사 + い형용사를 모두 색인한다 — 활용 시험 범위에 둘 다 있다 */
  const byName = {};
  E.VERBS.concat(E.ADJS).forEach(v => byName[v.kana] = v);
  const allForms = E.FORMS.concat(E.ADJFORMS);
  const formOf = ask => (allForms.find(f => ask.indexOf(f.nm) === 0) || {}).k;

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
      await p.click(`#choices .choice:has-text("${v && v.group ? (v.group+'류') : '1류'}")`);
      await p.waitForTimeout(120); await p.click('#fb .btn');
    } else {
      let want;
      if (ask.indexOf('기본형은') >= 0) {   // 유형 J — 활용형 → 기본형
        const cands = E.deconj(main, E.VERBS);
        want = cands.length ? cands[0].kana : null; checked.J++;
      } else {                              // 유형 H — 기본형 → 활용형
        want = byName[main] ? E.anyConj(byName[main], formOf(ask)) : null; checked.H++;
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

  // 참고 항목 — 기본으로 빠져 있어야 하고, 켜면 돌아와야 한다
  await p.click('#homeBtn'); await p.waitForTimeout(150);
  await p.evaluate(() => localStorage.clear());
  await p.reload(); await p.waitForTimeout(400);
  await p.click('.test >> nth=1'); await p.waitForTimeout(200);
  const refOff = (await p.textContent('#startBtn')).match(/(\d+)항목/)[1] | 0;
  t((await p.$eval('#refSeg button[aria-pressed="true"]', e => e.textContent.trim())) === '빼기',
    '참고 항목은 기본으로 빠져 있다');
  // 전부 다 풀어 보고 참고 항목이 한 번도 안 나오는지 본다
  await p.click('#countSeg button >> nth=3');            // 전체
  await p.click('#startBtn'); await p.waitForTimeout(250);
  const seen = new Set();
  for (let i = 0; i < 120; i++) {
    if (await p.$eval('#result', e => !e.hidden)) break;
    seen.add((await p.textContent('#qBody .q-main')).trim());
    if (await p.$eval('#choices', e => !e.hidden)) {        // 고르기 문제
      await p.click('#choices .choice >> nth=0'); await p.waitForTimeout(60);
      await p.click('#fb .btn'); await p.waitForTimeout(60);
    } else {                                                // 쓰기 문제
      await p.click('#skipBtn'); await p.waitForTimeout(60);
      await p.click('#submitBtn'); await p.waitForTimeout(60);
    }
  }
  const refVs = E.VERBS.filter(v => v.ref);
  const refKana = refVs.map(v => v.kana);
  const refShown = new Set();                              // 기본형과 활용형 전부
  refVs.forEach(v => { refShown.add(v.kana);
    E.formsOf(v).forEach(f => refShown.add(E.anyConj(v, f.k))); });
  const leaked = [...seen].filter(m => refShown.has(m));
  t(leaked.length === 0, '참고 항목이 출제되지 않는다' + (leaked.length ? ' — 샌 것: ' + leaked : ''));
  await p.click('#homeBtn'); await p.waitForTimeout(200);
  await p.click('#refSeg button >> nth=1');              // 넣기
  await p.waitForTimeout(150);
  const refOn = (await p.textContent('#startBtn')).match(/(\d+)항목/)[1] | 0;
  t(refOn === refOff + refKana.length,
    '켜면 ' + refKana.length + '개가 돌아온다 (' + refOff + ' → ' + refOn + ')');
  await p.click('#refSeg button >> nth=0'); await p.waitForTimeout(150);   // 다시 빼기

  // 오답 경로: 일부러 틀리게 (예외 동사에 규칙만 적용한 답)
  if (await p.$eval('#quiz', e => !e.hidden)) await p.click('#quitBtn');
  else if (await p.$eval('#result', e => !e.hidden)) await p.click('#homeBtn');
  await p.waitForTimeout(150);
  await p.evaluate(() => localStorage.clear());
  await p.reload(); await p.waitForTimeout(400);
  await p.click('.test >> nth=1'); await p.waitForTimeout(150);
  await p.click('#typeChips .chip >> nth=1'); // 그룹 고르기 끄기
  await p.click('#typeChips .chip >> nth=2'); // 기본형 되찾기 끄기
  await p.click('#startBtn'); await p.waitForTimeout(250);
  const main2 = (await p.textContent('#qBody .q-main')).trim();
  const ask2  = (await p.textContent('#qBody .q-ask')).trim();
  const v2 = byName[main2], f2 = formOf(ask2);
  const suf = (E.FORMS.find(f => f.k === f2) || {}).suffix;
  const wrong = (v2 && v2.group === 1 && v2.kana.slice(-1) === 'る' && suf)
      ? v2.kana.slice(0,-1) + suf       // かえる → かえます (규칙만 믿으면 나오는 틀린 답)
      : 'さかな';
  await p.fill('#ans', wrong);
  await p.click('#submitBtn'); await p.waitForTimeout(200);
  const fbTxt = await p.textContent('#fb');
  t(/오답|다릅니다|맞았습니다/.test(fbTxt), '틀린 답이 오답으로 잡힘 (' + wrong + ')');

  // 한 글자 차이면 되묻고 다시 쓰게 한다(정답 화면이 아직 안 나온다) — 확실히 틀린 답으로 한 번 더
  if (!(await p.$('#fb .reveal'))) {
    await p.fill('#ans', 'ぬぬぬぬぬ');
    await p.click('#submitBtn'); await p.waitForTimeout(200);
  }
  await p.click('#submitBtn'); await p.waitForTimeout(200);   // 다음 문제로

  // 한 글자 빗나갔다가 다시 맞게 쓴 경우 — 점수는 안 주더라도 '오답' 이라 부르면 안 된다
  const main3 = (await p.textContent('#qBody .q-main')).trim();
  const ask3  = (await p.textContent('#qBody .q-ask')).trim();
  const want3 = byName[main3] ? E.anyConj(byName[main3], formOf(ask3)) : null;
  if (want3 && want3.length > 2) {
    await p.fill('#ans', want3.slice(0, -1));                 // lev 1 → 되묻고 다시 쓰게 한다
    await p.click('#submitBtn'); await p.waitForTimeout(200);
    t(!(await p.$('#fb .reveal')), '한 글자 차이는 바로 끝내지 않고 다시 쓰게 한다');
    await p.fill('#ans', want3);                              // 이번엔 맞게
    await p.click('#submitBtn'); await p.waitForTimeout(200);
    const verdict3 = (await p.textContent('#fb b')).trim();
    t(verdict3 === '맞게 썼습니다',
      '맞게 쓴 답을 오답이라 부르지 않는다 (' + want3 + ' → "' + verdict3 + '")');
    t(/점수에는 안 들어갑니다/.test(await p.textContent('#fb')), '점수에 안 들어가는 이유를 말해 준다');
  }

  // 한국어 발음 — 정답 화면에만, 문제 화면에는 없어야 한다
  const pronRows = await p.$$eval('#fb .pron', e => e.map(x => x.textContent.trim()).filter(Boolean));
  t(pronRows.length > 0, '정답 화면에 한국어 발음이 붙는다 (' + pronRows.slice(0,3).join(' · ') + ')');
  t(pronRows.every(x => /^[가-힣\s·ー、。!?！？~～]+$/.test(x)), '발음 줄에 가나·한자가 남지 않았다');
  await p.click('#submitBtn'); await p.waitForTimeout(200);
  t(await p.$$eval('#qBody .pron', e => e.length) === 0, '문제 화면에는 발음이 없다 (읽기 연습이 사라지지 않게)');

  // ── 시험 2 · 표현 ──
  /* 어느 화면에 있든 홈으로 — 퀴즈 중이면 그만두기, 결과면 처음으로 */
  if (await p.$eval('#quiz', e => !e.hidden)) await p.click('#quitBtn');
  else if (await p.$eval('#result', e => !e.hidden)) await p.click('#homeBtn');
  await p.waitForTimeout(200);
  t(await p.$eval('#home', e => !e.hidden), '홈으로 돌아왔다');
  await p.click('.test >> nth=2'); await p.waitForTimeout(200);
  const pRange = await p.$$eval('#rangeChips .chip span:first-child', e => e.map(x => x.textContent));
  t(pRange.length === 5, '표현 범위 5개 (3·4과 포함) (교재 쪽): ' + pRange.join(' '));
  const pTypes = await p.$$eval('#typeChips .chip span:first-child', e => e.map(x => x.textContent));
  t(pTypes.join(',') === '대비 고르기,뜻 고르기,상황 → 표현,핵심어 쓰기', '표현 유형 4개');
  t(/표현 3\d항목/.test(await p.textContent('#startBtn')), '시작: ' + await p.textContent('#startBtn'));

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

  // 철자 고르기 — 단어 시험에서 이 유형만 켜고 풀어 본다
  console.log('── 단어 · 철자 고르기 ──');
  await p.click('#homeBtn'); await p.waitForTimeout(150);
  await p.click('.test >> nth=0'); await p.waitForTimeout(200);
  const wTypes = await p.$$eval('#typeChips .chip span:first-child', e => e.map(x => x.textContent));
  t(wTypes.includes('철자 고르기'), '단어 유형에 철자 고르기가 있다: ' + wTypes.join(','));
  for (const nm of ['뜻 고르기', '직접 쓰기', '예문 빈칸']) await p.click(`#typeChips .chip:has-text("${nm}")`);
  await p.click('#startBtn'); await p.waitForTimeout(250);
  let spOk = 0, spN = 0;
  for (let i = 0; i < 6; i++) {
    if (await p.$eval('#result', e => !e.hidden)) break;
    const meaning = (await p.textContent('#qBody .q-main')).trim();
    const opts = await p.$$eval('#choices .choice span', e => e.map(x => x.textContent));
    const w = E.WORDS.find(x => x.meaning.join(', ') === meaning && opts.includes(x.kana));
    t(opts.length === 5 && new Set(opts).size === 5 && !!w, `  ${meaning}: ${opts.join(' / ')}`);
    if (!w) break;
    await p.click(`#choices .choice:has(span:text-is("${w.kana}"))`); await p.waitForTimeout(120);
    if ((await p.textContent('#fb b')) === '정답') spOk++;
    spN++;
    await p.click('#fb .btn'); await p.waitForTimeout(110);
  }
  t(spN > 0 && spOk === spN, `철자 고르기: 맞는 철자를 누르면 정답 ${spOk}/${spN}`);

  // 오늘 할 것 — 간격 반복·확신도·오답 분류 (docs/학습원리.md §2·§4)
  console.log('── 단어 · 오늘 할 것 ──');
  if (await p.$eval('#quiz', e => !e.hidden)) await p.click('#quitBtn');
  if (await p.$eval('#result', e => !e.hidden)) await p.click('#homeBtn');
  await p.evaluate(() => localStorage.clear());
  await p.reload(); await p.waitForTimeout(400);
  const nowUnits = E.UNITS.filter(u => u.now).map(u => u.code);
  const nowWords = E.WORDS.filter(w => nowUnits.includes(w.unit) && !w.skip && !w.ref);
  t(!(await p.$eval('#todaySec', e => e.hidden)), '단어 시험에 오늘 할 것이 보인다');
  t((await p.textContent('#todayNote')).includes(nowWords.length + '개'),
    '처음엔 지금 진도 쪽 전부가 오늘 할 것: ' + (await p.textContent('#todayNote')));
  const pressed = await p.$$eval('#rangeChips .chip[aria-pressed="true"] span:first-child', e => e.map(x => x.textContent));
  t(pressed.length === nowUnits.length, '기본 범위는 지금 진도 쪽만: ' + pressed.join(','));

  const findW = m => nowWords.find(w => w.meaning.join(', ') === m);
  const runToday = async (plan) => {
    await p.click('#todayBtn'); await p.waitForTimeout(250);
    const log = [];
    for (let i = 0; i < 40; i++) {
      if (await p.$eval('#result', e => !e.hidden)) break;
      t((await p.textContent('#qKind')).trim() === '직접 쓰기', '  오늘 할 것은 직접 쓰기만');
      const w = findW((await p.textContent('#qBody .q-main')).trim());
      if (!w) { t(false, '  뜻으로 낱말을 못 찾음'); break; }
      const how = plan(w, i);
      if (how === 'kana') {                       // 가나 종류를 틀렸다가 고쳐 쓴다
        await p.fill('#ans', E.toHira(w.kana)); await p.click('#submitBtn'); await p.waitForTimeout(120);
      }
      await p.fill('#ans', w.kana); await p.click('#submitBtn'); await p.waitForTimeout(140);
      log.push([w, how, (await p.textContent('#fb b')).trim(), (await p.textContent('#fb .x')).trim()]);
      if (how === 'unsure') await p.click('#fb button:has-text("애매했음")');
      else await p.click('#submitBtn');           // 정답이면 '확실 · 다음', 아니면 '다음'
      await p.waitForTimeout(110);
    }
    return log;
  };
  const kataW = nowWords.find(w => /[ァ-ヺ]/.test(w.kana) && E.toHira(w.kana) !== w.kana);
  let unsureW = null;
  const log1 = await runToday((w, i) => w === kataW ? 'kana' : (!unsureW && w !== kataW ? (unsureW = w, 'unsure') : 'sure'));
  t(log1.length === nowWords.length, '오늘 할 것을 끝까지 풀었다 (' + log1.length + '문항)');
  const kRow = log1.find(r => r[1] === 'kana');
  t(kRow && kRow[2] === '맞게 썼습니다' && kRow[3].includes('가나 종류 실수'),
    '가나 종류를 틀렸다 고치면 맞게 썼다고 하고 실수로 분류한다: ' + (kRow ? kRow[3] : ''));
  const rTags = await p.$$eval('#rWrongs .t', e => e.map(x => x.textContent));
  t(rTags.some(x => x.includes('애매')) && rTags.some(x => x.includes('가나 종류')),
    '결과에 애매·가나 종류가 표시된다: ' + rTags.join(' / '));
  await p.click('#homeBtn'); await p.waitForTimeout(200);
  t((await p.textContent('#todayBtn')).includes('2문항'),
    '틀렸거나 애매했던 2개만 오늘 다시: ' + (await p.textContent('#todayBtn')));
  t((await p.textContent('#slipBtn')).includes('1개'), '실수 모음에 1개: ' + (await p.textContent('#slipBtn')));
  const st1 = await p.evaluate(() => JSON.parse(localStorage.getItem('jp-exam-v2')).word);
  const sureW = log1.find(r => r[1] === 'sure')[0];
  t(st1[sureW.id].rd && st1[sureW.id].rd.length === 1 && !st1[unsureW.id].rd,
    '확실은 그날을 적고, 애매는 적지 않는다');

  await runToday(() => 'sure');
  await p.click('#homeBtn'); await p.waitForTimeout(200);
  t(/다음 복습은 1일 뒤 \(\d+개\)/.test(await p.textContent('#todayNote')),
    '다 맞히면 다음 복습일을 알려 준다: ' + (await p.textContent('#todayNote')));
  t(await p.$eval('#todayBtn', e => e.disabled), '오늘 할 것이 없으면 버튼이 꺼진다');

  // 하루가 지났다고 치고(기록을 하루 앞당긴다) 다시 열면 전부 복습할 날이 된다
  await p.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('jp-exam-v2'));
    const d = new Date(); d.setDate(d.getDate() - 1);
    const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    Object.values(s.word).forEach(x => { if (x.rd) x.rd = [k]; });
    localStorage.setItem('jp-exam-v2', JSON.stringify(s));
  });
  await p.reload(); await p.waitForTimeout(400);
  t((await p.textContent('#todayNote')).includes('복습 ' + nowWords.length),
    '다음 날에는 전부 복습으로 돌아온다: ' + (await p.textContent('#todayNote')));

  t(errs.length === 0, errs.length ? '페이지 오류:\n     ' + errs.join('\n     ') : '페이지 오류 없음');
  await b.close();
  console.log('\n' + (fail ? fail + '건 실패' : '전부 통과'));
  process.exit(fail ? 1 : 0);
})();
