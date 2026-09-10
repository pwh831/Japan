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
eq(E.VERBS.length, 25, "동사 25개");

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
eq(tricky.sort().join(","), "かえる,はいる", "tricky 표시가 두 개");
E.VERBS.filter(function(v){return v.tricky;}).forEach(function(v){
  eq(v.group, 1, v.kana + " 는 group 1 이어야 한다");
});

// ★ 교재가 실제로 인쇄한 형과 대조 — 엔진이 지어내지 않는지
console.log("   교재 인쇄본 대조:");
var printed = {};
E.WORDS.forEach(function(w){ printed[w.kana] = w.unit; });
[["まもる",1,"masu","まもります"],["はいる",1,"masu","はいります"],
 ["しゃがむ",1,"masu","しゃがみます"],["まつ",1,"masu","まちます"],
 ["けす",1,"masu","けします"],["あける",2,"masu","あけます"],
 ["よぶ",1,"masu","よびます"],["あらう",1,"mashou","あらいましょう"],
 ["でる",2,"mashou","でましょう"],["まもる",1,"mashou","まもりましょう"]
].forEach(function(t){
  var got = E.conj({kana:t[0],group:t[1]}, t[2]);
  eq(got, t[3], t[0] + " → " + t[3] + " (교재 " + (printed[t[3]] ? "수록" : "미수록") + ")");
  eq(printed[t[3]] ? "있음" : "없음", "있음", "  └ " + t[3] + " 가 words.js 에 실제로 있는가");
});

// 역방향 (유형 J)
eq(E.deconj("きます", E.VERBS).map(function(v){return v.kana;}).join(","), "くる", "きます → くる");
eq(E.deconj("かえります", E.VERBS).map(function(v){return v.kana;}).join(","), "かえる", "かえります → かえる");
eq(E.deconj("かえます", E.VERBS).length, 0, "かえます 는 어떤 동사에서도 안 나온다");

// 배분 합이 100
eq(E.FORMS.reduce(function(a,f){return a+f.weight;},0), 100, "형 배분 합계 100");

console.log("\n" + pass + " 통과 · " + fail + " 실패");
process.exit(fail ? 1 : 0);
