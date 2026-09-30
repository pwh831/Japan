/* 변형 출제실 점검 — Claude 없이 돌릴 수 있는 것만.
 *
 *   python3 tools/build-studio.py --fonts && node tools/studio-check.js
 *
 * - 처음 화면이 오류 없이 뜨는가
 * - 범위를 다 골라도 근거 자료가 한 번에 보낼 수 있는 분량 안인가
 * - 앱 엔진 확인: 맞게 낸 활용·그룹 문항은 통과, 틀리게 낸 것은 걸리는가
 * - 한글·가나·한자가 섞인 시험지 PDF 를 글자 빠짐 없이 만드는가
 */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.join(__dirname, "..", "studio");
let pass = 0, fail = 0;
const t = (ok, label) => { ok ? pass++ : fail++; console.log((ok ? "  ✓ " : "  ✗ ") + label); };
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".ttf": "font/ttf" };

(async () => {
  const srv = http.createServer((q, r) => {
    const f = path.join(ROOT, decodeURIComponent(q.url.split("?")[0]).replace(/^\/$/, "/index.html"));
    fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); return; }
      r.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" }); r.end(b); });
  }).listen(0);
  const port = srv.address().port;
  const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  // 샌드박스 프록시 인증서를 Chromium 이 모를 때가 있다(pdf-lib CDN) — 점검에서만 무시한다
  const p = await (await b.newContext({ ignoreHTTPSErrors: !!process.env.IGNORE_TLS })).newPage();
  // pdf-lib 두 파일은 CDN 대신 같은 판을 npm 에서 준다 — 샌드박스 프록시가 CDN 을 가끔 끊어 점검이 흔들렸다
  const NM = path.join(__dirname, "..", "node_modules");
  await p.route("**/pdf-lib/1.17.1/pdf-lib.min.js", r => r.fulfill({ path: path.join(NM, "pdf-lib/dist/pdf-lib.min.js"), contentType: "text/javascript" }));
  await p.route("**/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js", r => r.fulfill({ path: path.join(NM, "@pdf-lib/fontkit/dist/fontkit.umd.min.js"), contentType: "text/javascript" }));
  const errs = [];
  p.on("pageerror", e => errs.push(String(e)));
  await p.goto(`http://localhost:${port}/`, { waitUntil: "domcontentloaded" });
  await p.waitForFunction(() => window.__studio);

  console.log("── 처음 화면 ──");
  t(/낱말 \d+개/.test(await p.textContent("#srcWords")), "단어장 요약: " + (await p.textContent("#srcWords")));
  t(/\d+줄/.test(await p.textContent("#srcText")), "교과서 요약: " + (await p.textContent("#srcText")));

  console.log("── 근거 자료 분량 ──");
  const sizes = await p.evaluate(() => {
    const S = window.__studio, all = S.PARTS.map(x => x.id);
    const one = ids => { const set = { unitIds: ids, useNote: false, useRef: false, cond: { forms: [], mc: 8, essay: 3, level: "중", must: "" },
      units: S.buildUnits(ids, false), examples: "", questions: [] };
      return { lines: set.units.length, mat: S.bytes(S.materials(set)), gen: S.bytes(S.genPrompt(set)) }; };
    return { all: one(all), def: one(["vb", "ph", "t3", "t4", "t6"]), max: S.MAT_MAX, cap: S.MAX_BYTES };
  });
  const S_MAX = sizes.cap;
  const per = await p.evaluate(() => { const S = window.__studio;
    return S.PARTS.map(x => x.id + " " + S.bytes(S.materials({ unitIds: [x.id], useNote: false, useRef: false,
      units: S.buildUnits([x.id], false), examples: "", questions: [], cond: {} })) + "B").join(" · "); });
  console.log("  범위별: " + per);
  // 검수는 문항을 나눠 보내지만, 범위를 다 골랐을 때 문항 하나와 함께라도 한 번에 들어가야 한다
  const rev = await p.evaluate(() => { const S = window.__studio, ids = S.PARTS.map(x => x.id);
    const set = { unitIds: ids, useNote: false, useRef: false, cond: { forms: [], mc: 21, essay: 9, level: "중", must: "", real: true },
      units: S.buildUnits(ids, false), examples: "", questions: [] };
    const q = S.normQ({ format: "선택형", type: "대화 빈칸", level: "중", stem: "대화의 빈칸에 들어갈 말로 알맞은 것은?",
      box: "A: ここから どうやって (   )?\nB: まず、バスで おおさかえきまで いって、それから でんしゃに のりかえるよ。",
      choices: ["いくの", "くるの", "いきたい", "いって", "いきませんか"], answer: 1,
      why: [1, 2, 3, 4, 5].map(i => ({ fits: i === 1, refs: [1], reason: "근거 문장과 같다", trap: "헷갈리는 짝" })), unique: "" }, 1);
    q.id = 1; return S.bytes(S.reviewPrompt(set, [q, q, q].map((x, i) => ({ ...x, id: i + 1 })))); });
  t(rev <= S_MAX, `검수 프롬프트 (범위 전부 + 문항 3개) ${rev}B (한도 ${S_MAX}B)`);
  t(sizes.all.mat <= sizes.max, `범위를 다 골라도 근거 자료 ${sizes.all.lines}줄 · ${sizes.all.mat}B (한도 ${sizes.max}B)`);
  t(sizes.all.gen <= sizes.cap - 4000, `출제 프롬프트 ${sizes.all.gen}B (한도 ${sizes.cap}B)`);

  console.log("── 앱 엔진 확인 ──");
  const chk = await p.evaluate(() => {
    const S = window.__studio;
    const mc = (stem, choices, answer, why) => S.normQ({ format: "선택형", type: "t", stem, choices, answer, why }, 1);
    const w = (fits, extra) => Object.assign({ fits, refs: [1], reason: "r", trap: fits ? "" : "x" }, extra);
    const c = (base, form, shown) => ({ conj: { base, form, shown } });
    const run = q => S.localCheck(q, 100).filter(s => s.startsWith("앱 계산") || s.includes("한자") || s.includes("가나 종류"));
    return {
      good: run(mc("동사를 ます형으로 바르게 바꾼 것은?", ["かえる → かえます", "はいる → はいります", "くる → くります", "よむ → よます", "でる → でります"], 2,
        [w(false, c("かえる", "masu", "かえます")), w(true, c("はいる", "masu", "はいります")), w(false, c("くる", "masu", "くります")), w(false, c("よむ", "masu", "よます")), w(false, c("でる", "masu", "でります"))])),
      // 출제자가 かえます 를 옳다고 적은 경우 — 예외 1류를 2류로 활용한 실수
      badConj: run(mc("동사를 ます형으로 바르게 바꾼 것은?", ["かえる → かえます", "はいる → はいます", "くる → くります", "よむ → よます", "でる → でります"], 1,
        [w(true, c("かえる", "masu", "かえます")), w(false, c("はいる", "masu", "はいます")), w(false, c("くる", "masu", "くります")), w(false, c("よむ", "masu", "よます")), w(false, c("でる", "masu", "でります"))])),
      // "바르지 않은 것" — fits 는 여전히 진술이 옳은가다
      neg: run(mc("동사의 て형이 바르지 않은 것은?", ["いく → いって", "あそぶ → あそんで", "かく → かいて", "よむ → よんで", "はなす → はなって"], 5,
        [w(true, c("いく", "te", "いって")), w(true, c("あそぶ", "te", "あそんで")), w(true, c("かく", "te", "かいて")), w(true, c("よむ", "te", "よんで")), w(false, c("はなす", "te", "はなって"))])),
      badGroup: run(mc("동사의 종류가 나머지와 다른 것은?", ["のむ", "かえる", "たべる", "あそぶ", "まつ"], 3,
        [w(false, { group: { base: "のむ", group: 1 } }), w(false, { group: { base: "かえる", group: 2 } }), w(true, { group: { base: "たべる", group: 2 } }), w(false, { group: { base: "あそぶ", group: 1 } }), w(false, { group: { base: "まつ", group: 1 } })])),
      essayOk: run(S.normQ({ format: "서답형", stem: "いく를 て형으로", conj: { base: "いく", form: "te" }, modelAnswer: "いって", accept: [], criteria: ["a"], refs: [1] }, 9)),
      essayBad: run(S.normQ({ format: "서답형", stem: "いく를 て형으로", conj: { base: "いく", form: "te" }, modelAnswer: "いいて", accept: [], criteria: ["a"], refs: [1] }, 9)),
      essayKanji: run(S.normQ({ format: "서답형", stem: "'역'을 가나로", modelAnswer: "駅", accept: [], criteria: ["a"], refs: [1] }, 9)),
      essayKata: run(S.normQ({ format: "서답형", stem: "'버스'를 가나로", modelAnswer: "バス", accept: ["ばす"], criteria: ["a"], refs: [1] }, 9)),
    };
  });
  t(chk.good.length === 0, "바르게 낸 ます형 문항은 통과" + (chk.good.length ? " — " + chk.good[0] : ""));
  t(chk.badConj.some(s => s.includes("かえります")), "かえます 를 정답으로 낸 문항은 걸린다");
  t(chk.neg.length === 0, "'바르지 않은 것' 발문도 fits 를 진술 기준으로 확인" + (chk.neg.length ? " — " + chk.neg[0] : ""));
  t(chk.badGroup.some(s => s.includes("かえる는 1류")), "かえる 를 2류로 적으면 걸린다");
  t(chk.essayOk.length === 0 && chk.essayBad.some(s => s.includes("いって")), "서답형 いって 는 통과, いいて 는 걸린다");
  t(chk.essayKanji.some(s => s.includes("한자")), "서답형 모범 답안에 한자가 있으면 걸린다");
  t(chk.essayKata.some(s => s.includes("가나 종류")), "バス 에 ばす 를 인정 답으로 넣으면 걸린다");

  console.log("── 시험 안내 반영 ──");
  const ex = await p.evaluate(() => {
    const S = window.__studio;
    const g = (model, group) => S.normQ({ format: "서답형", type: "구분 + 활용", stem: "ある(있다)의 동사 종류와 て형을 쓰시오.", conj: { base: "ある", form: "te" },
      group: { base: "ある", group }, modelAnswer: model, accept: [], criteria: ["동사 종류(2점)", "활용형(2점)"], points: 4, refs: [1] }, 1);
    const run = q => S.localCheck(q, 100).filter(s => s.startsWith("앱 계산"));
    return {
      parts: S.gconjParts("1류, あって"), parts2: S.gconjParts("あって 2류"),
      isG: S.isGconj(g("1류, あって", 1)),
      ok: run(g("1류, あって", 1)), badForm: run(g("1류, あて", 1)), badGroup: run(g("2류, あって", 2)),
      mixed: judge("下のなまえで", S.kanaTarget("したの なまえで", [])).code,
      wrongKanji: judge("友だちと游ぶ", S.kanaTarget("ともだちと あそぶ", [])).code,
      mat: S.materials({ units: S.buildUnits(["vb"], false), useNote: false }).includes("ある — 있다"),
      style: S.genPrompt({ units: S.buildUnits(["t6"], false), useNote: false, examples: "", questions: [], cond: { forms: [], mc: 21, essay: 9, level: "중", must: "", real: true } }),
    };
  });
  t(ex.parts.group === 1 && ex.parts.form === "あって" && ex.parts2.group === 2, "\"1류, あって\" 를 구분과 활용으로 나눈다");
  t(ex.isG && ex.ok.length === 0, "ある → 1류, あって 는 통과");
  t(ex.badForm.some(s => s.includes("あって")), "て형을 あて 로 적으면 걸린다");
  t(ex.badGroup.some(s => s.includes("1류")), "ある 를 2류로 적으면 걸린다");
  t(ex.mixed === "ok", "한자를 섞은 답(下のなまえで)도 맞다");
  t(ex.wrongKanji !== "ok", "한자가 틀리면(游ぶ) 오답");
  t(ex.mat, "근거 자료 활용표에 ある 가 있다");
  t(/객관식 21문항 50점/.test(ex.style) && /동사 구분 \+ 활용 4문항 각 4점/.test(ex.style), "선생님 시험 안내와 실제 배분이 출제 프롬프트에 들어간다");

  // 내용 일치 문항에 본문이 없으면 걸러 낸다
  const cont = await p.evaluate(() => { const S = window.__studio;
    const mk = (stem, box) => S.normQ({ format: "선택형", type: "본문 내용", stem, box, choices: ["가", "나", "다", "라", "마"], answer: 1,
      why: [1, 2, 3, 4, 5].map(i => ({ fits: i === 1, refs: [1], reason: "", trap: "" })), unique: "" }, 1);
    const has = q => S.localCheck(q, 400).some(x => /본문 대화가 없어요/.test(x));
    return { bare: has(mk("대화의 내용과 일치하는 것은?", "")), withBox: has(mk("대화의 내용과 일치하는 것은?", "A: あ\nB: い\nA: う")),
             shared: has(mk("위 대화의 내용과 일치하는 것은?", "")) }; });
  t(cont.bare && !cont.withBox && !cont.shared, "내용 일치 문항: 본문이 없으면 걸러 내고, 본문이 있거나 '위 대화' 묶음이면 통과");
  // 철자 고르기: 오답 철자가 범위 안 진짜 낱말이거나 정답과 너무 다르면 걸러 낸다
  const sp = await p.evaluate(() => { const S = window.__studio;
    const mk = ch => S.normQ({ format: "선택형", type: "철자 고르기", stem: "'곳'의 알맞은 철자는?", box: "", choices: ch, answer: 1,
      why: [1, 2, 3, 4, 5].map(i => ({ fits: i === 1, refs: [1], reason: "", trap: "" })), unique: "" }, 1);
    return { good: S.spellCheck(mk(["ところ", "とこる", "とくろ", "とけろ", "どころ"])), bad: S.spellCheck(mk(["ところ", "とこる", "とくろ", "えき", "とけろ"])) }; });
  t(sp.good.length === 0 && sp.bad.length === 2, `철자 고르기: 한 글자씩 바꾼 선지는 통과, 범위 낱말·동떨어진 선지는 걸림 (${sp.bad.length}건)`);
  console.log("── 시험지 PDF ──");
  const pdf = await p.evaluate(async () => {
    const S = window.__studio;
    const set = { title: "활용표 · 교과서 6과 변형", units: S.buildUnits(["vb", "t6"], false), questions: [
      S.normQ({ format: "선택형", type: "활용형", level: "중", stem: "동사를 ます형으로 바르게 바꾼 것은?", box: "", choices: ["かえる → かえます", "はいる → はいります", "くる → くります", "よむ → よます", "でる → でります"], answer: 2,
        why: [1, 2, 3, 4, 5].map(i => ({ fits: i === 2, refs: [i], reason: "근거 문장과 같다", trap: i === 2 ? "" : "예외 1류" })), unique: "" }, 1),
      S.normQ({ format: "선택형", type: "대화 빈칸", level: "중", stem: "대화의 빈칸에 들어갈 말로 알맞은 것은?", box: "A: いっしょに (   ) いく?\nB: うん! どこが いい?", choices: ["どこか", "どこが", "どこに", "どこで", "どこから"], answer: 1,
        why: [1, 2, 3, 4, 5].map(i => ({ fits: i === 1, refs: [30], reason: "정해지지 않은 곳", trap: "" })), unique: "" }, 2),
      S.normQ({ format: "서답형", type: "가나 쓰기", level: "하", stem: "'역'을 뜻하는 낱말을 히라가나로 쓰시오. 駅(えき)", modelAnswer: "えき", accept: [], criteria: ["えき"], points: 2, refs: [3] }, 3),
    ].map((q, i) => (q.id = i + 1, q)) };
    const out = await S.buildExamPdf(set, { answers: true }, () => {});
    return { pages: out.pages, missing: out.missing, size: out.bytes.length, b64: btoa(Array.from(out.bytes, c => String.fromCharCode(c)).join("")) };
  });
  t(pdf.pages >= 2, `PDF ${pdf.pages}쪽 · ${Math.round(pdf.size / 1024)}KB`);
  t(pdf.missing === 0, "한글·가나·한자 모두 글꼴에 있다 (□ " + pdf.missing + "개)");
  fs.writeFileSync(process.env.STUDIO_PDF || "/tmp/studio-check.pdf", Buffer.from(pdf.b64, "base64"));

  t(errs.length === 0, "페이지 오류 없음" + (errs.length ? " — " + errs[0] : ""));
  await b.close(); srv.close();
  console.log(`\n${pass} 통과 · ${fail} 실패`);
  process.exit(fail ? 1 : 0);
})();
