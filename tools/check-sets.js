/* 변형문제 세트 점검 — docs/sets/set*.json
 *
 *   node tools/check-sets.js
 *
 * - 형식: 객관식 21 (50점) + 서답형 9 (단답형 20점, 서술형 30점), 선지 5개·겹침 없음, 부분 점수 합
 * - 활용형·동사 종류: 앱 엔진(anyConj, VERBS)으로 다시 계산해 문항에 적은 참·거짓과 맞는지
 * - 가나 답: 앱 채점(judge)으로 모범 답이 정답, 가타카나 어휘를 히라가나로 쓰면 오답인지
 * - 서술형 모범 답안은 가나로(한자 없이) — 인정 답은 앱의 한자 섞어 쓰기 규칙으로 받아지는지
 */
const fs = require("fs"), path = require("path"), vm = require("vm"), cp = require("child_process");
const ROOT = path.join(__dirname, "..");
const E = (() => {
  const src = cp.execFileSync("python3", [path.join(__dirname, "extract-engine.py")]).toString("utf8");
  const m = { exports: {} }; vm.runInNewContext(src, { module: m, exports: m.exports, console }); return m.exports;
})();

let pass = 0, fail = 0;
const t = (ok, label) => { ok ? pass++ : fail++; if (!ok || process.env.VERBOSE) console.log((ok ? "  ✓ " : "  ✗ ") + label); };
const CIRC = "①②③④⑤";
const POOL = E.VERBS.concat(E.ADJS);
const find = base => POOL.find(v => E.norm(v.kana) === E.norm(base));
const round1 = x => Math.round(x * 10) / 10;

for (const f of fs.readdirSync(path.join(ROOT, "docs", "sets")).filter(f => /^(set\d+|drill-[\w-]+)\.json$/.test(f)).sort()) {
  const d = JSON.parse(fs.readFileSync(path.join(ROOT, "docs", "sets", f), "utf8"));
  const qs = d.questions, mc = qs.filter(q => q.choices), sa = qs.filter(q => !q.choices);
  console.log("── " + f + " · " + d.title + " ──");
  const before = fail;

  t(qs.map(q => q.no).join() === Array.from({ length: qs.length }, (_, i) => i + 1).join(), `문항 번호 1~${qs.length}`);
  if (d.drill) {   // 유형 집중 연습(drill-*.json) — 시험 배점 구조는 따지지 않고 합계 100점만 본다
    t(round1(qs.reduce((a, q) => a + q.pts, 0)) === 100, `연습 ${qs.length}문항 · 합 ${round1(qs.reduce((a, q) => a + q.pts, 0))}점`);
  } else {
  t(mc.length === 21 && sa.length === 9, `객관식 ${mc.length} · 서답형 ${sa.length}`);
  t(round1(mc.reduce((a, q) => a + q.pts, 0)) === 50, "객관식 합 " + round1(mc.reduce((a, q) => a + q.pts, 0)));
  const dan = sa.filter(q => q.kind === "단답형"), seo = sa.filter(q => q.kind === "서술형");
  t(dan.reduce((a, q) => a + q.pts, 0) === 20 && dan.length === 5, `단답형 ${dan.length}문항 ${dan.reduce((a, q) => a + q.pts, 0)}점`);
  t(seo.reduce((a, q) => a + q.pts, 0) === 30 && seo.length === 4, `서술형 ${seo.length}문항 ${seo.reduce((a, q) => a + q.pts, 0)}점`);
  t(sa.filter(q => q.conj && q.group).length === 4, "동사 구분·활용 단답형 4문항");
  }

  for (const q of mc) {
    const tag = `${q.no}번`;
    t(q.choices.length === 5, tag + " 선지 5개");
    t(new Set(q.choices.map(c => E.norm(c.replace(/\[\[|\]\]/g, "")))).size === 5, tag + " 겹치는 선지 없음");
    t(q.answer >= 1 && q.answer <= 5, tag + " 정답 번호");
    t(!/\{\d\}/.test(q.exp), tag + " 해설의 선지 번호가 바뀐 자리로 채워짐");
    for (const c of q.conj) {
      const v = find(c.base);
      if (!v) { t(false, `${tag} ${c.base} 는 활용표에 없음`); continue; }
      const exp = E.anyConj(v, c.form);
      t((E.norm(exp) === E.norm(c.shown)) === c.ok, `${tag} ${CIRC[c.i - 1]} ${c.base} ${c.form}: 엔진 ${exp} / 선지 ${c.shown} → ${c.ok ? "옳음" : "틀림"}`);
      if (!c.hidden) t(E.norm(q.choices[c.i - 1]).includes(E.norm(c.shown)), `${tag} ${CIRC[c.i - 1]} 선지에 ${c.shown} 가 있다`);  // hidden: 선지에 기본형만 있거나 한자로 적힌 경우
    }
    for (const g of q.group) {
      const v = E.VERBS.find(x => E.norm(x.kana) === E.norm(g.base));
      t(!!v && v.group === g.group, `${tag} ${CIRC[g.i - 1]} ${g.base} ${g.group}류 (엔진 ${v ? v.group + "류" : "없음"})`);
      t(E.norm(q.choices[g.i - 1]).includes(E.norm(g.base)), `${tag} ${CIRC[g.i - 1]} 선지에 ${g.base} 가 있다`);
    }
    // 정답 선지의 활용은 (발문이 '바르지 않은'이 아니면) 모두 옳아야 하고, 오답 선지에는 틀린 활용이 하나 이상
    const neg = /(않은|아닌|틀린)\s*것/.test(q.stem);
    if (q.conj.length && !/다른|같은/.test(q.stem)) {
      const okAt = i => q.conj.filter(c => c.i === i).every(c => c.ok);
      const has = i => q.conj.some(c => c.i === i);
      const ansOk = okAt(q.answer);
      t(neg ? !ansOk : ansOk, `${tag} 정답 ${CIRC[q.answer - 1]} 의 활용이 ${neg ? "틀림(바르지 않은 것)" : "옳음"}`);
      for (let i = 1; i <= 5; i++) if (i !== q.answer && has(i)) t(neg ? okAt(i) : !okAt(i), `${tag} 오답 ${CIRC[i - 1]} 의 활용은 ${neg ? "옳음" : "틀림"}`);
    }
  }

  for (const q of sa) {
    const tag = `${q.no}번`;
    t(q.parts.reduce((a, p) => a + p[1], 0) === q.pts, `${tag} 채점 요소 합 ${q.pts}점`);
    if (q.kind === "서술형" && !q.ko) t(!E.hasKanji(q.answer), `${tag} 모범 답안은 가나로`);   // ko: 해석·이유처럼 우리말로 답하는 문항
    if (q.conj) {
      const v = find(q.conj.base), exp = v && E.anyConj(v, q.conj.form);
      t(!!v && E.norm(exp) === E.norm(q.conj.shown), `${tag} ${q.conj.base} ${q.conj.form} = ${exp}`);
      t(!!v && v.group === q.group.group, `${tag} ${q.conj.base} ${q.group.group}류 (엔진 ${v && v.group}류)`);
      t(q.answer.includes(q.conj.shown) && q.answer.startsWith(q.group.group + "류"), `${tag} 모범 답안 「${q.answer}」`);
      t(E.judge(q.conj.shown, { kana: exp, word: exp }).code === "ok", `${tag} 앱 채점으로 ${q.conj.shown} 정답`);
    }
    if (q.kana) {
      t(E.judge(q.kana, { kana: q.kana, word: q.kana }).code === "ok", `${tag} 앱 채점으로 ${q.kana} 정답`);
      if (/[ァ-ヺ]/.test(q.kana)) t(E.judge(E.toHira(q.kana), { kana: q.kana, word: q.kana }).code !== "ok", `${tag} 히라가나로 쓰면 오답 (가타카나 어휘)`);
    }
    // 인정 답(한자 섞기)은 앱 규칙(mixedOk)으로 모범 답과 같게 받아져야 한다
    for (const a of q.accept || []) {
      const w = { kana: q.answer, word: a };
      t(E.judge(a, w).code === "ok" && E.norm(E.toHira(a).replace(/[^぀-ゟ]/g, "")).length > 0, `${tag} 인정 답 「${a}」`);
    }
  }
  // 철자 고르기(학교 객관식 방식): 오답은 정답에서 한두 글자만 바꾸고, 범위 안 진짜 낱말이면 안 된다
  const RANGE = new Set(E.WORDS.concat(E.VERBS, E.ADJS).map(x => E.norm(E.toHira(x.kana))));
  for (const q of mc.filter(q => /철자/.test(q.tag + q.stem))) {
    const ans = E.norm(E.toHira(q.choices[q.answer - 1]));
    q.choices.forEach((c, i) => {
      if (i + 1 === q.answer) return;
      const k = E.norm(E.toHira(c));
      const d = E.lev(k, ans), real = RANGE.has(k);
      t(!real && d <= 2, `${q.no}번 철자 선지 ${CIRC[i]} ${c}: ${real ? "범위 안 진짜 낱말이라 답이 둘일 수 있음" : `정답과 ${d}글자 차이`}`);
    });
  }
  // 내용 일치 문항에는 본문이 있어야 한다 — 자기 <보기>에, 또는 "위 대화"로 앞 묶음 문항의 <보기>에
  const isContent = q => /내용/.test(q.tag) || /내용과\s*일치/.test(q.stem);
  for (const q of qs.filter(isContent)) {
    const own = (q.box || "").split("\n").length >= 3;
    const prev = qs.slice(0, q.no - 1).reverse().find(x => (x.box || "").split("\n").length >= 3);
    const grp = prev && /^\[(\d+)~(\d+)/.exec(prev.stem);
    const shared = /^위 (대화|글)/.test(q.stem) && grp && q.no >= +grp[1] && q.no <= +grp[2];
    t(own || shared, `${q.no}번 내용 문항에 본문이 있다${own ? "" : shared ? ` (${grp[1]}~${grp[2]}번 묶음)` : ""}`);
  }
  // 본문(<보기>)이 다른 문항의 답을 그대로 보여 주면 안 된다 — 그 자리는 빈칸 (A)·㉠ 으로 비운다
  const flat = s => E.norm(E.toHira(String(s || "").replace(/\[\[|\]\]/g, ""))).replace(/[、。!?…・,.\s]/g, "");
  for (const q of qs) {
    const answers = q.choices ? [q.choices[q.answer - 1]].filter(c => (q.box || "").includes("(")) : [q.answer].concat(q.accept || []);
    for (const a of answers) {
      const key = flat(a);
      if (key.length < 4 || /[㉠㉡]/.test(a)) continue;
      // 서답형 답은 다른 문항의 선지에도 보이면 안 된다(쓰는 문제가 베끼는 문제가 된다)
      const seen = x => flat(x.box).includes(key) || (!q.choices && (x.choices || []).some(c => flat(c).includes(key)));
      const leak = qs.filter(x => x.no !== q.no && seen(x)).map(x => x.no);
      t(!leak.length, `${q.no}번 답 「${a}」가 다른 문항 <보기>에 드러나지 않는다${leak.length ? " — " + leak.join(",") + "번" : ""}`);
    }
  }
  console.log(fail === before ? "  모두 통과" : `  ${fail - before}건 실패`);
}
console.log(`\n${pass} 통과 · ${fail} 실패`);
process.exit(fail ? 1 : 0);
