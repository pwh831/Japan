/* 시험 3 · 활용 데이터 (동사 + い형용사)
 *
 * 출처: 「2026 일본어 회화 (2학기 1회고사 단어)」의 활용표 네 개.
 *   1쪽 <동사구분 및 정중형> · 1쪽 권유형 · 2쪽 ます형+たい · 3쪽 <동사의 음편> ·
 *   4쪽 <い형용사 활용> · 4쪽 <자주 나오는 예외 1류 동사>
 *
 * ★ 활용형은 여기 적지 않습니다. group 하나면 규칙으로 만들어집니다.
 *
 *   ます·ましょう·たい  — 어간(연용형)에서 나온다
 *      1류  어미 [u]단 → [i]단      いく → いき + ます/ましょう/たい
 *      2류  る 떼고                 たべる → たべ + …
 *      3류  する→し · くる→き
 *
 *   て형 — 어간이 아니라 어미에서 갈린다(음편). 단어장 3쪽 표 그대로:
 *      う·つ·る → って    かう → かって
 *      ぬ·む·ぶ → んで    あそぶ → あそんで
 *      く → いて          かく → かいて
 *      ぐ → いで          およぐ → およいで
 *      す → して          はなす → はなして
 *      2류  る 떼고 て     たべる → たべて
 *      3류  する→して · くる→きて
 *
 * ⚠️ 예외가 두 종류입니다. 섞이면 안 됩니다.
 *   tricky  — る 로 끝나 2류처럼 보이지만 1류. 단어장 4쪽에 다섯 개가 따로 실려 있습니다.
 *             かえる·はいる·はしる·しる·きる. 규칙만 믿으면 かえます 가 됩니다.
 *
 *             그중 かえる·はいる 만 본문 어휘에도 나옵니다(1·2쪽 ＊예외1류).
 *             はしる·しる·きる 는 4쪽 상자에만 있어 수업에서 안 다뤘을 수 있습니다 —
 *             ref 로 표시하고, 홈의 '참고 항목' 을 켤 때만 출제합니다.
 *   teIrreg — 음편만 예외. いく 는 1류 く 인데 いいて 가 아니라 いって 입니다(★ 촉음 예외).
 */

var VERBS = [
  /* ── 1류 (5단) ── */
  { id:"v01", kana:"あらう",   word:"洗う",   group:1, meaning:["씻다"] },
  { id:"v02", kana:"のむ",     word:"飲む",   group:1, meaning:["마시다"] },
  { id:"v03", kana:"よむ",     word:"読む",   group:1, meaning:["읽다"] },
  { id:"v04", kana:"やすむ",   word:"休む",   group:1, meaning:["쉬다"] },
  { id:"v05", kana:"はなす",   word:"話す",   group:1, meaning:["이야기하다"] },
  { id:"v06", kana:"のる",     word:"乗る",   group:1, meaning:["타다"] },
  { id:"v07", kana:"あそぶ",   word:"遊ぶ",   group:1, meaning:["놀다"] },
  { id:"v08", kana:"さそう",   word:"さそう", group:1, meaning:["권하다"] },
  { id:"v09", kana:"まもる",   word:"まもる", group:1, meaning:["지키다"] },
  { id:"v10", kana:"しゃがむ", word:"しゃがむ", group:1, meaning:["쭈그리다", "움츠리다"] },
  { id:"v11", kana:"まつ",     word:"まつ",   group:1, meaning:["기다리다"] },
  { id:"v12", kana:"けす",     word:"消す",   group:1, meaning:["끄다"] },
  { id:"v13", kana:"よぶ",     word:"よぶ",   group:1, meaning:["부르다"] },
  { id:"v14", kana:"ならぶ",   word:"ならぶ", group:1, meaning:["늘어서다", "한 줄로 서다"] },
  { id:"v15", kana:"うたう",   word:"うたう", group:1, meaning:["노래하다"] },
  { id:"v16", kana:"つくる",   word:"つくる", group:1, meaning:["만들다"] },
  /* 음편 표의 예시 동사 — 단어장 3쪽. く·ぐ·う 규칙을 연습할 다른 동사가 범위에 없다. */
  { id:"v17", kana:"かう",     word:"かう",   group:1, meaning:["사다"],       note:"음편 예시 う→って" },
  { id:"v18", kana:"かく",     word:"かく",   group:1, meaning:["쓰다"],       note:"음편 예시 く→いて" },
  { id:"v19", kana:"およぐ",   word:"およぐ", group:1, meaning:["헤엄치다"],   note:"음편 예시 ぐ→いで" },

  /* ── 1류 · 음편 예외 ── */
  { id:"v20", kana:"いく", word:"行く", group:1, meaning:["가다"], teIrreg:"いって",
    note:"★ 1류 く 인데 음편만 예외 — いいて 가 아니라 いって" },

  /* ── 1류 · る 로 끝나는 예외 (단어장 4쪽) ── */
  { id:"v21", kana:"かえる", word:"帰る", group:1, tricky:true, meaning:["돌아가다", "돌아오다"] },
  { id:"v22", kana:"はいる", word:"入る", group:1, tricky:true, meaning:["들어가다", "들어오다"] },
  { id:"v23", kana:"はしる", word:"走る", group:1, tricky:true, meaning:["뛰다", "달리다"],
    ref:"단어장 4쪽 <자주 나오는 예외 1류 동사> 상자에만 — 본문 어휘에는 없다" },
  { id:"v24", kana:"しる",   word:"知る", group:1, tricky:true, meaning:["알다"],
    ref:"단어장 4쪽 <자주 나오는 예외 1류 동사> 상자에만 — 본문 어휘에는 없다" },
  { id:"v25", kana:"きる",   word:"切る", group:1, tricky:true, meaning:["자르다"],
    ref:"단어장 4쪽 <자주 나오는 예외 1류 동사> 상자에만 — 본문 어휘에는 없다" },

  /* ── 2류 (1단) ── */
  { id:"v26", kana:"おきる",     word:"起きる",   group:2, meaning:["일어나다"] },
  { id:"v27", kana:"たべる",     word:"食べる",   group:2, meaning:["먹다"] },
  { id:"v28", kana:"みる",       word:"見る",     group:2, meaning:["보다"] },
  { id:"v29", kana:"ねる",       word:"寝る",     group:2, meaning:["자다"] },
  { id:"v30", kana:"でる",       word:"でる",     group:2, meaning:["나가다"] },
  { id:"v31", kana:"あける",     word:"開ける",   group:2, meaning:["열다"] },
  { id:"v32", kana:"のりかえる", word:"のりかえる", group:2, meaning:["갈아타다"] },

  /* ── 3류 (불규칙) ── */
  { id:"v33", kana:"する",           word:"する",     group:3, meaning:["하다"] },
  { id:"v34", kana:"くる",           word:"来る",     group:3, meaning:["오다"] },
  { id:"v35", kana:"べんきょうする", word:"勉強する", group:3, meaning:["공부하다"] }
];

/* い형용사 — 단어장 4쪽 <い형용사 활용>.
   기본형 ~い / 부정형 ~くない / 연결형 ~くて / 과거형 ~かった
   いい 만 불규칙이라 활용형을 직접 적는다. 규칙대로면 いくない 가 되어 틀린 답을 가르친다. */
var ADJS = [
  { id:"a01", kana:"あぶない",   word:"あぶない",   meaning:["위험하다"] },
  { id:"a02", kana:"おおきい",   word:"大きい",     meaning:["크다"] },
  { id:"a03", kana:"こわい",     word:"こわい",     meaning:["무섭다"] },
  { id:"a04", kana:"むずかしい", word:"むずかしい", meaning:["어렵다"] },
  { id:"a05", kana:"おもしろい", word:"おもしろい", meaning:["재미있다"] },
  { id:"a06", kana:"いい",       word:"いい",       meaning:["좋다"], irregular:true,
    forms:{ neg:"よくない", te:"よくて", past:"よかった" },
    note:"★ 불규칙 — いくない 가 아니다" }
];

/* 동사 활용형과 배분.
   て 가 새로 들어와 30을 가져갔다. 규칙이 다섯 갈래(う·つ·る / ぬ·む·ぶ / く / ぐ / す)에
   촉음 예외까지 있어 가장 틀리기 쉽다. */
var FORMS = [
  { k:"tai",    nm:"たい형",    ko:"~하고 싶다", suffix:"たい",    weight:25 },
  { k:"te",     nm:"て형",      ko:"~하고/~해서", suffix:null,     weight:30 },
  { k:"masu",   nm:"ます형",    ko:"~합니다",    suffix:"ます",    weight:25 },
  { k:"mashou", nm:"ましょう형", ko:"~합시다",    suffix:"ましょう", weight:20 }
];

var ADJFORMS = [
  { k:"neg",  nm:"부정형", ko:"~지 않다", weight:40 },
  { k:"te",   nm:"연결형", ko:"~하고",   weight:25 },
  { k:"past", nm:"과거형", ko:"~했다",   weight:35 }
];

var GROUP_NM = { 1:"1류", 2:"2류", 3:"3류" };
