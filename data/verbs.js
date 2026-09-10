/* 시험 3 · 동사 활용 데이터
 *
 * 출처: 제6과 98~107쪽에 나온 동사 25개.
 *   107쪽 정리하기 2 「동사의 기본형은 [u]단으로 끝난다」 표가 근거이고,
 *   동사테스트 탭에서 ます형과 たい형이 확인됐습니다.
 *
 * ★ 활용형은 여기 적지 않습니다. group 하나면 규칙으로 만들어집니다.
 *      1류(5단)  어미 [u]단 → [i]단 + ます    いく  → いきます
 *      2류(1단)  る 떼고 + ます                たべる → たべます
 *      3류(불규칙) 외운다                       くる  → きます · する → します
 *   ましょう형과 たい형도 같은 어간에서 나옵니다 (いき+ましょう · いき+たい).
 *
 * ⚠️ tricky: る 로 끝나 2류처럼 보이지만 1류인 동사.
 *   규칙만 믿고 자동 판정하면 かえる → かえます 라는 틀린 답을 정답으로 채점합니다.
 *   100쪽 학습지 필기에도 '예외' 표시가 있습니다. group 은 반드시 손으로 적습니다.
 */

var VERBS = [
  /* ── 1류 (5단) 16 ── */
  { id:"v01", kana:"あらう",         group:1, meaning:["씻다"],            wordId:"j602" },
  { id:"v02", kana:"のむ",           group:1, meaning:["마시다"],          wordId:"j604" },
  { id:"v03", kana:"いく",           group:1, meaning:["가다"],            wordId:"j607" },
  { id:"v04", kana:"よむ",           group:1, meaning:["읽다"],            wordId:"j609" },
  { id:"v05", kana:"やすむ",         group:1, meaning:["쉬다"],            wordId:"j610" },
  { id:"v06", kana:"はなす",         group:1, meaning:["말하다"],          wordId:"j612" },
  { id:"v07", kana:"かえる",         group:1, meaning:["(집에) 돌아가다"], wordId:"j613", tricky:true },
  { id:"v08", kana:"のる",           group:1, meaning:["타다"],            wordId:"j614" },
  { id:"v09", kana:"あそぶ",         group:1, meaning:["놀다"],            wordId:"j615" },
  { id:"v10", kana:"さそう",         group:1, meaning:["권하다"],          wordId:"j669" },
  { id:"v11", kana:"まもる",         group:1, meaning:["지키다"],          wordId:"j641" },
  { id:"v12", kana:"はいる",         group:1, meaning:["들어가다"],        wordId:"j642", tricky:true },
  { id:"v13", kana:"しゃがむ",       group:1, meaning:["쭈그려 앉다"],     wordId:"j643" },
  { id:"v14", kana:"まつ",           group:1, meaning:["기다리다"],        wordId:"j644" },
  { id:"v15", kana:"けす",           group:1, meaning:["끄다"],            wordId:"j645" },
  { id:"v16", kana:"よぶ",           group:1, meaning:["부르다"],          wordId:"j647" },

  /* ── 2류 (1단) 6 ── */
  { id:"v17", kana:"おきる",         group:2, meaning:["일어나다"],        wordId:"j601" },
  { id:"v18", kana:"たべる",         group:2, meaning:["먹다"],            wordId:"j603" },
  { id:"v19", kana:"みる",           group:2, meaning:["보다"],            wordId:"j605" },
  { id:"v20", kana:"ねる",           group:2, meaning:["자다"],            wordId:"j606" },
  { id:"v21", kana:"でる",           group:2, meaning:["나가다"],          wordId:"j656" },
  { id:"v22", kana:"あける",         group:2, meaning:["열다"],            wordId:"j646" },

  /* ── 3류 (불규칙) 3 ── */
  { id:"v23", kana:"くる",           group:3, meaning:["오다"],            wordId:"j611" },
  { id:"v24", kana:"する",           group:3, meaning:["하다"] },
  { id:"v25", kana:"べんきょうする", group:3, meaning:["공부하다"],        wordId:"j608" }
];

/* 출제하는 활용형과 배분 (PRD §6.4).
   たい 가 가장 높은 이유: 107쪽 교재 표에 없었는데 동사테스트에는 나왔다.
   가장 덜 다뤄진 형이므로 가장 많이 낸다. */
var FORMS = [
  { k:"tai",    nm:"たい형",    ko:"~하고 싶다", suffix:"たい",    weight:40 },
  { k:"masu",   nm:"ます형",    ko:"~합니다",    suffix:"ます",    weight:30 },
  { k:"mashou", nm:"ましょう형", ko:"~합시다",    suffix:"ましょう", weight:30 }
];

var GROUP_NM = { 1:"1류", 2:"2류", 3:"3류" };
