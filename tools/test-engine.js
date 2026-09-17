var E = require(process.argv[2] || "/tmp/engine.js");
var fail = 0, pass = 0;
function eq(got, want, label){
  if (got === want) pass++;
  else { fail++; console.log("✗ " + label + "\n    기대 " + JSON.stringify(want) + "  실제 " + JSON.stringify(got)); }
}
var H = function(s){ return E.toKana(s, false, true); };   // 확정 · 히라가나
var K = function(s){ return E.toKana(s, true,  true); };   // 확정 · 가타카나
var live = function(s){ return E.toKana(s, false, false); }; // 타이핑 중

console.log("── 로마자 → 가나 ──");
eq(H("tabemono"),"たべもの","tabemono");
eq(H("kitte"),"きって","촉음 kitte");
eq(H("gakkou"),"がっこう","촉음 gakkou");
eq(H("gyuunyuu"),"ぎゅうにゅう","요음+탁점 gyuunyuu");
eq(H("shinbun"),"しんぶん","발음 n + 자음");
eq(H("sinbun"),"しんぶん","훈령식 si");
eq(H("hon"),"ほん","말끝 n");
eq(H("onnna"),"おんな","nnn");
eq(H("hannnou"),"はんのう","hannnou");
eq(H("kyou"),"きょう","요음 kyou");
eq(H("chotto"),"ちょっと","chotto");
eq(H("tsukue"),"つくえ","tsukue");
eq(K("terebi"),"テレビ","가타카나 terebi");
eq(K("ko-hi-"),"コーヒー","장음 ko-hi-");
eq(K("pasokon"),"パソコン","pasokon");
eq(K("ke-ki"),"ケーキ","ke-ki");
eq(K("ra-men"),"ラーメン","ra-men");
eq(K("ko"),"コ","ko → コ 이지 ユ 가 아니다");
eq(K("yu"),"ユ","yu → ユ");
eq(H("たべもの"),"たべもの","가나는 손대지 않는다");
eq(H("かsa"),"かさ","가나+로마자 혼용");
console.log("   타이핑 중에는 말끝 n 을 남긴다:");
eq(live("hon"),"ほn","live: na 를 칠 수 있게 n 보류");
eq(live("hona"),"ほな","live: n 다음 a 가 오면 な");

console.log("── 채점 (PRD §5.2) ──");
var w = { kana:"たべもの", word:"食べ物" };
eq(E.judge("たべもの",w).code,"ok","정확 일치");
eq(E.judge("食べ物",w).code,"ok","한자로 써도 정답");
eq(E.judge("  たべ もの ",w).code,"ok","공백 무시");
eq(E.judge("たべも",w).code,"near","한 글자 부족");
var t = { kana:"テレビ", word:"テレビ" };
eq(E.judge("テレビ",t).code,"ok","가타카나 정답");
eq(E.judge("てれび",t).code,"kana","가나 종류만 다름 → 전용 안내");
eq(E.judge("ﾃﾚﾋﾞ",t).code,"ok","반각 → 전각 정규화");
var k = { kana:"きって", word:"切手" };
eq(E.judge("きって",k).code,"ok","촉음 정답");
eq(E.judge("きて",k).code,"near","촉음 빠짐은 오답 — 관대 처리 안 함");
var c = { kana:"コーヒー", word:"コーヒー" };
eq(E.judge("コーヒー",c).code,"ok","コーヒー 정답");
eq(E.judge("ユーヒー",c).code,"confuse","コ↔ユ 혼동쌍 → 되묻기");
eq(E.judge("コーヒ",c).code,"near","장음 빠짐은 오답");
var p = { kana:"パソコン", word:"パソコン" };
eq(E.judge("パンコン",p).code,"confuse","ソ↔ン 혼동쌍");
eq(E.judge("パソユン",p).code,"confuse","コ↔ユ 혼동쌍");
eq(E.judge("パソコリ",p).code,"confuse","ン↔リ 혼동쌍");
eq(E.judge("さかな",p).code,"wrong","전혀 다른 답");
eq(E.judge("",p).code,"empty","빈 입력");
var g = { kana:"ぎゅうにゅう", word:"牛乳" };
eq(E.judge("ぎゆうにゆう",g).code,"wrong","작은 ゅ 를 큰 ゆ 로 쓰면 오답(두 자리)");
eq(E.judge("きゅうにゅう",g).code,"near","탁점 빠짐 한 자리");

console.log("── 동사 활용 (PRD §6.2) ──");
eq(E.verbDataErrors(E.VERBS).join("|"), "", "동사 데이터 검증 (group·어미)");
eq(E.VERBS.length >= 30, true, "동사 " + E.VERBS.length + "개");

// 그룹별 규칙
eq(E.conj({kana:"いく",group:1},"masu"),"いきます","1류 く→き");
eq(E.conj({kana:"あらう",group:1},"masu"),"あらいます","1류 う→い (わ 아님)");
eq(E.conj({kana:"まつ",group:1},"masu"),"まちます","1류 つ→ち");
eq(E.conj({kana:"あそぶ",group:1},"masu"),"あそびます","1류 ぶ→び");
eq(E.conj({kana:"はなす",group:1},"masu"),"はなします","1류 す→し");
eq(E.conj({kana:"たべる",group:2},"masu"),"たべます","2류 る 제거");
eq(E.conj({kana:"くる",group:3},"masu"),"きます","3류 くる→きます");
eq(E.conj({kana:"する",group:3},"masu"),"します","3류 する→します");
eq(E.conj({kana:"べんきょうする",group:3},"masu"),"べんきょうします","3류 ~する");
eq(E.conj({kana:"いく",group:1},"mashou"),"いきましょう","ましょう형");
eq(E.conj({kana:"いく",group:1},"tai"),"いきたい","たい형");
eq(E.conj({kana:"くる",group:3},"tai"),"きたい","3류 たい형");

// ★ 예외 — 규칙만 믿으면 여기서 틀린 답을 정답으로 채점한다
eq(E.conj({kana:"かえる",group:1},"masu"),"かえります","예외 かえる → かえります");
eq(E.conj({kana:"かえる",group:1},"tai"),"かえりたい","예외 かえる → かえりたい (かえたい 아님)");
eq(E.conj({kana:"はいる",group:1},"masu"),"はいります","예외 はいる → はいります");
var tricky = E.VERBS.filter(function(v){ return v.tricky; }).map(function(v){ return v.kana; });
eq(tricky.sort().join(","), "かえる,きる,しる,はいる,はしる", "단어장 4쪽 예외 1류 다섯 개");
E.VERBS.filter(function(v){return v.tricky;}).forEach(function(v){
  eq(v.group, 1, v.kana + " 는 group 1 이어야 한다");
});

// ★ 단어장 1쪽 활용표에 인쇄된 형과 대조 — 엔진이 지어내지 않는지
console.log("   단어장 인쇄본 대조:");
[["まもる",1,"masu","まもります"],["はいる",1,"masu","はいります"],
 ["しゃがむ",1,"masu","しゃがみます"],["まつ",1,"masu","まちます"],
 ["けす",1,"masu","けします"],["よぶ",1,"masu","よびます"],
 ["あらう",1,"mashou","あらいましょう"],["でる",2,"mashou","でましょう"],
 ["まもる",1,"mashou","まもりましょう"],
 ["いく",1,"tai","いきたい"],["たべる",2,"tai","たべたい"],
 ["する",3,"tai","したい"],["くる",3,"tai","きたい"]
].forEach(function(t){
  eq(E.conj({kana:t[0],group:t[1]}, t[2]), t[3], t[0] + " → " + t[3] + " (단어장 표)");
});

// 역방향 (유형 J)
eq(E.deconj("きます", E.VERBS).map(function(v){return v.kana;}).join(","), "くる", "きます → くる");
eq(E.deconj("かえります", E.VERBS).map(function(v){return v.kana;}).join(","), "かえる", "かえります → かえる");
eq(E.deconj("かえます", E.VERBS).length, 0, "かえます 는 어떤 동사에서도 안 나온다");

console.log("── て형 음편 (단어장 3쪽) ──");
[["かう","かって","う→って"],["まつ","まって","つ→って"],["のる","のって","る→って"],
 ["しぬ","しんで","ぬ→んで"],["のむ","のんで","む→んで"],["あそぶ","あそんで","ぶ→んで"],
 ["かく","かいて","く→いて"],["およぐ","およいで","ぐ→いで"],["はなす","はなして","す→して"]
].forEach(function(t){
  eq(E.teForm({kana:t[0],group:1}), t[1], t[2] + " : " + t[0] + " → " + t[1]);
});
eq(E.teForm({kana:"たべる",group:2}), "たべて", "2류 る 떼고 て");
eq(E.teForm({kana:"する",group:3}), "して", "3류 する → して");
eq(E.teForm({kana:"くる",group:3}), "きて", "3류 くる → きて");
eq(E.teForm({kana:"べんきょうする",group:3}), "べんきょうして", "3류 ~する");
/* ★ 촉음 예외 — 규칙대로면 いいて 가 된다 */
var iku = E.VERBS.filter(function(v){ return v.kana === "いく"; })[0];
eq(E.teForm(iku), "いって", "★ いく → いって (いいて 아님)");
eq(E.teForm({kana:"いく",group:1}), "いいて", "  예외 표시가 없으면 규칙대로 いいて 가 된다 — 그래서 데이터로 적는다");
/* る 로 끝나는 예외 1류는 って */
["かえる","はいる","はしる","しる","きる"].forEach(function(k){
  var v = E.VERBS.filter(function(x){ return x.kana === k; })[0];
  eq(E.teForm(v), k.slice(0,-1) + "って", k + " → " + k.slice(0,-1) + "って (1류)");
});

console.log("── い형용사 활용 (단어장 4쪽) ──");
eq(E.adjDataErrors(E.ADJS).join(" / "), "", "형용사 데이터 검증");
eq(E.adjConj({kana:"こわい"}, "neg"),  "こわくない",  "부정형 ~い → ~くない");
eq(E.adjConj({kana:"こわい"}, "te"),   "こわくて",   "연결형 ~い → ~くて");
eq(E.adjConj({kana:"こわい"}, "past"), "こわかった", "과거형 ~い → ~かった");
var ii = E.ADJS.filter(function(a){ return a.kana === "いい"; })[0];
eq(E.adjConj(ii, "neg"),  "よくない",  "★ いい → よくない (いくない 아님)");
eq(E.adjConj(ii, "past"), "よかった", "★ いい → よかった");
eq(E.adjConj({kana:"いい"}, "neg"), "いくない", "  불규칙 표시가 없으면 いくない 가 된다 — 그래서 데이터로 적는다");
eq(E.ADJFORMS.reduce(function(a,f){ return a + f.weight; }, 0), 100, "형용사 형 배분 합계 100");

// 배분 합이 100
eq(E.FORMS.reduce(function(a,f){return a+f.weight;},0), 100, "형 배분 합계 100");

console.log("── 단어장 반영 ──");
eq(E.WORDS.length >= 120, true, "단어 " + E.WORDS.length + "항목");
eq(E.UNITS.length, 4, "범위 4개 (단어장 쪽)");
var kanji = E.WORDS.filter(function(w){ return /[\u4e00-\u9fff]/.test(w.word); });
eq(kanji.length >= 30, true, "한자 표기 " + kanji.length + "개 — 단어장이 한자+후리가나로 적는다");
kanji.forEach(function(w){
  eq(/[\u4e00-\u9fff]/.test(w.kana), false, "  " + w.word + " 의 kana 에는 한자가 없다 (" + w.kana + ")");
});

console.log("── 유형 C 빈칸 불변식 ──");
function cSurf(w, e){
  if (e.ja.indexOf(w.kana) >= 0) return w.kana;
  if (e.ja.indexOf(w.word) >= 0) return w.word;
  return null;
}
function blankable(w){ return (w.examples||[]).filter(function(e){ return cSurf(w, e) !== null; }); }
var cWords = E.WORDS.filter(function(w){ return blankable(w).length; });
eq(cWords.length >= 30, true, "유형 C 출제 가능 단어 " + cWords.length + "개 (30 이상)");
var leaks = [];
cWords.forEach(function(w){ blankable(w).forEach(function(e){
  var su = cSurf(w, e);
  if (e.ja.split(su).join("____").indexOf(su) >= 0) leaks.push(w.id + " " + e.ja);
}); });
eq(leaks.join(" | "), "", "빈칸을 판 뒤 정답이 문장에 남지 않는다");
/* 표제어가 문장에 없는 항목은 C 에서 빠져야 한다 — 빈칸과 보기가 아귀가 안 맞으므로 */
/* 표제어가 문장에 없는 항목은 C 에서 빠진다 */
var notC = E.WORDS.filter(function(w){
  return (w.examples||[]).length && !blankable(w).length;
});
notC.forEach(function(w){ eq(blankable(w).length, 0, w.word + " 는 유형 C 에서 빠진다"); });

console.log("── jaAliases · 교재 인쇄 표기를 그대로 써도 정답 ──");
E.WORDS.filter(function(w){ return (w.jaAliases||[]).length; }).forEach(function(w){
  eq(E.judge(w.word, w).code, "ok", w.word + " → 정답 (word 표기 그대로)");
  eq(E.judge(w.kana, w).code, "ok", w.kana + " → 정답 (kana)");
  (w.jaAliases||[]).forEach(function(a){
    eq(E.judge(a, w).code, "ok", "  " + a + " → 정답 (jaAliases)");
  });
});
/* 한자로 써도 정답 — 단어장이 한자+후리가나로 적는다 (PRD §7.1) */
E.WORDS.filter(function(w){ return w.word !== w.kana && !/[～~\s]/.test(w.word); })
  .slice(0, 8).forEach(function(w){
    eq(E.judge(w.word, w).code, "ok", w.word + " (한자) → 정답");
    eq(E.judge(w.kana, w).code, "ok", "  " + w.kana + " (가나) → 정답");
  });

console.log("── 시험 2 · 표현 (PRD §5) ──");
eq(E.phraseDataErrors(E.PHRASES).join(" / "), "", "표현 데이터 검증 (key·vs·use)");
eq(E.PHRASES.length >= 15, true, "표현 " + E.PHRASES.length + "항목");
eq(E.PHRASES.filter(function(p){ return p.kind === "대비"; }).length >= 3, true,
   "대비 " + E.PHRASES.filter(function(p){ return p.kind === "대비"; }).length + "항목");
eq(E.PFORMS.reduce(function(a,f){ return a + f.w; }, 0), 100, "유형 배분 합계 100");

/* 빈칸을 판 뒤 정답이 남으면 안 된다 */
var pleak = [];
E.PHRASES.forEach(function(p){ E.sides(p).forEach(function(sd){
  var d = E.sideOf(p, sd);
  if (d.ja.split(d.key).join("____").indexOf(d.key) >= 0) pleak.push(p.id);
}); });
eq(pleak.join(","), "", "표현 빈칸 뒤에 정답이 남지 않는다");

/* 대비는 짝의 key 가 서로 달라야 고를 수 있다 */
E.PHRASES.filter(function(p){ return p.vs; }).forEach(function(p){
  eq(p.key !== p.vs.key, true, p.id + " 짝의 key 가 다르다 (" + p.key + " ↔ " + p.vs.key + ")");
  eq(p.vs.ja.indexOf(p.key) < 0, true, p.id + " 짝 문장에 이쪽 key 가 섞여 있지 않다");
});

/* 문장이 곧 key 인 항목은 유형 G 에서 빠진다 — 「____?」 는 물어볼 것이 없다 */
var shortP = E.PHRASES.filter(function(p){ return !E.gOk(p, 0); });
shortP.forEach(function(p){
  eq(p.ja.length - p.key.length < 2, true, p.ja + " 는 문장이 곧 key 라 G 에서 빠진다");
});
var gCount = 0;
E.PHRASES.forEach(function(p){ E.sides(p).forEach(function(sd){ if (E.gOk(p, sd)) gCount++; }); });
eq(gCount >= 10, true, "유형 G 가능한 면 " + gCount + "개");

/* 오답 보기를 4개 뽑을 수 있을 만큼 서로 다른 뜻·문장이 있는가 */
var kos = {}, jas = {};
E.PHRASES.forEach(function(p){ E.sides(p).forEach(function(sd){
  var d = E.sideOf(p, sd); kos[d.ko] = 1; jas[d.ja] = 1;
}); });
eq(Object.keys(kos).length >= 6, true, "서로 다른 뜻 " + Object.keys(kos).length + "개 (오답 보기 4개 확보)");
eq(Object.keys(jas).length >= 6, true, "서로 다른 문장 " + Object.keys(jas).length + "개");

console.log("── 문제가 답을 하나로 좁히는가 ──");
/* 유형 B 는 뜻만 보여 준다. 두 낱말이 뜻을 나눠 가지면 맞게 써도 오답이 된다. */
var live = E.WORDS.filter(function(w){ return !w.skip; }), clash = [];
live.forEach(function(w){ live.forEach(function(x){
  if (x.id <= w.id || x.kana === w.kana) return;
  w.meaning.forEach(function(m){ if (x.meaning.indexOf(m) >= 0)
    clash.push(m + ": " + w.kana + "/" + x.kana); });
}); });
eq(clash.length, 0, "뜻이 겹쳐 답이 둘인 낱말: " + clash.join(", "));

/* 유형 J 는 활용형만 보여 준다. 같은 활용형이 두 동사에서 나오면 둘 다 정답이어야 한다. */
eq(E.deconj("よんで", E.VERBS).map(function(v){ return v.kana; }).sort().join(","),
   "よぶ,よむ", "よんで 의 기본형은 よむ 와 よぶ 둘 다");

console.log("── 가나 → 한국어 발음 ──");
var P = E.toKo;
eq(P("ほん"),"혼","말끝 ん 은 ㄴ");
eq(P("しんぶん"),"심분","ん+ば행은 ㅁ, 말끝은 ㄴ");
eq(P("しんかんせん"),"싱칸센","ん+か행은 ㅇ, 말끝은 ㄴ");
eq(P("アトラクション"),"아토라쿠숀","가타카나 · 요음 · 말끝 ん");
eq(P("せんせい"),"센세이","ん+さ행은 ㄴ");
eq(P("あんない"),"안나이","ん+な행은 ㄴ");
eq(P("がっこう"),"갓코우","촉음은 ㅅ 받침");
eq(P("きって"),"킷테","촉음 きって");
eq(P("コーヒー"),"코오히이","장음 ー 은 앞 모음 반복");
eq(P("ラーメン"),"라아멘","장음 + 말끝 ん");
eq(P("しんごう"),"싱고우","ん+が행은 ㅇ");
eq(P("かく"),"카쿠","か=카 (외래어 표기법의 '가' 가 아니다 — §7.3)");
eq(P("がく"),"가쿠","が=가 · 탁점을 카/가로 가른다");
eq(P("べんきょうする"),"벵쿄우스루","ん+きょ · 요음");
eq(P("たべる"),"타베루","기본");
eq(P("ふぁいる"),"파이루","외래음 ふぁ");
eq(P("きょう"),"쿄우","요음 きょ");
eq(P("にほんご"),"니홍고","ん+ご 는 ㅇ");
eq(P("には"),"니와","조사 は 는 와");
eq(P("よていは ない"),"요테이와 나이","조사 は + 띄어쓰기");
eq(P("はなす"),"하나스","낱말 첫 は 는 하 — 조사가 아니다");
eq(P("はやく"),"하야쿠","はやく 는 하야쿠");
eq(P("したに はいります"),"시타니 하이리마스","띄어쓰기 뒤의 は 는 하");
eq(P("はい、そうです。"),"하이、소우데스。","문두 は");
/* 정답 화면에 발음이 비는 줄이 없어야 한다 */
var noPron = [];
E.PHRASES.forEach(function(p){ E.sides(p).forEach(function(sd){
  var d = E.sideOf(p, sd);
  if (!E.pron(d.kana || d.ja)) noPron.push(p.id + " " + (d.kana || d.ja));
}); });
eq(noPron.length, 0, "발음을 못 다는 표현: " + noPron.join(", "));
var vNoPron = [];
E.VERBS.concat(E.ADJS).forEach(function(v){
  E.formsOf(v).forEach(function(f){ if (!E.pron(E.anyConj(v, f.k))) vNoPron.push(v.kana + " " + f.k); });
  if (!E.pron(v.kana)) vNoPron.push(v.kana + " 기본형");
});
eq(vNoPron.length, 0, "발음을 못 다는 활용형: " + vNoPron.join(", "));
/* 단어장 전체가 발음으로 바뀌는가 — 가나가 남으면 표가 아니라 구멍이다 */
var leak = [];
E.WORDS.forEach(function(w){
  if (w.skip) return;
  var k = E.toKo(w.kana);
  if (/[぀-ゟ゠-ヿー]/.test(k)) leak.push(w.kana + " → " + k);
});
eq(leak.length, 0, "가나가 그대로 남은 낱말: " + leak.slice(0, 5).join(", "));

console.log("\n" + pass + " 통과 · " + fail + " 실패");
process.exit(fail ? 1 : 0);
