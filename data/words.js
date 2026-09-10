/* 일본어 단어 시험 — 단어 데이터
 *
 * ⚠️ 지금 들어 있는 42항목은 학습지가 아니라 **샘플**입니다.
 *    학습지를 받으면 이 파일만 통째로 갈아 끼우면 됩니다. 앱은 건드릴 것이 없습니다.
 *
 * 필수 필드: id · unit · word · kana · meaning
 *   kana 는 한→일 유형의 정답 기준이므로 학습지 표기를 글자 하나까지 그대로 옮깁니다.
 *   장음 ー, 촉음 っ, 탁점, 히라가나/가타카나 구분이 전부 채점에 쓰입니다.
 */

var UNITS = [
  { code:"001", title:"1과 · 사람과 사물", pages:"샘플" },
  { code:"002", title:"2과 · 가족",        pages:"샘플" },
  { code:"003", title:"3과 · 음식",        pages:"샘플" },
  { code:"004", title:"4과 · 장소와 생활",  pages:"샘플" }
];

var WORDS = [
  /* ── 001 사람과 사물 ── */
  { id:"w101", unit:"001", pos:"명사", word:"学生",   kana:"がくせい",  meaning:["학생"],
    examples:[{ ja:"わたしは学生です。", ko:"저는 학생입니다.", form:"学生" }] },
  { id:"w102", unit:"001", pos:"명사", word:"先生",   kana:"せんせい",  meaning:["선생님"] },
  { id:"w103", unit:"001", pos:"명사", word:"友達",   kana:"ともだち",  meaning:["친구"],
    examples:[{ ja:"友達と映画を見ます。", ko:"친구와 영화를 봅니다.", form:"友達" }] },
  { id:"w104", unit:"001", pos:"명사", word:"名前",   kana:"なまえ",    meaning:["이름"] },
  { id:"w105", unit:"001", pos:"명사", word:"本",     kana:"ほん",      meaning:["책"],
    examples:[{ ja:"これは本です。", ko:"이것은 책입니다.", form:"本" }] },
  { id:"w106", unit:"001", pos:"명사", word:"かばん", kana:"かばん",    meaning:["가방"] },
  { id:"w107", unit:"001", pos:"명사", word:"時計",   kana:"とけい",    meaning:["시계"] },
  { id:"w108", unit:"001", pos:"명사", word:"電話",   kana:"でんわ",    meaning:["전화"],
    examples:[{ ja:"母に電話をかけます。", ko:"어머니께 전화를 겁니다.", form:"電話" }] },
  { id:"w109", unit:"001", pos:"명사", word:"車",     kana:"くるま",    meaning:["자동차", "차"] },
  { id:"w110", unit:"001", pos:"명사", word:"かさ",   kana:"かさ",      meaning:["우산"] },

  /* ── 002 가족 ── */
  { id:"w201", unit:"002", pos:"명사", word:"家族",   kana:"かぞく",    meaning:["가족"] },
  { id:"w202", unit:"002", pos:"명사", word:"父",     kana:"ちち",      meaning:["아버지"], note:"자기 아버지를 남에게 말할 때" },
  { id:"w203", unit:"002", pos:"명사", word:"母",     kana:"はは",      meaning:["어머니"], note:"자기 어머니를 남에게 말할 때" },
  { id:"w204", unit:"002", pos:"명사", word:"兄",     kana:"あに",      meaning:["형", "오빠"] },
  { id:"w205", unit:"002", pos:"명사", word:"姉",     kana:"あね",      meaning:["누나", "언니"] },
  { id:"w206", unit:"002", pos:"명사", word:"弟",     kana:"おとうと",  meaning:["남동생"] },
  { id:"w207", unit:"002", pos:"명사", word:"妹",     kana:"いもうと",  meaning:["여동생"] },
  { id:"w208", unit:"002", pos:"명사", word:"子供",   kana:"こども",    meaning:["아이", "어린이"] },

  /* ── 003 음식 ── */
  { id:"w301", unit:"003", pos:"명사", word:"食べ物", kana:"たべもの",  meaning:["음식", "먹을 것"],
    examples:[{ ja:"好きな食べ物は何ですか。", ko:"좋아하는 음식은 무엇입니까?", form:"食べ物" }] },
  { id:"w302", unit:"003", pos:"명사", word:"飲み物", kana:"のみもの",  meaning:["음료", "마실 것"] },
  { id:"w303", unit:"003", pos:"명사", word:"ご飯",   kana:"ごはん",    meaning:["밥"] },
  { id:"w304", unit:"003", pos:"명사", word:"パン",   kana:"パン",      meaning:["빵"],
    examples:[{ ja:"朝はパンを食べます。", ko:"아침에는 빵을 먹습니다.", form:"パン" }] },
  { id:"w305", unit:"003", pos:"명사", word:"コーヒー", kana:"コーヒー", meaning:["커피"],
    examples:[{ ja:"毎朝コーヒーを飲みます。", ko:"매일 아침 커피를 마십니다.", form:"コーヒー" }] },
  { id:"w306", unit:"003", pos:"명사", word:"牛乳",   kana:"ぎゅうにゅう", meaning:["우유"],
    examples:[{ ja:"牛乳を買いました。", ko:"우유를 샀습니다.", form:"牛乳" }] },
  { id:"w307", unit:"003", pos:"명사", word:"卵",     kana:"たまご",    meaning:["달걀", "계란"] },
  { id:"w308", unit:"003", pos:"명사", word:"野菜",   kana:"やさい",    meaning:["채소", "야채"],
    examples:[{ ja:"野菜が好きです。", ko:"채소를 좋아합니다.", form:"野菜" }] },
  { id:"w309", unit:"003", pos:"명사", word:"果物",   kana:"くだもの",  meaning:["과일"] },
  { id:"w310", unit:"003", pos:"명사", word:"お茶",   kana:"おちゃ",    meaning:["차"] },
  { id:"w311", unit:"003", pos:"명사", word:"ラーメン", kana:"ラーメン", meaning:["라면", "라멘"] },
  { id:"w312", unit:"003", pos:"명사", word:"ケーキ", kana:"ケーキ",    meaning:["케이크"] },
  { id:"w313", unit:"003", pos:"명사", word:"水",     kana:"みず",      meaning:["물"] },

  /* ── 004 장소와 생활 ── */
  { id:"w401", unit:"004", pos:"명사", word:"学校",   kana:"がっこう",  meaning:["학교"],
    examples:[{ ja:"学校へ行きます。", ko:"학교에 갑니다.", form:"学校" }] },
  { id:"w402", unit:"004", pos:"명사", word:"病院",   kana:"びょういん", meaning:["병원"] },
  { id:"w403", unit:"004", pos:"명사", word:"駅",     kana:"えき",      meaning:["역"],
    examples:[{ ja:"駅で友達に会いました。", ko:"역에서 친구를 만났습니다.", form:"駅" }] },
  { id:"w404", unit:"004", pos:"명사", word:"店",     kana:"みせ",      meaning:["가게"] },
  { id:"w405", unit:"004", pos:"명사", word:"部屋",   kana:"へや",      meaning:["방"],
    examples:[{ ja:"部屋を掃除します。", ko:"방을 청소합니다.", form:"部屋" }] },
  { id:"w406", unit:"004", pos:"명사", word:"窓",     kana:"まど",      meaning:["창문"] },
  { id:"w407", unit:"004", pos:"명사", word:"切手",   kana:"きって",    meaning:["우표"],
    examples:[{ ja:"切手を三枚ください。", ko:"우표를 세 장 주세요.", form:"切手" }] },
  { id:"w408", unit:"004", pos:"명사", word:"手紙",   kana:"てがみ",    meaning:["편지"] },
  { id:"w409", unit:"004", pos:"명사", word:"新聞",   kana:"しんぶん",  meaning:["신문"],
    examples:[{ ja:"毎朝新聞を読みます。", ko:"매일 아침 신문을 읽습니다.", form:"新聞" }] },
  { id:"w410", unit:"004", pos:"명사", word:"テレビ", kana:"テレビ",    meaning:["텔레비전", "티브이"],
    examples:[{ ja:"毎晩テレビを見ます。", ko:"매일 밤 텔레비전을 봅니다.", form:"テレビ" }] },
  { id:"w411", unit:"004", pos:"명사", word:"パソコン", kana:"パソコン", meaning:["컴퓨터"],
    examples:[{ ja:"パソコンで仕事をします。", ko:"컴퓨터로 일을 합니다.", form:"パソコン" }] },
  { id:"w412", unit:"004", pos:"명사", word:"傘",     kana:"かさ",      meaning:["우산"], skip:true }
];

/* w412 는 w110 과 같은 단어라 중복 — skip:true 인 항목은 출제에서 빠진다.
   학습지에서 같은 단어가 두 과에 나올 때 쓰는 표시입니다. */
