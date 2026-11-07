/* 학습장 PDF 가 쓸 데이터를 앱과 같은 엔진·같은 규칙으로 뽑는다.
 *
 *   node tools/book-data.js <engine.js> <진도쪽>        → JSON (단어·형용사·표현)
 *   node tools/book-data.js <engine.js> --pron < 목록   → 같은 길이의 한국어 발음 목록
 *
 * engine.js 는 `python3 tools/extract-engine.py` 의 출력이다. 진도 규칙은 index.html 의 taught() 와
 * 같다: 학습지(always) · 쪽이 없는 항목 · 쪽이 진도 이하인 항목. 발음은 앱의 pron() 그대로 —
 * 규칙을 여기 다시 적으면 앱과 어긋나는 날이 온다. */
var E = require(process.argv[2]);

if (process.argv[3] === "--pron") {
  var raw = require("fs").readFileSync(0, "utf8");
  var list = JSON.parse(raw);
  process.stdout.write(JSON.stringify(list.map(function (s) { return E.pron(s); })));
  return;
}

var upto = parseInt(process.argv[3], 10);
function taught(x) { return x.always || x.pg === undefined || (x.pg !== null && x.pg <= upto); }
function on(units, code) { return units.some(function (u) { return u.now && u.code === code; }); }

var words = E.WORDS.map(function (w, i) { return { w: w, i: i }; })
  .filter(function (o) { return !o.w.skip && !o.w.ref && on(E.UNITS, o.w.unit) && taught(o.w); })
  .sort(function (a, b) { return (a.w.pg || 999) - (b.w.pg || 999) || a.i - b.i; })
  .map(function (o) {
    var w = o.w;
    return { id: w.id, pg: w.pg == null ? null : w.pg, unit: w.unit, pos: w.pos || "", word: w.word, kana: w.kana,
             meaning: w.meaning, note: w.note || "", pron: E.pron(w.kana),
             ex: (w.examples && w.examples[0]) ? { ja: w.examples[0].ja, ko: w.examples[0].ko, pron: E.pron(w.examples[0].ja) } : null };
  });

var adjs = E.ADJS2.filter(taught).map(function (a) {
  var forms = E.ADJFORMS2.map(function (f) {
    var s = E.anyConj(a, f.k);
    return { k: f.k, nm: f.nm, ko: f.ko, ja: s, pron: E.pron(s) };
  });
  return { id: a.id, pg: a.pg || null, always: !!a.always, na: !!a.na, kana: a.kana, word: a.word,
           meaning: a.meaning, note: a.note || "", pron: E.pron(a.kana), forms: forms };
});

var phrases = E.PHRASES.filter(function (p) { return p.pg !== undefined && on(E.PUNITS, p.unit) && taught(p); })
  .sort(function (a, b) { return (a.pg || 999) - (b.pg || 999); })
  .map(function (p) {
    return { id: p.id, pg: p.pg, kind: p.kind, ja: p.ja, kana: p.kana || "", ko: p.ko, use: p.use, key: p.key,
             pron: E.pron(p.kana || p.ja), note: p.note || "",
             vs: p.vs ? { ja: p.vs.ja, ko: p.vs.ko, why: p.vs.why || "" } : null };
  });

process.stdout.write(JSON.stringify({
  upto: upto, words: words, adjs: adjs, adjForms: E.ADJFORMS2.map(function (f) { return { k: f.k, nm: f.nm, ko: f.ko }; }),
  phrases: phrases
}));
