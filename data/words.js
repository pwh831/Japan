/* 일본어 단어 시험 — 단어 데이터
 *
 * 출처: 제6과 「ハナちゃん、あぶない!」 98~102쪽 (수령분)
 *   각 쪽 맨 아래 ことば 목록이 시험범위 단어입니다.
 *   교재가 단어를 가나로만 적어 놓으므로 word 와 kana 가 같습니다.
 *   표기는 교재 그대로 옮겼습니다 — 띄어쓰기·「～」까지.
 *
 * 아직 안 받은 쪽: 103쪽 이후 (5장 더 예정)
 */

var UNITS = [
  { code:"006a", title:"6과 · 동작 동사",   pages:"100쪽" },
  { code:"006b", title:"6과 · 주말·교통",   pages:"101쪽" },
  { code:"006c", title:"6과 · 지진 대처",   pages:"102쪽" }
];

var WORDS = [
  /* ── 100쪽 ことば · なにを する? (동작 동사 15) ── */
  { id:"j601", unit:"006a", pos:"동사", word:"おきる",       kana:"おきる",       meaning:["일어나다"] },
  { id:"j602", unit:"006a", pos:"동사", word:"あらう",       kana:"あらう",       meaning:["씻다"] },
  { id:"j603", unit:"006a", pos:"동사", word:"たべる",       kana:"たべる",       meaning:["먹다"] },
  { id:"j604", unit:"006a", pos:"동사", word:"のむ",         kana:"のむ",         meaning:["마시다"] },
  { id:"j605", unit:"006a", pos:"동사", word:"みる",         kana:"みる",         meaning:["보다"],
    examples:[{ ja:"ともだちと アニメを みる よていだよ。", ko:"친구와 애니메이션을 볼 예정이야.", form:"みる" }] },
  { id:"j606", unit:"006a", pos:"동사", word:"ねる",         kana:"ねる",         meaning:["자다"] },
  { id:"j607", unit:"006a", pos:"동사", word:"いく",         kana:"いく",         meaning:["가다"],
    examples:[{ ja:"ぼうさいセンターは どうやって いくのかな?", ko:"방재 센터는 어떻게 가는 걸까?", form:"いく" }] },
  { id:"j608", unit:"006a", pos:"동사", word:"べんきょうする", kana:"べんきょうする", meaning:["공부하다"] },
  { id:"j609", unit:"006a", pos:"동사", word:"よむ",         kana:"よむ",         meaning:["읽다"] },
  { id:"j610", unit:"006a", pos:"동사", word:"やすむ",       kana:"やすむ",       meaning:["쉬다"] },
  { id:"j611", unit:"006a", pos:"동사", word:"くる",         kana:"くる",         meaning:["오다"] },
  { id:"j612", unit:"006a", pos:"동사", word:"はなす",       kana:"はなす",       meaning:["말하다"] },
  { id:"j613", unit:"006a", pos:"동사", word:"かえる",       kana:"かえる",       meaning:["(집에) 돌아가다", "돌아오다"] },
  { id:"j614", unit:"006a", pos:"동사", word:"のる",         kana:"のる",         meaning:["타다"] },
  { id:"j615", unit:"006a", pos:"동사", word:"あそぶ",       kana:"あそぶ",       meaning:["놀다"],
    examples:[{ ja:"うみで あそぶ", ko:"바다에서 놀다", form:"あそぶ" }] },

  /* ── 101쪽 ことば · きいて はなしましょう (13) ── */
  { id:"j621", unit:"006b", pos:"명사", word:"しんじゅく",   kana:"しんじゅく",   meaning:["신주쿠"], note:"지명" },
  { id:"j622", unit:"006b", pos:"부사", word:"どうやって",   kana:"どうやって",   meaning:["어떻게 해서"],
    examples:[{ ja:"ぼうさいセンターは どうやって いくのかな?", ko:"방재 센터는 어떻게 가는 걸까?", form:"どうやって" }] },
  { id:"j623", unit:"006b", pos:"명사", word:"バス",         kana:"バス",         meaning:["버스"] },
  { id:"j624", unit:"006b", pos:"명사", word:"でんしゃ",     kana:"でんしゃ",     meaning:["전철"] },
  { id:"j625", unit:"006b", pos:"명사", word:"がっこう",     kana:"がっこう",     meaning:["학교"] },
  { id:"j626", unit:"006b", pos:"명사", word:"じてんしゃ",   kana:"じてんしゃ",   meaning:["자전거"] },
  { id:"j627", unit:"006b", pos:"명사", word:"しゅうまつ",   kana:"しゅうまつ",   meaning:["주말"],
    examples:[{ ja:"こんどの しゅうまつ、なに する?", ko:"이번 주말, 뭐 할래?", form:"しゅうまつ" }] },
  { id:"j628", unit:"006b", pos:"명사", word:"アニメ",       kana:"アニメ",       meaning:["애니메이션"],
    examples:[{ ja:"ともだちと アニメを みる よていだよ。", ko:"친구와 애니메이션을 볼 예정이야.", form:"アニメ" }] },
  { id:"j629", unit:"006b", pos:"표현", word:"～よていだ",   kana:"よていだ",     meaning:["예정이다"],
    jaAliases:["～よていだ"],
    examples:[{ ja:"ともだちと アニメを みる よていだよ。", ko:"친구와 애니메이션을 볼 예정이야.", form:"よてい" }] },
  { id:"j630", unit:"006b", pos:"표현", word:"かいものに いく", kana:"かいものに いく", meaning:["장 보러 가다", "쇼핑하러 가다"] },
  { id:"j631", unit:"006b", pos:"명사", word:"うんどう",     kana:"うんどう",     meaning:["운동"],
    examples:[{ ja:"うんどうを する", ko:"운동을 하다", form:"うんどう" }] },
  { id:"j632", unit:"006b", pos:"명사", word:"うみ",         kana:"うみ",         meaning:["바다"],
    examples:[{ ja:"うみで あそぶ", ko:"바다에서 놀다", form:"うみ" }] },
  { id:"j633", unit:"006b", pos:"조사", word:"～で",         kana:"で",           meaning:["에서"],
    jaAliases:["～で"], note:"장소" },

  /* ── 102쪽 ことば · どう しますか。(지진 대처 7 · ます형 그대로) ── */
  { id:"j641", unit:"006c", pos:"동사", word:"まもります",   kana:"まもります",   meaning:["지킵니다"],
    examples:[{ ja:"まず、あたまと からだを まもりましょう。", ko:"먼저, 머리와 몸을 지킵시다.", form:"まもり" }] },
  { id:"j642", unit:"006c", pos:"동사", word:"はいります",   kana:"はいります",   meaning:["들어갑니다"] },
  { id:"j643", unit:"006c", pos:"동사", word:"しゃがみます", kana:"しゃがみます", meaning:["쭈그려 앉습니다"] },
  { id:"j644", unit:"006c", pos:"동사", word:"まちます",     kana:"まちます",     meaning:["기다립니다"] },
  { id:"j645", unit:"006c", pos:"동사", word:"けします",     kana:"けします",     meaning:["끕니다"] },
  { id:"j646", unit:"006c", pos:"동사", word:"あけます",     kana:"あけます",     meaning:["엽니다"] },
  { id:"j647", unit:"006c", pos:"동사", word:"よびます",     kana:"よびます",     meaning:["부릅니다"] }
];
