/* 일본어 단어 시험 — 단어 데이터
 *
 * 출처: 제6과 「ハナちゃん、あぶない!」 98~107쪽 (수령분)
 *   각 쪽 맨 아래 ことば 목록이 시험범위 단어입니다.
 *   교재가 단어를 가나로만 적어 놓으므로 word 와 kana 가 같습니다.
 *   표기는 교재 그대로 옮겼습니다 — 띄어쓰기·「～」까지.
 *
 * 아직 안 받은 쪽: 108쪽 이후 (교재 PDF 기준 14쪽 중 10쪽까지 받음)
 *
 * 105·107쪽은 정리하기(문법 요약)라 ことば 목록이 없습니다.
 * 107쪽의 동사 활용표는 단어가 아니라 활용 규칙이므로 여기 넣지 않았습니다.
 */

var UNITS = [
  { code:"006a", title:"6과 · 동작 동사",   pages:"100쪽" },
  { code:"006b", title:"6과 · 주말·교통",   pages:"101쪽" },
  { code:"006c", title:"6과 · 지진 대처",   pages:"102쪽" },
  { code:"006d", title:"6과 · 권유·지시",   pages:"103쪽" },
  { code:"006e", title:"6과 · 대화 · 주말 약속", pages:"104쪽" },
  { code:"006f", title:"6과 · 대화 · 지진 체험", pages:"106쪽" }
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
  { id:"j647", unit:"006c", pos:"동사", word:"よびます",     kana:"よびます",     meaning:["부릅니다"],
    examples:[{ ja:"おおきい こえで たすけを よびます。", ko:"큰 목소리로 도움을 부릅니다.", form:"よびます" }] },

  /* ── 103쪽 ことば · きいて はなしましょう (8) ── */
  { id:"j651", unit:"006d", pos:"부사", word:"まず",         kana:"まず",         meaning:["우선", "먼저"],
    examples:[{ ja:"まず、あたまと からだを まもりましょう。", ko:"먼저, 머리와 몸을 지킵시다.", form:"まず" }] },
  { id:"j652", unit:"006d", pos:"접속", word:"それから",     kana:"それから",     meaning:["그리고", "그다음에"],
    examples:[{ ja:"それから、ひを けします。", ko:"그리고, 불을 끕니다.", form:"それから" }] },
  { id:"j653", unit:"006d", pos:"명사", word:"しんごう",     kana:"しんごう",     meaning:["신호", "신호등"],
    examples:[{ ja:"しんごうを まもりましょう。", ko:"신호를 지킵시다.", form:"しんごう" }] },
  { id:"j654", unit:"006d", pos:"동사", word:"あらいましょう", kana:"あらいましょう", meaning:["씻읍시다"],
    examples:[{ ja:"てを あらいましょう。", ko:"손을 씻읍시다.", form:"あらいましょう" }] },
  { id:"j655", unit:"006d", pos:"명사", word:"プール",       kana:"プール",       meaning:["수영장"],
    examples:[{ ja:"プールから でましょう。", ko:"수영장에서 나갑시다.", form:"プール" }] },
  { id:"j656", unit:"006d", pos:"동사", word:"でましょう",   kana:"でましょう",   meaning:["나갑시다"],
    examples:[{ ja:"プールから でましょう。", ko:"수영장에서 나갑시다.", form:"でましょう" }] },
  { id:"j657", unit:"006d", pos:"명사", word:"て",           kana:"て",           meaning:["손"],
    examples:[{ ja:"てを あらいましょう。", ko:"손을 씻읍시다.", form:"て" }] },
  { id:"j658", unit:"006d", pos:"동사", word:"まもりましょう", kana:"まもりましょう", meaning:["지킵시다"],
    examples:[{ ja:"しんごうを まもりましょう。", ko:"신호를 지킵시다.", form:"まもりましょう" }] },

  /* ── 104쪽 ことば · 읽고 쓰기 1 (10) ── */
  { id:"j661", unit:"006e", pos:"명사", word:"こんど",       kana:"こんど",       meaning:["이번", "이다음"],
    examples:[{ ja:"なみちゃん、こんどの しゅうまつ、なに する?", ko:"나미야, 이번 주말에 뭐 할래?", form:"こんど" }] },
  { id:"j662", unit:"006e", pos:"부사", word:"とくに",       kana:"とくに",       meaning:["특별히"],
    examples:[{ ja:"とくに よていは ないけど……。", ko:"특별히 예정은 없는데…….", form:"とくに" }] },
  { id:"j663", unit:"006e", pos:"표현", word:"～けど",       kana:"けど",         meaning:["(이)지만"], jaAliases:["～けど"],
    examples:[{ ja:"とくに よていは ないけど……。", ko:"특별히 예정은 없는데…….", form:"けど" }] },
  { id:"j664", unit:"006e", pos:"표현", word:"どこか",       kana:"どこか",       meaning:["어디인가"],
    note:"どこが(어디가)와 헷갈리지 않게",
    examples:[{ ja:"いっしょに どこか いく?", ko:"같이 어딘가 갈래?", form:"どこか" }] },
  { id:"j665", unit:"006e", pos:"명사", word:"ぼうさいセンター", kana:"ぼうさいセンター", meaning:["방재 센터"],
    examples:[{ ja:"ぼうさいセンターは どうやって いくのかなあ?", ko:"방재 센터는 어떻게 가는 걸까?", form:"ぼうさいセンター" }] },
  { id:"j666", unit:"006e", pos:"표현", word:"もう すぐ",   kana:"もう すぐ",   meaning:["이제 곧"],
    examples:[{ ja:"もう すぐ ぼうさいの ひだから。", ko:"이제 곧 방재의 날이니까.", form:"もう すぐ" }] },
  { id:"j667", unit:"006e", pos:"명사", word:"ぼうさいの ひ", kana:"ぼうさいの ひ", meaning:["방재의 날"],
    examples:[{ ja:"もう すぐ ぼうさいの ひだから。", ko:"이제 곧 방재의 날이니까.", form:"ぼうさいの ひ" }] },
  { id:"j668", unit:"006e", pos:"표현", word:"～だから",     kana:"だから",       meaning:["(이)므로", "(이)니까"], jaAliases:["～だから"],
    examples:[{ ja:"もう すぐ ぼうさいの ひだから。", ko:"이제 곧 방재의 날이니까.", form:"だから" }] },
  { id:"j669", unit:"006e", pos:"동사", word:"さそう",       kana:"さそう",       meaning:["권하다", "권유하다"],
    examples:[{ ja:"ひなたくんも さそう?", ko:"히나타도 부를까?", form:"さそう" }] },
  { id:"j670", unit:"006e", pos:"표현", word:"～かなあ",     kana:"かなあ",       meaning:["일까?"], jaAliases:["～かなあ"],
    examples:[{ ja:"ぼうさいセンターは どうやって いくのかなあ?", ko:"방재 센터는 어떻게 가는 걸까?", form:"かなあ" }] },

  /* ── 106쪽 ことば · 읽고 쓰기 2 (14 · それから 는 103쪽과 겹쳐 j652 하나로 둠) ── */
  { id:"j681", unit:"006f", pos:"명사", word:"じしん",       kana:"じしん",       meaning:["지진"],
    examples:[{ ja:"じしんの ときは、まず、どう しますか。", ko:"지진이 났을 때는, 먼저, 어떻게 합니까?", form:"じしん" }] },
  { id:"j682", unit:"006f", pos:"명사", word:"とき",         kana:"とき",         meaning:["때"],
    examples:[{ ja:"じしんの ときは、まず、どう しますか。", ko:"지진이 났을 때는, 먼저, 어떻게 합니까?", form:"とき" }] },
  { id:"j683", unit:"006f", pos:"い형용사", word:"おおきい", kana:"おおきい",     meaning:["크다"],
    examples:[{ ja:"おおきい こえで たすけを よびます。", ko:"큰 목소리로 도움을 부릅니다.", form:"おおきい" }] },
  { id:"j684", unit:"006f", pos:"표현", word:"こえで",       kana:"こえで",       meaning:["목소리로"],
    examples:[{ ja:"おおきい こえで たすけを よびます。", ko:"큰 목소리로 도움을 부릅니다.", form:"こえで" }] },
  { id:"j685", unit:"006f", pos:"명사", word:"たすけ",       kana:"たすけ",       meaning:["도움"],
    examples:[{ ja:"おおきい こえで たすけを よびます。", ko:"큰 목소리로 도움을 부릅니다.", form:"たすけ" }] },
  { id:"j686", unit:"006f", pos:"동사", word:"ちがいます",   kana:"ちがいます",   meaning:["틀립니다", "다릅니다"],
    examples:[{ ja:"いいえ、ちがいます。", ko:"아니요, 틀렸습니다.", form:"ちがいます" }] },
  { id:"j687", unit:"006f", pos:"명사", word:"あたま",       kana:"あたま",       meaning:["머리"],
    examples:[{ ja:"まず、あたまと からだを まもりましょう。", ko:"먼저, 머리와 몸을 지킵시다.", form:"あたま" }] },
  { id:"j688", unit:"006f", pos:"명사", word:"からだ",       kana:"からだ",       meaning:["몸"],
    examples:[{ ja:"まず、あたまと からだを まもりましょう。", ko:"먼저, 머리와 몸을 지킵시다.", form:"からだ" }] },
  { id:"j689", unit:"006f", pos:"명사", word:"ドア",         kana:"ドア",         meaning:["문"],
    examples:[{ ja:"ドアや まどを あけます。", ko:"문이랑 창문을 엽니다.", form:"ドア" }] },
  { id:"j690", unit:"006f", pos:"조사", word:"～や",         kana:"や",           meaning:["(이)랑"], jaAliases:["～や"],
    examples:[{ ja:"つくえや テーブルの したに はいります。", ko:"책상이나 테이블 밑에 들어갑니다.", form:"や" }] },
  { id:"j691", unit:"006f", pos:"い형용사", word:"あぶない", kana:"あぶない",     meaning:["위험해", "위험하다"],
    examples:[{ ja:"ハナちゃん、あぶない!", ko:"하나야, 위험해!", form:"あぶない" }] },
  { id:"j692", unit:"006f", pos:"표현", word:"きを つけて", kana:"きを つけて", meaning:["조심해"],
    examples:[{ ja:"あぶない! きを つけて!", ko:"위험해! 조심해!", form:"きを つけて" }] },
  { id:"j693", unit:"006f", pos:"부사", word:"はやく",       kana:"はやく",       meaning:["빨리"],
    examples:[{ ja:"はやく、はやく!", ko:"빨리, 빨리!", form:"はやく" }] }
];
