/* 시험 1 · 단어 데이터
 *
 * 출처: 선생님이 주신 「2026 일본어 회화 (2학기 1회고사 단어)」 4쪽 — 이것이 시험범위입니다.
 *   교재(제6과 98~107쪽)에서 뽑았던 66단어는 이 단어장에 63개가 그대로 들어 있어
 *   합쳐 두었습니다. 단어장에 없던 3개(しんじゅく·あけます·かなあ)는 뺐습니다.
 *
 * 표기: 단어장이 한자+후리가나로 적은 것은 word 에 한자를, kana 에 읽기를 넣습니다.
 *   정답 기준은 여전히 kana 입니다(PRD §7.1) — 단어장이 후리가나를 달아 주므로
 *   한자는 읽을 줄만 알면 됩니다. 한자로 써도 정답으로 칩니다.
 *
 * 가나 종류: 교과서에 히라가나·가타카나 두 가지로 다 적힌 어휘만 아무 쪽으로 써도
 *   정답입니다(선생님 기준). 그런 어휘에는 kanaAny:true 를 답니다 — 지금 범위에는 없습니다.
 *
 * 문형·규칙(명사+だから, ~ませんか, Aと Bと どちらが …)은 시험 2(data/phrases.js),
 * 활용표(ます·ましょう·たい·て형, い형용사)는 시험 3(data/verbs.js)에 있습니다.
 */

var UNITS = [
  { code:"s1", title:"동작 · 교통",   pages:"단어장 1쪽" },
  { code:"s2", title:"지진 · 희망",   pages:"단어장 2쪽" },
  { code:"s3", title:"약속 · 여행",   pages:"단어장 3쪽" },
  { code:"s4", title:"이동 · 비교",   pages:"단어장 4쪽" }
];

var WORDS = [
  /* ═══ 단어장 1쪽 ═══ */
  { id:"w101", unit:"s1", pos:"い형용사", word:"あぶない", kana:"あぶない", meaning:["위험하다"],
    examples:[{ ja:"ハナちゃん、あぶない!", ko:"하나야, 위험해!", form:"あぶない" }] },
  { id:"w102", unit:"s1", pos:"표현", word:"何を する?", kana:"なにを する", meaning:["무엇을 할래?"],
    jaAliases:["何を する?","なにを する?"] },
  { id:"w103", unit:"s1", pos:"동사", word:"起きる",   kana:"おきる",   meaning:["일어나다"], note:"2류" },
  { id:"w104", unit:"s1", pos:"동사", word:"洗う",     kana:"あらう",   meaning:["씻다"], note:"1류",
    examples:[{ ja:"てを あらいましょう。", ko:"손을 씻읍시다.", form:"あらい" }] },
  { id:"w105", unit:"s1", pos:"동사", word:"食べる",   kana:"たべる",   meaning:["먹다"], note:"2류" },
  { id:"w106", unit:"s1", pos:"동사", word:"飲む",     kana:"のむ",     meaning:["마시다"], note:"1류" },
  { id:"w107", unit:"s1", pos:"동사구", word:"アニメを 見る", kana:"アニメを みる", meaning:["애니메이션을 보다"], note:"2류",
    examples:[{ ja:"ともだちと アニメを みる よていだよ。", ko:"친구와 애니메이션을 볼 예정이야.", form:"アニメを みる" }] },
  { id:"w108", unit:"s1", pos:"동사", word:"寝る",     kana:"ねる",     meaning:["자다"], note:"2류" },
  { id:"w109", unit:"s1", pos:"동사", word:"行く",     kana:"いく",     meaning:["가다"], note:"1류" },
  { id:"w110", unit:"s1", pos:"동사", word:"勉強する", kana:"べんきょうする", meaning:["공부하다"], note:"3류" },
  { id:"w111", unit:"s1", pos:"동사", word:"読む",     kana:"よむ",     meaning:["읽다"], note:"1류" },
  { id:"w112", unit:"s1", pos:"동사", word:"休む",     kana:"やすむ",   meaning:["쉬다"], note:"1류" },
  { id:"w113", unit:"s1", pos:"동사", word:"来る",     kana:"くる",     meaning:["오다"], note:"3류" },
  { id:"w114", unit:"s1", pos:"동사", word:"話す",     kana:"はなす",   meaning:["이야기하다"], note:"1류" },
  { id:"w115", unit:"s1", pos:"동사", word:"帰る",     kana:"かえる",   meaning:["돌아가다", "돌아오다"], note:"★ 예외 1류" },
  { id:"w116", unit:"s1", pos:"동사구", word:"～に 乗る", kana:"に のる", meaning:["~을/를 타다"], note:"1류",
    jaAliases:["～に のる","のる"] },
  { id:"w117", unit:"s1", pos:"동사구", word:"友だちと 遊ぶ", kana:"ともだちと あそぶ", meaning:["친구와 놀다"], note:"1류" },
  { id:"w118", unit:"s1", pos:"명사", word:"バス",     kana:"バス",     meaning:["버스"],
    examples:[{ ja:"えきから バスが あるよ。", ko:"역에서 (가는) 버스가 있어." }] },
  { id:"w119", unit:"s1", pos:"명사", word:"電車",     kana:"でんしゃ", meaning:["전철"] },
  { id:"w120", unit:"s1", pos:"명사", word:"タクシー", kana:"タクシー", meaning:["택시"] },
  { id:"w121", unit:"s1", pos:"명사", word:"自転車",   kana:"じてんしゃ", meaning:["자전거"] },
  { id:"w122", unit:"s1", pos:"표현", word:"こんどの しゅうまつ", kana:"こんどの しゅうまつ", meaning:["이번 주말"],
    examples:[{ ja:"こんどの しゅうまつ、なに する?", ko:"이번 주말, 뭐 할래?", form:"こんどの しゅうまつ" }] },
  { id:"w123", unit:"s1", pos:"표현", word:"～に いく", kana:"に いく", meaning:["~하러 가다"], note:"목적",
    jaAliases:["～に いく"] },
  { id:"w124", unit:"s1", pos:"동사구", word:"かいものに いく", kana:"かいものに いく", meaning:["쇼핑하러 가다", "장 보러 가다"], note:"1류" },
  { id:"w125", unit:"s1", pos:"동사구", word:"運動を する", kana:"うんどうを する", meaning:["운동을 하다"], note:"3류" },
  { id:"w126", unit:"s1", pos:"동사구", word:"海で あそぶ", kana:"うみで あそぶ", meaning:["바다에서 놀다"], note:"1류" },
  { id:"w127", unit:"s1", pos:"표현", word:"どう しますか", kana:"どう しますか", meaning:["어떻게 합니까?"] },
  { id:"w128", unit:"s1", pos:"동사", word:"まもる",   kana:"まもる",   meaning:["지키다"], note:"1류" },
  { id:"w129", unit:"s1", pos:"동사", word:"はいる",   kana:"はいる",   meaning:["들어가다", "들어오다"], note:"★ 예외 1류" },
  { id:"w130", unit:"s1", pos:"동사", word:"しゃがむ", kana:"しゃがむ", meaning:["쭈그리다", "움츠리다"], note:"1류" },
  { id:"w131", unit:"s1", pos:"동사", word:"まつ",     kana:"まつ",     meaning:["기다리다"], note:"1류" },
  { id:"w132", unit:"s1", pos:"동사", word:"けす",     kana:"けす",     meaning:["끄다"], note:"1류" },
  { id:"w133", unit:"s1", pos:"동사", word:"よぶ",     kana:"よぶ",     meaning:["부르다"], note:"1류" },
  { id:"w134", unit:"s1", pos:"명사", word:"信号",     kana:"しんごう", meaning:["신호", "신호등"],
    examples:[{ ja:"しんごうを まもりましょう。", ko:"신호를 지킵시다.", form:"しんごう" }] },
  { id:"w135", unit:"s1", pos:"명사", word:"プール",   kana:"プール",   meaning:["수영장", "풀"],
    examples:[{ ja:"プールから でましょう。", ko:"수영장에서 나갑시다.", form:"プール" }] },
  { id:"w136", unit:"s1", pos:"명사", word:"手",       kana:"て",       meaning:["손"],
    examples:[{ ja:"てを あらいましょう。", ko:"손을 씻읍시다.", form:"て" }] },
  { id:"w137", unit:"s1", pos:"동사", word:"あらう",   kana:"あらう",   meaning:["씻다"], note:"1류 · 권유형 あらいましょう", skip:true },
  { id:"w138", unit:"s1", pos:"동사", word:"でる",     kana:"でる",     meaning:["나가다"], note:"2류" },
  { id:"w139", unit:"s1", pos:"부사", word:"とくに",   kana:"とくに",   meaning:["특별히"],
    examples:[{ ja:"とくに よていは ないけど……。", ko:"특별히 예정은 없는데…….", form:"とくに" }] },
  { id:"w140", unit:"s1", pos:"명사", word:"予定",     kana:"よてい",   meaning:["예정"] },
  { id:"w141", unit:"s1", pos:"동사", word:"ない",     kana:"ない",     meaning:["없다"] },
  { id:"w142", unit:"s1", pos:"동사", word:"ある",     kana:"ある",     meaning:["있다"], note:"1류" },

  /* ═══ 단어장 2쪽 ═══ */
  { id:"w201", unit:"s2", pos:"부사", word:"いっしょに", kana:"いっしょに", meaning:["함께", "같이"],
    examples:[{ ja:"いっしょに どこか いく?", ko:"같이 어딘가 갈래?" }] },
  { id:"w202", unit:"s2", pos:"표현", word:"どこか",   kana:"どこか",   meaning:["어딘가"], note:"どこが(어디가)와 구별",
    examples:[{ ja:"いっしょに どこか いく?", ko:"같이 어딘가 갈래?" }] },
  { id:"w203", unit:"s2", pos:"표현", word:"どこが",   kana:"どこが",   meaning:["어디가"], note:"どこか(어딘가)와 구별" },
  { id:"w204", unit:"s2", pos:"명사", word:"ぼうさいセンター", kana:"ぼうさいセンター", meaning:["방재 센터"],
    examples:[{ ja:"ぼうさいセンターは どうやって いくのかな?", ko:"방재 센터는 어떻게 가는 걸까?", form:"ぼうさいセンター" }] },
  { id:"w205", unit:"s2", pos:"표현", word:"どう",     kana:"どう",     meaning:["어때?"] },
  { id:"w206", unit:"s2", pos:"표현", word:"もう すぐ", kana:"もう すぐ", meaning:["이제 곧"],
    examples:[{ ja:"もう すぐ ぼうさいの ひだから。", ko:"이제 곧 방재의 날이니까.", form:"もう すぐ" }] },
  { id:"w207", unit:"s2", pos:"명사", word:"ぼうさいの 日", kana:"ぼうさいの ひ", meaning:["방재의 날"],
    examples:[{ ja:"もう すぐ ぼうさいの ひだから。", ko:"이제 곧 방재의 날이니까." }] },
  { id:"w208", unit:"s2", pos:"동사", word:"さそう",   kana:"さそう",   meaning:["권하다", "권유하다"], note:"1류",
    examples:[{ ja:"ひなたくんも さそう?", ko:"히나타도 부를까?", form:"さそう" }] },
  { id:"w209", unit:"s2", pos:"부사", word:"どうやって", kana:"どうやって", meaning:["어떻게 해서", "어떻게"],
    examples:[{ ja:"ぼうさいセンターは どうやって いくのかな?", ko:"방재 센터는 어떻게 가는 걸까?" }] },
  { id:"w210", unit:"s2", pos:"표현", word:"～かな",   kana:"かな",     meaning:["~일까나"], jaAliases:["～かな"] },
  { id:"w211", unit:"s2", pos:"명사", word:"駅",       kana:"えき",     meaning:["역"],
    examples:[{ ja:"えきから バスが あるよ。", ko:"역에서 (가는) 버스가 있어." }] },
  { id:"w212", unit:"s2", pos:"조사", word:"から",     kana:"から",     meaning:["~에서", "~부터"],
    examples:[{ ja:"えきから バスが あるよ。", ko:"역에서 (가는) 버스가 있어." }] },
  { id:"w213", unit:"s2", pos:"명사", word:"じしん",   kana:"じしん",   meaning:["지진"],
    examples:[{ ja:"じしんの ときは、まず、どう しますか。", ko:"지진이 났을 때는, 먼저, 어떻게 합니까?" }] },
  { id:"w214", unit:"s2", pos:"표현", word:"じしんの とき", kana:"じしんの とき", meaning:["지진이 날 때"],
    examples:[{ ja:"じしんの ときは、まず、どう しますか。", ko:"지진이 났을 때는, 먼저, 어떻게 합니까?", form:"じしんの とき" }] },
  { id:"w215", unit:"s2", pos:"부사", word:"まず",     kana:"まず",     meaning:["우선", "먼저"],
    examples:[{ ja:"まず、あたまと からだを まもりましょう。", ko:"먼저, 머리와 몸을 지킵시다.", form:"まず" }] },
  { id:"w216", unit:"s2", pos:"い형용사", word:"大きい", kana:"おおきい", meaning:["크다"],
    examples:[{ ja:"おおきい こえで たすけを よびます。", ko:"큰 목소리로 도움을 부릅니다.", form:"おおきい" }] },
  { id:"w217", unit:"s2", pos:"표현", word:"声で",     kana:"こえで",   meaning:["목소리로"],
    examples:[{ ja:"おおきい こえで たすけを よびます。", ko:"큰 목소리로 도움을 부릅니다." }] },
  { id:"w218", unit:"s2", pos:"명사", word:"たすけ",   kana:"たすけ",   meaning:["도움"],
    examples:[{ ja:"おおきい こえで たすけを よびます。", ko:"큰 목소리로 도움을 부릅니다." }] },
  { id:"w219", unit:"s2", pos:"표현", word:"いいえ、ちがいます", kana:"いいえ、ちがいます", meaning:["아니요, 틀렸습니다"] },
  { id:"w220", unit:"s2", pos:"명사", word:"つくえ",   kana:"つくえ",   meaning:["책상"],
    examples:[{ ja:"つくえや テーブルの したに はいります。", ko:"책상이나 테이블 밑에 들어갑니다." }] },
  { id:"w221", unit:"s2", pos:"명사", word:"テーブル", kana:"テーブル", meaning:["테이블"],
    examples:[{ ja:"つくえや テーブルの したに はいります。", ko:"책상이나 테이블 밑에 들어갑니다." }] },
  { id:"w222", unit:"s2", pos:"조사", word:"や",       kana:"や",       meaning:["~랑", "~이나"], jaAliases:["～や"],
    examples:[{ ja:"つくえや テーブルの したに はいります。", ko:"책상이나 테이블 밑에 들어갑니다.", form:"や" }] },
  { id:"w223", unit:"s2", pos:"명사", word:"下",       kana:"した",     meaning:["아래", "밑"],
    examples:[{ ja:"つくえや テーブルの したに はいります。", ko:"책상이나 테이블 밑에 들어갑니다." }] },
  { id:"w224", unit:"s2", pos:"명사", word:"頭",       kana:"あたま",   meaning:["머리"],
    examples:[{ ja:"まず、あたまと からだを まもりましょう。", ko:"먼저, 머리와 몸을 지킵시다." }] },
  { id:"w225", unit:"s2", pos:"명사", word:"体",       kana:"からだ",   meaning:["몸"],
    examples:[{ ja:"まず、あたまと からだを まもりましょう。", ko:"먼저, 머리와 몸을 지킵시다." }] },
  { id:"w226", unit:"s2", pos:"접속", word:"それから", kana:"それから", meaning:["그리고", "그다음에"],
    examples:[{ ja:"それから、ひを けします。", ko:"그리고, 불을 끕니다.", form:"それから" }] },
  { id:"w227", unit:"s2", pos:"명사", word:"火",       kana:"ひ",       meaning:["불"],
    examples:[{ ja:"それから、ひを けします。", ko:"그리고, 불을 끕니다." }] },
  { id:"w228", unit:"s2", pos:"동사", word:"消す",     kana:"けす",     meaning:["끄다"], note:"1류", skip:true },
  { id:"w229", unit:"s2", pos:"명사", word:"ドア",     kana:"ドア",     meaning:["문"],
    examples:[{ ja:"ドアや まどを あけます。", ko:"문이랑 창문을 엽니다.", form:"ドア" }] },
  { id:"w230", unit:"s2", pos:"명사", word:"窓",       kana:"まど",     meaning:["창문"],
    examples:[{ ja:"ドアや まどを あけます。", ko:"문이랑 창문을 엽니다." }] },
  { id:"w231", unit:"s2", pos:"동사", word:"開ける",   kana:"あける",   meaning:["열다"], note:"2류" },
  { id:"w232", unit:"s2", pos:"표현", word:"気を つけて！", kana:"きを つけて", meaning:["조심해!"], note:"★ 반드시 출제 (선생님, 6과 106쪽)",
    jaAliases:["きを つけて！","気を つけて"],
    examples:[{ ja:"あぶない! きを つけて!", ko:"위험해! 조심해!", form:"きを つけて" }] },
  { id:"w233", unit:"s2", pos:"부사", word:"はやく",   kana:"はやく",   meaning:["빨리"],
    examples:[{ ja:"はやく、はやく!", ko:"빨리, 빨리!", form:"はやく" }] },
  { id:"w234", unit:"s2", pos:"표현", word:"いつに しますか", kana:"いつに しますか", meaning:["언제로 하겠습니까?"] },
  { id:"w235", unit:"s2", pos:"표현", word:"～には",   kana:"には",     meaning:["~에는"], jaAliases:["～には"] },
  { id:"w236", unit:"s2", pos:"표현", word:"いつ",     kana:"いつ",     meaning:["언제"] },

  /* ═══ 단어장 3쪽 ═══ */
  { id:"w301", unit:"s3", pos:"명사", word:"７月",     kana:"しちがつ", meaning:["7월"] },
  { id:"w302", unit:"s3", pos:"명사", word:"２０日",   kana:"はつか",   meaning:["20일"], note:"날짜 예외 읽기" },
  { id:"w303", unit:"s3", pos:"표현", word:"～から～まで", kana:"から まで", meaning:["~부터 ~까지"],
    jaAliases:["～から～まで","からまで"] },
  { id:"w304", unit:"s3", pos:"명사", word:"夏休み",   kana:"なつやすみ", meaning:["여름방학"] },
  { id:"w305", unit:"s3", pos:"표현", word:"わかりました", kana:"わかりました", meaning:["알겠습니다"] },
  { id:"w306", unit:"s3", pos:"명사", word:"ところ",   kana:"ところ",   meaning:["장소", "곳"] },
  { id:"w307", unit:"s3", pos:"표현", word:"ありますか", kana:"ありますか", meaning:["있습니까?"] },
  { id:"w308", unit:"s3", pos:"명사", word:"テーマパーク", kana:"テーマパーク", meaning:["테마파크"] },
  { id:"w309", unit:"s3", pos:"명사", word:"ぎおん まつり", kana:"ぎおん まつり", meaning:["기온 마츠리"], note:"교토" },
  { id:"w310", unit:"s3", pos:"표현", word:"オッケー", kana:"オッケー", meaning:["OK", "오케이"] },
  { id:"w311", unit:"s3", pos:"표현", word:"これから", kana:"これから", meaning:["이제부터", "앞으로"] },
  { id:"w312", unit:"s3", pos:"명사", word:"みんな",   kana:"みんな",   meaning:["모두"] },
  { id:"w313", unit:"s3", pos:"표현", word:"下の なまえで", kana:"したの なまえで", meaning:["(성이 아닌) 이름으로"] },
  { id:"w314", unit:"s3", pos:"표현", word:"いい(よ)", kana:"いい",     meaning:["좋아"], jaAliases:["いいよ"] },
  { id:"w315", unit:"s3", pos:"동사구", word:"えいがを みる", kana:"えいがを みる", meaning:["영화를 보다"], note:"2류" },
  { id:"w316", unit:"s3", pos:"동사구", word:"ほっかいどうに いく", kana:"ほっかいどうに いく", meaning:["홋카이도에 가다"], note:"1류" },
  { id:"w317", unit:"s3", pos:"표현", word:"何か",     kana:"なにか",   meaning:["무언가"] },
  { id:"w318", unit:"s3", pos:"표현", word:"したい こと", kana:"したい こと", meaning:["하고 싶은 일"] },
  { id:"w319", unit:"s3", pos:"동사구", word:"うたを うたう", kana:"うたを うたう", meaning:["노래를 부르다"], note:"1류" },
  { id:"w320", unit:"s3", pos:"동사구", word:"やきゅうを する", kana:"やきゅうを する", meaning:["야구를 하다"], note:"3류" },
  { id:"w321", unit:"s3", pos:"표현", word:"どうやって いく？", kana:"どうやって いく", meaning:["어떻게 가니?"] },
  { id:"w322", unit:"s3", pos:"표현", word:"なにで いきますか", kana:"なにで いきますか", meaning:["무엇으로 갑니까?"] },
  { id:"w323", unit:"s3", pos:"명사", word:"ちかてつ", kana:"ちかてつ", meaning:["지하철"] },
  { id:"w324", unit:"s3", pos:"명사", word:"しんかんせん", kana:"しんかんせん", meaning:["신칸센"] },
  { id:"w325", unit:"s3", pos:"표현", word:"ここから", kana:"ここから", meaning:["여기부터", "여기서"] },
  { id:"w326", unit:"s3", pos:"명사", word:"大阪",     kana:"おおさか", meaning:["오사카"] },
  { id:"w327", unit:"s3", pos:"조사", word:"まで",     kana:"まで",     meaning:["까지"] },

  /* ═══ 단어장 4쪽 ═══ */
  { id:"w401", unit:"s4", pos:"동사구", word:"～に のりかえる", kana:"に のりかえる", meaning:["~로 갈아타다"],
    jaAliases:["のりかえる"] },
  { id:"w402", unit:"s4", pos:"부사", word:"もう",     kana:"もう",     meaning:["이미", "벌써"] },
  { id:"w403", unit:"s4", pos:"부사", word:"あんなに", kana:"あんなに", meaning:["저렇게"] },
  { id:"w404", unit:"s4", pos:"명사", word:"人",       kana:"ひと",     meaning:["사람"] },
  { id:"w405", unit:"s4", pos:"동사", word:"ならぶ",   kana:"ならぶ",   meaning:["한 줄로 서다", "늘어서다"], note:"1류" },
  { id:"w406", unit:"s4", pos:"표현", word:"ほんとだ", kana:"ほんとだ", meaning:["정말이다", "진짜다"] },
  { id:"w407", unit:"s4", pos:"명사", word:"あれ",     kana:"あれ",     meaning:["저것"] },
  { id:"w408", unit:"s4", pos:"명사", word:"アトラクション", kana:"アトラクション", meaning:["놀이기구", "어트랙션"] },
  { id:"w409", unit:"s4", pos:"い형용사", word:"こわい", kana:"こわい", meaning:["무섭다"] },
  { id:"w410", unit:"s4", pos:"부사", word:"ぜんぜん", kana:"ぜんぜん", meaning:["전혀"], note:"부정문과 연결" },
  { id:"w411", unit:"s4", pos:"명사", word:"ショー",   kana:"ショー",   meaning:["쇼"] },
  { id:"w412", unit:"s4", pos:"명사", word:"東京",     kana:"とうきょう", meaning:["도쿄"] },
  { id:"w413", unit:"s4", pos:"명사", word:"福岡",     kana:"ふくおか", meaning:["후쿠오카"] },
  { id:"w414", unit:"s4", pos:"명사", word:"沖縄",     kana:"おきなわ", meaning:["오키나와"] },
  { id:"w415", unit:"s4", pos:"명사", word:"船",       kana:"ふね",     meaning:["배"] },
  { id:"w416", unit:"s4", pos:"명사", word:"飛行機",   kana:"ひこうき", meaning:["비행기"] },
  { id:"w417", unit:"s4", pos:"동사구", word:"ケーキを つくる", kana:"ケーキを つくる", meaning:["케이크를 만들다"], note:"1류" },
  { id:"w418", unit:"s4", pos:"동사구", word:"バスケを する", kana:"バスケを する", meaning:["농구를 하다"], note:"3류" },
  { id:"w419", unit:"s4", pos:"동사구", word:"がっこうに くる", kana:"がっこうに くる", meaning:["학교에 오다"], note:"3류" },
  { id:"w420", unit:"s4", pos:"명사", word:"英語",     kana:"えいご",   meaning:["영어"] },
  { id:"w421", unit:"s4", pos:"명사", word:"数学",     kana:"すうがく", meaning:["수학"] },
  { id:"w422", unit:"s4", pos:"い형용사", word:"むずかしい", kana:"むずかしい", meaning:["어렵다"] },
  { id:"w423", unit:"s4", pos:"명사", word:"北海道",   kana:"ほっかいどう", meaning:["홋카이도"] },
  { id:"w424", unit:"s4", pos:"명사", word:"九州",     kana:"きゅうしゅう", meaning:["규슈"] },
  { id:"w425", unit:"s4", pos:"명사", word:"サッカー", kana:"サッカー", meaning:["축구"] },
  { id:"w426", unit:"s4", pos:"명사", word:"やきゅう", kana:"やきゅう", meaning:["야구"] },
  { id:"w427", unit:"s4", pos:"い형용사", word:"おもしろい", kana:"おもしろい", meaning:["재미있다"] },
  { id:"w428", unit:"s4", pos:"동사", word:"走る",     kana:"はしる",   meaning:["뛰다", "달리다"], note:"★ 예외 1류",
    ref:"단어장 4쪽 <자주 나오는 예외 1류 동사> 상자에만 — 본문 어휘에는 없다" },
  { id:"w429", unit:"s4", pos:"동사", word:"知る",     kana:"しる",     meaning:["알다"], note:"★ 예외 1류",
    ref:"단어장 4쪽 <자주 나오는 예외 1류 동사> 상자에만 — 본문 어휘에는 없다" },
  { id:"w430", unit:"s4", pos:"동사", word:"切る",     kana:"きる",     meaning:["자르다"], note:"★ 예외 1류",
    ref:"단어장 4쪽 <자주 나오는 예외 1류 동사> 상자에만 — 본문 어휘에는 없다" }
];

/* skip:true 인 항목은 출제에서 빠집니다 — 단어장에 두 번 나온 낱말(あらう·けす)의
   두 번째 자리입니다. 어느 쪽이 빠졌는지 남겨 두려고 지우지 않고 표시만 했습니다. */

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
  /* 선생님 음편 학습지 「동사의 音便」 — 1쪽 예시와 5번 연습표에만 있는 동사.
     시험 안내가 음편(～て형)과 동사 구분·활용 단답형을 따로 짚었으므로 활용 시험에 넣는다(단어 시험에는 없다). */
  { id:"v37", kana:"いう",     word:"言う",   group:1, meaning:["말하다"],       src:"음편 학습지", note:"촉음편 う→って" },
  { id:"v38", kana:"しぬ",     word:"死ぬ",   group:1, meaning:["죽다"],         src:"음편 학습지", note:"발음편 ぬ→んで" },
  { id:"v39", kana:"おく",     word:"おく",   group:1, meaning:["두다", "놓다"], src:"음편 학습지" },
  { id:"v40", kana:"つける",   word:"つける", group:2, meaning:["켜다"],         src:"음편 학습지",
    note:"きを つけて(조심해) — 6과 106쪽, 선생님: 반드시 출제" },
  { id:"v41", kana:"わたす",   word:"わたす", group:1, meaning:["건네주다"],     src:"음편 학습지" },
  { id:"v42", kana:"いそぐ",   word:"いそぐ", group:1, meaning:["서두르다"],     src:"음편 학습지" },
  { id:"v43", kana:"きく",     word:"きく",   group:1, meaning:["듣다"],         src:"음편 학습지" },
  { id:"v44", kana:"もつ",     word:"もつ",   group:1, meaning:["들다", "가지다"], src:"음편 학습지" },
  { id:"v45", kana:"かす",     word:"かす",   group:1, meaning:["빌려주다"],     src:"음편 학습지" },

  /* 단어장 1쪽 「ある 있다 (1류)」. 선생님 시험 안내의 단답형 예시가 바로 이것이다: ある → 1류, あって */
  { id:"v36", kana:"ある",     word:"ある",   group:1, meaning:["있다"],       note:"시험 안내 예시 — 1류, て형 あって" },

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

/* 시험 2 · 표현 데이터
 *
 * 출처: 「2026 일본어 회화 (2학기 1회고사 단어)」의 문형 항목 + 교재 본문 대화.
 *   낱말은 시험 1(words.js), 활용표는 시험 3(verbs.js)에 있습니다.
 *   여기 있는 것은 **문형** — 언제 쓰는지와, 헷갈리는 짝을 가르는 것이 핵심입니다.
 *
 * ja 는 되도록 교재·단어장에 실제로 인쇄된 문장을 씁니다.
 *   문장이 없고 문형만 실린 항목은 ja 에 그 문형을 그대로 둡니다 — 짧아서
 *   유형 G(핵심어 쓰기)에서는 자동으로 빠지고, 뜻·상황 유형으로만 나옵니다.
 *   made:true 는 단어장 문형에 범위 안 낱말을 끼워 제가 만든 문장입니다.
 *
 * key 는 반드시 ja 안에 그대로 있어야 합니다(phraseDataErrors 가 검사).
 *
 * kana 는 ja 에 한자가 있을 때만 적습니다 — 정답을 보여 줄 때 한국어 발음을 달아야
 *   하는데, 한자가 남으면 반쯤만 읽히기 때문입니다(phraseDataErrors 가 검사).
 */

var PUNITS = [
  { code:"q1", title:"예정 · 권유",   pages:"단어장 1·2쪽" },
  { code:"q2", title:"방법 · 이유",   pages:"단어장 2·3쪽" },
  { code:"q3", title:"진행 · 비교",   pages:"단어장 3·4쪽" },
  { code:"q4", title:"희망 · 날짜 · 권유", pages:"교과서 3과 58~61쪽" },
  { code:"q5", title:"방법 · 상황 · 비교", pages:"교과서 4과 72~75쪽" }
];

var PHRASES = [
  /* ═══ 대비 — 이 시험의 이유 ═══ */
  { id:"p01", unit:"q1", kind:"대비",
    ja:"どこか いく?", ko:"어딘가 갈래?",
    use:"정해지지 않은 곳을 말할 때", key:"どこか",
    vs:{ ja:"どこが いい?", ko:"어디가 좋아?", key:"どこが",
         why:"どこか 는 '어딘가'(정해지지 않음), どこが 는 '어디가'(고르는 대상)" },
    note:"단어장 2쪽" },

  { id:"p02", unit:"q2", kind:"대비",
    ja:"もう すぐ ぼうさいの ひだから。", ko:"이제 곧 방재의 날이니까.",
    use:"이유를 댈 때", key:"だから",
    vs:{ ja:"えきから バスが あるよ。", ko:"역에서 (가는) 버스가 있어.", key:"から",
         why:"앞이 명사+だ 면 이유(이니까), 장소면 출발·기점(에서·부터)" },
    note:"단어장 2쪽 · 교재 105쪽" },

  { id:"p03", unit:"q1", kind:"대비",
    ja:"はい、そうです。", ko:"네, 그렇습니다.",
    use:"맞다고 답할 때", key:"そうです",
    vs:{ ja:"いいえ、ちがいます。", ko:"아니요, 틀렸습니다.", key:"ちがいます",
         why:"긍정은 そうです, 부정은 ちがいます" },
    note:"단어장 2쪽 · 교재 107쪽" },

  { id:"p04", unit:"q3", kind:"대비", made:true,
    ja:"サッカーと やきゅうと どちらが おもしろいですか。", ko:"축구와 야구 중 어느 쪽이 재미있습니까?",
    use:"둘 중 어느 쪽인지 물을 때", key:"どちらが",
    vs:{ ja:"サッカーより やきゅうの ほうが おもしろいです。", ko:"축구보다 야구 쪽이 재미있습니다.",
         key:"ほうが",
         why:"묻는 쪽은 Aと Bと どちらが, 답하는 쪽은 Aより Bの ほうが" },
    note:"단어장 4쪽 문형 · 교과서 4과 74·75쪽(サッカー/やきゅう/おもしろい) — 대답 문장은 범위 안 낱말로 구성" },

  /* ═══ 표현 — 언제 쓰는가 ═══ */
  { id:"p05", unit:"q1", kind:"표현",
    ja:"こんどの しゅうまつ、なに する?", ko:"이번 주말, 뭐 할래?",
    use:"앞으로의 예정을 물을 때", key:"こんど", note:"교재 104쪽" },

  { id:"p06", unit:"q1", kind:"표현",
    ja:"ともだちと アニメを みる よていだよ。", ko:"친구와 애니메이션을 볼 예정이야.",
    use:"할 일을 말할 때 (기본형＋よていだ)", key:"よてい", note:"단어장 1쪽 · 교재 101쪽" },

  { id:"p07", unit:"q1", kind:"표현",
    ja:"とくに よていは ないけど……。", ko:"특별히 예정은 없는데…….",
    use:"말끝을 흐리며 뒤집을 때 (～けど)", key:"けど", note:"단어장 1쪽 · 교재 104쪽" },

  { id:"p08", unit:"q4", kind:"대비",
    ja:"これからは みんな 下の なまえで よびませんか。", ko:"이제부터는 모두 이름으로 부르지 않을래요?",
    kana:"これからは みんな したの なまえで よびませんか。",
    use:"함께 하자고 권할 때 (～ませんか)", key:"ませんか",
    vs:{ ja:"したの なまえで よびます。", ko:"이름으로 부릅니다.", key:"よびます",
         why:"권유는 ～ませんか(~하지 않을래요?), ～ます 는 그냥 '~합니다'" },
    note:"단어장 3쪽 · 교과서 3과 59·60쪽" },

  { id:"p09", unit:"q1", kind:"표현",
    ja:"いつに しますか", ko:"언제로 하겠습니까?",
    use:"날짜·시간을 정하자고 물을 때", key:"いつに", note:"단어장 2쪽" },

  { id:"p10", unit:"q2", kind:"표현",
    ja:"ぼうさいセンターは どうやって いくのかな?", ko:"방재 센터는 어떻게 가는 걸까?",
    use:"가는 방법을 혼잣말처럼 물을 때 (～かな)", key:"どうやって", note:"교재 104쪽" },

  { id:"p11", unit:"q2", kind:"표현",
    ja:"なにで いきますか", ko:"무엇으로 갑니까?",
    use:"교통수단을 물을 때", key:"なにで", note:"단어장 3쪽 · 교과서 4과 72쪽" },

  { id:"p12", unit:"q2", kind:"표현",
    ja:"～から～まで", ko:"~부터 ~까지",
    use:"시작과 끝을 함께 말할 때", key:"から", note:"단어장 3쪽" },

  { id:"p13", unit:"q2", kind:"표현",
    ja:"まず、あたまと からだを まもりましょう。", ko:"먼저, 머리와 몸을 지킵시다.",
    use:"함께 하자고 지시할 때 (～ましょう)", key:"まもりましょう", note:"교재 98쪽" },

  { id:"p14", unit:"q2", kind:"표현",
    ja:"あぶない!", ko:"위험해!",
    use:"위험을 알려 주의를 줄 때", key:"あぶない", note:"교재 98쪽" },

  { id:"p15", unit:"q3", kind:"표현",
    ja:"わあ、もう あんなに 人が ならんで いる。", ko:"와, 벌써 저렇게 사람이 줄을 서 있어.",
    kana:"わあ、もう あんなに ひとが ならんで いる。",
    use:"지금의 상태·진행을 말할 때 (～て いる)", key:"ならんで",
    note:"단어장 4쪽 · 교과서 4과 73·74쪽 본문" },

  /* ═══ 전개 ═══ */
  { id:"p16", unit:"q2", kind:"전개",
    ja:"まず、つくえや テーブルの したに はいります。それから、ひを けします。",
    ko:"우선, 책상이나 테이블 밑에 들어갑니다. 그리고, 불을 끕니다.",
    use:"두 동작의 순서를 말할 때", key:"それから", note:"교재 107쪽" },

  /* ═══ 교과서 3과 58~61쪽 — 본문은 59쪽 ═══ */
  { id:"p17", unit:"q4", kind:"대비",
    ja:"テーマパークに いきたい。", ko:"테마파크에 가고 싶다.",
    use:"하고 싶은 것을 말할 때 (ます형 어간＋たい)", key:"いきたい",
    vs:{ ja:"テーマパークに いく。", ko:"테마파크에 가다.", key:"いく",
         why:"희망은 ます형에서 ます 대신 たい: いく → いきます → いきたい" },
    note:"교과서 3과 60쪽 확인" },

  { id:"p18", unit:"q4", kind:"표현",
    ja:"日本には いつ 来ますか。", ko:"일본에는 언제 옵니까?",
    kana:"にほんには いつ きますか。",
    use:"언제 오는지 물을 때 (～には いつ)", key:"いつ", note:"교과서 3과 59쪽 본문" },

  { id:"p19", unit:"q4", kind:"표현",
    ja:"7月 17日から 夏休みです。", ko:"7월 17일부터 여름 방학입니다.",
    kana:"しちがつ じゅうしちにちから なつやすみです。",
    use:"시작하는 날을 말할 때 (날짜＋から)", key:"から", note:"교과서 3과 59쪽 본문" },

  { id:"p20", unit:"q4", kind:"표현",
    ja:"どこか 行きたい ところが ありますか。", ko:"어딘가 가고 싶은 곳이 있습니까?",
    kana:"どこか いきたい ところが ありますか。",
    use:"가고 싶은 곳을 물을 때 (～たい ところ)", key:"ところ", note:"교과서 3과 59쪽 본문" },

  { id:"p21", unit:"q4", kind:"표현",
    ja:"ぼくは、ぎおんまつりが 見たいです。", ko:"나는 기온 마츠리를 보고 싶어요.",
    kana:"ぼくは、ぎおんまつりが みたいです。",
    use:"보고 싶은 것을 말할 때 (～が ～たいです)", key:"たい", note:"교과서 3과 59쪽 본문" },

  { id:"p22", unit:"q4", kind:"표현",
    ja:"しゅうまつ、何か したい ことが ありますか。", ko:"주말에 무언가 하고 싶은 것이 있습니까?",
    kana:"しゅうまつ、なにか したい ことが ありますか。",
    use:"하고 싶은 일을 물을 때 (何か ～たい こと)", key:"したい", note:"교과서 3과 60·61쪽" },

  { id:"p23", unit:"q4", kind:"표현",
    ja:"いっしょに おこのみやきを たべませんか。", ko:"같이 오코노미야키를 먹지 않을래요?",
    use:"같이 하자고 권할 때 (いっしょに ～ませんか)", key:"いっしょに", note:"교과서 3과 61쪽" },

  /* ═══ 교과서 4과 72~75쪽 — 본문은 73쪽 ═══ */
  { id:"p24", unit:"q5", kind:"대비",
    ja:"どうやって いくの?", ko:"어떻게 가는 거야?",
    use:"가는 방법을 물을 때 (どうやって ～の?)", key:"いくの",
    vs:{ ja:"どうやって くるの?", ko:"어떻게 오는 거야?", key:"くるの",
         why:"가는 방법은 いく, 오는 방법은 くる" },
    note:"교과서 4과 73·74쪽" },

  { id:"p25", unit:"q5", kind:"대비",
    ja:"アトラクションより ショーの ほうが いい。", ko:"놀이기구보다 쇼 쪽이 좋다.",
    use:"둘을 비교해 한쪽을 고를 때 (Aより Bの ほうが)", key:"ほうが",
    vs:{ ja:"アトラクションと ショーが いい。", ko:"놀이기구와 쇼가 (둘 다) 좋다.", key:"と",
         why:"비교해 한쪽을 고를 때는 Aより Bの ほうが — Aと Bが 는 둘 다" },
    note:"교과서 4과 74쪽 확인" },

  { id:"p26", unit:"q5", kind:"표현",
    ja:"ちかてつで いきます。", ko:"지하철로 갑니다.",
    use:"교통수단을 말할 때 (수단＋で)", key:"で", note:"교과서 4과 72쪽" },

  { id:"p27", unit:"q5", kind:"표현",
    ja:"まず、バスで おおさかえきまで 行って、それから 電車に のりかえるよ。",
    ko:"먼저 버스로 오사카역까지 가서, 그리고 전철로 갈아탈 거야.",
    kana:"まず、バスで おおさかえきまで いって、それから でんしゃに のりかえるよ。",
    use:"가는 방법을 차례로 안내할 때 (～て、それから)", key:"のりかえる", note:"교과서 4과 73쪽 본문" },

  { id:"p28", unit:"q5", kind:"표현",
    ja:"え? あれに のるの?", ko:"어? 저거 타는 거야?",
    use:"무엇을 타는지 물을 때 (～に のる — ~을/를 타다)", key:"に", note:"교과서 4과 73쪽 본문" },

  { id:"p29", unit:"q5", kind:"표현",
    ja:"ぜんぜん こわく ないよ。", ko:"전혀 안 무서워.",
    use:"전혀 ~하지 않다고 할 때 (ぜんぜん＋부정)", key:"ぜんぜん", note:"교과서 4과 73쪽 본문" },

  { id:"p30", unit:"q5", kind:"표현",
    ja:"わたしは、アトラクションより ショーの ほうが いいのに……。", ko:"나는 놀이기구보다 쇼 쪽이 좋은데…….",
    use:"아쉬움을 말할 때 (～のに — ~한데)", key:"のに", note:"교과서 4과 73쪽 본문" },

  { id:"p31", unit:"q5", kind:"표현",
    ja:"れんくんは いま おべんとうを たべて いる。", ko:"렌 군은 지금 도시락을 먹고 있다.",
    use:"지금 하고 있는 일을 말할 때 (～て いる)", key:"たべて", note:"교과서 4과 74쪽" },

  { id:"p32", unit:"q5", kind:"표현",
    ja:"がっこうに きて います。", ko:"학교에 와 있습니다.",
    use:"와 있는 상태를 말할 때 (くる → きて います)", key:"きて", note:"교과서 4과 75쪽" },

  /* 선생님이 106쪽에 "반드시 출제"라고 짚은 것 */
  { id:"p33", unit:"q2", kind:"표현",
    ja:"ハナちゃん、あぶない! きを つけて!", ko:"하나야, 위험해! 조심해!",
    use:"조심하라고 할 때 (きを つける → て형 つけて)", key:"つけて",
    note:"교과서 6과 106쪽 본문 · 선생님: 반드시 출제" }
];

/* 문제 유형과 배분 (PRD §5.4).
   D 가 이 시험의 이유다 — 나머지 셋만이면 단어 시험과 다를 게 없다. */
var PFORMS = [
  { k:"D", nm:"대비 고르기", sub:"헷갈리는 짝 가르기", w:35 },
  { k:"E", nm:"뜻 고르기",   sub:"문장 → 뜻",         w:20 },
  { k:"F", nm:"상황 → 표현", sub:"언제 쓰나",         w:20 },
  { k:"G", nm:"핵심어 쓰기", sub:"빈칸에 직접",        w:25 }
];

/* ══ 앱 엔진 (index.html 에서 그대로) ══ */
/* ══ 가나 채점 — PRD §5.2 ══ */
function norm(s){
  return (s || "").normalize("NFKC").replace(/[\s　]/g, "").replace(/[。、・･!?！？.,]/g, "");
}
function toHira(s){
  return s.replace(/[ァ-ヶ]/g, function(c){ return String.fromCharCode(c.charCodeAt(0) - 0x60); });
}
function toKata(s){
  return s.replace(/[ぁ-ゖ]/g, function(c){ return String.fromCharCode(c.charCodeAt(0) + 0x60); });
}
function lev(a, b){
  var m = a.length, n = b.length, prev = [], cur = [], i, j;
  for (j = 0; j <= n; j++) prev[j] = j;
  for (i = 1; i <= m; i++){
    cur[0] = i;
    for (j = 1; j <= n; j++)
      cur[j] = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    prev = cur.slice();
  }
  return prev[n];
}

/* 자형이 닮아 OS 손글씨가 자주 뒤바꾸는 짝 (PRD §6.4.4) */
var CONFUSE = ["ユコ","シツ","ソン","クタ","スヌ","ンリ","ノメ","ワク","チテ","ヲラ"];
function confusablePair(a, b){
  if (a.length !== b.length) return null;
  var at = -1, i;
  for (i = 0; i < a.length; i++){
    if (a[i] === b[i]) continue;
    if (at >= 0) return null;
    at = i;
  }
  if (at < 0) return null;
  var p = a[at] + b[at], q = b[at] + a[at], k;
  for (k = 0; k < CONFUSE.length; k++)
    if (CONFUSE[k] === p || CONFUSE[k] === q) return { typed:a[at], want:b[at] };
  return null;
}

/* 철자 바꾼 오답 — 이 학교 객관식은 ところ 가 답이면 とこる·とくろ 처럼 한두 글자만 바꾼 선지를 낸다.
   ① 같은 행의 다른 모음(ろ→る·れ) ② 탁점 붙이기·떼기(こ→ご) ③ 작은 글자(っ·ゃ) 크기 ④ 장음·촉음 넣고 빼기.
   ①을 먼저 쓰고 모자라면 ②~④. 범위 안의 다른 진짜 낱말(avoid)과 같아지면 버린다. */
var GOJU = ["あいうえお","かきくけこ","がぎぐげご","さしすせそ","ざじずぜぞ","たちつてと","だぢづでど","なにぬねの",
            "はひふへほ","ばびぶべぼ","ぱぴぷぺぽ","まみむめも","らりるれろ","やゆよ"];
var DAKU = ["かが","きぎ","くぐ","けげ","こご","さざ","しじ","すず","せぜ","そぞ","ただ","ちぢ","つづ","てで","とど",
            "はばぱ","ひびぴ","ふぶぷ","へべぺ","ほぼぽ"];
var SMALL = ["っつ","ゃや","ゅゆ","ょよ"];
function spellVariants(word, n, avoid){
  /* 글자마다 제 문자(히라가나·가타카나)를 지킨다 — ぼうさいセンター 는 앞은 히라가나, 뒤는 가타카나로 */
  var bad = {}, seen = {}, tiers = [[], [], []], i, j, g;
  (avoid || []).forEach(function(x){ bad[norm(toHira(x))] = 1; });
  bad[norm(toHira(word))] = 1;
  function add(t, v){
    var k = norm(toHira(v));
    if (!k || seen[k] || bad[k]) return;
    if (/^[んっゃゅょー]/.test(k) || /んん|っっ|ーー|っ$|っ[あいうえおなにぬねのまみむめもやゆよらりるれろわをん]/.test(k)) return;
    seen[k] = 1; tiers[t].push(v);
  }
  for (i = 0; i < word.length; i++){
    var c = word[i], isK = /[ァ-ヺ]/.test(c), h = toHira(c);
    if (!/[ぁ-ゖ]/.test(h)) continue;
    var pre = word.slice(0, i), post = word.slice(i + 1);
    var put = function(t, r){ add(t, pre + (isK ? toKata(r) : r) + post); };
    GOJU.forEach(function(row){ if (row.indexOf(h) >= 0) for (j = 0; j < row.length; j++) if (row[j] !== h) put(0, row[j]); });
    DAKU.forEach(function(g){ if (g.indexOf(h) >= 0) for (j = 0; j < g.length; j++) if (g[j] !== h) put(1, g[j]); });
    SMALL.forEach(function(g){ if (g.indexOf(h) >= 0) put(1, g[0] === h ? g[1] : g[0]); });
    /* 장음: 가타카나는 ー, 히라가나는 お단 뒤 う */
    if (isK){ if (post[0] === "ー") add(2, pre + c + post.slice(1)); else add(2, pre + c + "ー" + post); }
    else if ("おこごそぞとどのほぼぽもろよょ".indexOf(h) >= 0){ if (post[0] === "う") add(2, pre + c + post.slice(1)); else add(2, pre + c + "う" + post); }
    /* 촉음: か·さ·た·ぱ 행 앞 */
    var prev = toHira(word[i - 1] || "");
    if (i > 0 && /[かきくけこさしすせそたちつてとぱぴぷぺぽ]/.test(h) && prev !== "っ" && /[ぁ-ゖ]/.test(prev)) add(2, pre + (isK ? "ッ" : "っ") + c + post);
  }
  var out = [];
  tiers.forEach(function(t){
    for (j = t.length - 1; j > 0; j--){ g = Math.floor(Math.random() * (j + 1)); var tmp = t[j]; t[j] = t[g]; t[g] = tmp; }
    t.forEach(function(v){ if (out.length < n) out.push(v); });
  });
  return out;
}

/* 한자와 가나를 섞어 써도 맞다 — 선생님 시험 안내: '일본어로 쓰시오'는 히라가나·가타카나·한자
   모두 써도 된다(下の名前 · 下のなまえ · したのなまえ). 단어장이 한자로 적은 자리마다 그 한자나
   그 읽기 어느 쪽이든 받는다. 단어장에 없는 한자는 맞는지 확인할 수 없어 받지 않는다
   (한자 표기가 틀리면 오답이라는 안내와 같은 쪽으로 기운다). */
var KANJI_RUN = /[\u3400-\u9fff\u3005]+/g;
function escRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function mixedOk(a, w){
  var word = norm(w.word || ""), kana = norm(w.kana || "");
  var runs = word.match(KANJI_RUN);
  if (!runs || !kana) return false;
  var lits = word.split(KANJI_RUN);                       /* 한자 덩어리 사이의 가나 */
  var re = "^" + lits.map(escRe).join("(.+?)") + "$";
  var m = new RegExp(re).exec(kana);                      /* 읽기를 한자 자리에 맞춰 나눈다 */
  if (!m) return false;
  var alt = "^" + lits.map(escRe).reduce(function(acc, lit, i){
    return i === 0 ? lit : acc + "(?:" + escRe(runs[i - 1]) + "|" + escRe(m[i]) + ")" + lit;
  }, "") + "$";
  return new RegExp(alt).test(a);
}

function judge(input, w){
  var a = norm(input), keys = [w.kana].concat(w.jaAliases || []).concat([w.word]), i;
  if (!a) return { code:"empty" };
  for (i = 0; i < keys.length; i++) if (a === norm(keys[i])) return { code:"ok" };
  if (mixedOk(a, w)) return { code:"ok" };
  var b = norm(w.kana);
  /* 가나 종류: 선생님 기준 — 교과서에 히라가나·가타카나 두 가지로 다 적힌 어휘만
     아무 쪽으로 써도 된다(kanaAny). 나머지는 적힌 가나 그대로 써야 한다. */
  if (toHira(a) === toHira(b)) return w.kanaAny ? { code:"ok" } : { code:"kana" };
  var cp = confusablePair(a, b);
  if (cp) return { code:"confuse", pair:cp };
  if (lev(a, b) === 1) return { code:"near" };
  return { code:"wrong" };
}

/* ══ 로마자 → 가나 ══ */
var ROMA = {
  a:"あ",i:"い",u:"う",e:"え",o:"お",
  ka:"か",ki:"き",ku:"く",ke:"け",ko:"こ",
  sa:"さ",si:"し",shi:"し",su:"す",se:"せ",so:"そ",
  ta:"た",ti:"ち",chi:"ち",tu:"つ",tsu:"つ",te:"て",to:"と",
  na:"な",ni:"に",nu:"ぬ",ne:"ね",no:"の",
  ha:"は",hi:"ひ",hu:"ふ",fu:"ふ",he:"へ",ho:"ほ",
  ma:"ま",mi:"み",mu:"む",me:"め",mo:"も",
  ya:"や",yu:"ゆ",yo:"よ",
  ra:"ら",ri:"り",ru:"る",re:"れ",ro:"ろ",
  wa:"わ",wo:"を",nn:"ん",
  ga:"が",gi:"ぎ",gu:"ぐ",ge:"げ",go:"ご",
  za:"ざ",zi:"じ",ji:"じ",zu:"ず",ze:"ぜ",zo:"ぞ",
  da:"だ",di:"ぢ",du:"づ",de:"で",do:"ど",
  ba:"ば",bi:"び",bu:"ぶ",be:"べ",bo:"ぼ",
  pa:"ぱ",pi:"ぴ",pu:"ぷ",pe:"ぺ",po:"ぽ",
  kya:"きゃ",kyu:"きゅ",kyo:"きょ",gya:"ぎゃ",gyu:"ぎゅ",gyo:"ぎょ",
  sha:"しゃ",shu:"しゅ",sho:"しょ",sya:"しゃ",syu:"しゅ",syo:"しょ",
  cha:"ちゃ",chu:"ちゅ",cho:"ちょ",tya:"ちゃ",tyu:"ちゅ",tyo:"ちょ",
  ja:"じゃ",ju:"じゅ",jo:"じょ",jya:"じゃ",jyu:"じゅ",jyo:"じょ",
  zya:"じゃ",zyu:"じゅ",zyo:"じょ",
  nya:"にゃ",nyu:"にゅ",nyo:"にょ",hya:"ひゃ",hyu:"ひゅ",hyo:"ひょ",
  bya:"びゃ",byu:"びゅ",byo:"びょ",pya:"ぴゃ",pyu:"ぴゅ",pyo:"ぴょ",
  mya:"みゃ",myu:"みゅ",myo:"みょ",rya:"りゃ",ryu:"りゅ",ryo:"りょ",
  fa:"ふぁ",fi:"ふぃ",fe:"ふぇ",fo:"ふぉ",
  thi:"てぃ",dhi:"でぃ",she:"しぇ",che:"ちぇ",je:"じぇ",
  va:"ゔぁ",vi:"ゔぃ",vu:"ゔ",ve:"ゔぇ",vo:"ゔぉ"
};
var DBL = "kstpgdbjzcfhmyrwv";
function romajiRun(run, final){
  var out = "", i = 0, L, seg, hit;
  while (i < run.length){
    if (run[i] === run[i+1] && DBL.indexOf(run[i]) >= 0){ out += "っ"; i++; continue; }
    if (run[i] === "n"){
      if (run[i+1] === "n"){ out += "ん"; i += 2; continue; }
      if (i + 1 < run.length && "aiueoy".indexOf(run[i+1]) < 0){ out += "ん"; i++; continue; }
      /* 말끝 n: 타이핑 중이면 na 가 될 수 있으므로 남겨 두고, 확정 때 ん 으로 굳힌다 */
      if (i + 1 >= run.length && final){ out += "ん"; i++; continue; }
    }
    hit = null;
    for (L = 3; L >= 1; L--){
      seg = run.substr(i, L).toLowerCase();
      if (ROMA[seg]){ hit = ROMA[seg]; i += L; break; }
    }
    if (hit){ out += hit; continue; }
    if (run[i] === "-"){ out += "ー"; i++; continue; }
    out += run[i]; i++;
  }
  return out;
}
/* ASCII 구간만 변환하고 가나는 손대지 않는다 — 손글씨와 섞어 써도 안전 */
function toKana(s, kata, final){
  var out = "", run = "", i, c, conv;
  function flush(last){
    if (!run) return;
    conv = romajiRun(run, last && final);
    out += kata ? toKata(conv) : conv;
    run = "";
  }
  for (i = 0; i < s.length; i++){
    c = s[i];
    if (/[A-Za-z-]/.test(c)) run += c; else { flush(false); out += c; }
  }
  flush(true);
  return out;
}

/* ══ 가나 → 한국어 발음 (읽기 도우미) ══ */
/* か=카 · が=가 로 적는다. 국립국어원 외래어 표기법은 어두에서 둘 다 '가' 로 적지만,
   이 앱은 탁점을 엄격하게 채점하므로(§7.3) 그 둘이 붙어 버리면 곤란하다.
   모라 단위 1:1 이라 발음에서 가나를 되짚을 수 있다 — 쓰기 연습에 그게 필요하다. */
var KO1 = {
  "あ":"아","い":"이","う":"우","え":"에","お":"오",
  "か":"카","き":"키","く":"쿠","け":"케","こ":"코",
  "さ":"사","し":"시","す":"스","せ":"세","そ":"소",
  "た":"타","ち":"치","つ":"츠","て":"테","と":"토",
  "な":"나","に":"니","ぬ":"누","ね":"네","の":"노",
  "は":"하","ひ":"히","ふ":"후","へ":"헤","ほ":"호",
  "ま":"마","み":"미","む":"무","め":"메","も":"모",
  "や":"야","ゆ":"유","よ":"요",
  "ら":"라","り":"리","る":"루","れ":"레","ろ":"로",
  "わ":"와","を":"오",
  "が":"가","ぎ":"기","ぐ":"구","げ":"게","ご":"고",
  "ざ":"자","じ":"지","ず":"즈","ぜ":"제","ぞ":"조",
  "だ":"다","ぢ":"지","づ":"즈","で":"데","ど":"도",
  "ば":"바","び":"비","ぶ":"부","べ":"베","ぼ":"보",
  "ぱ":"파","ぴ":"피","ぷ":"푸","ぺ":"페","ぽ":"포"
};
var KO2 = {
  "きゃ":"캬","きゅ":"큐","きょ":"쿄", "ぎゃ":"갸","ぎゅ":"규","ぎょ":"교",
  "しゃ":"샤","しゅ":"슈","しょ":"쇼", "じゃ":"자","じゅ":"주","じょ":"조",
  "ちゃ":"차","ちゅ":"추","ちょ":"초", "にゃ":"냐","にゅ":"뉴","にょ":"뇨",
  "ひゃ":"햐","ひゅ":"휴","ひょ":"효", "びゃ":"뱌","びゅ":"뷰","びょ":"뵤",
  "ぴゃ":"퍄","ぴゅ":"퓨","ぴょ":"표", "みゃ":"먀","みゅ":"뮤","みょ":"묘",
  "りゃ":"랴","りゅ":"류","りょ":"료",
  "ふぁ":"파","ふぃ":"피","ふぇ":"페","ふぉ":"포",
  "てぃ":"티","でぃ":"디","しぇ":"셰","ちぇ":"체","じぇ":"제",
  "うぃ":"위","うぇ":"웨","うぉ":"워"
};
/* 종성 붙이기 — 한글은 초·중·종성이 한 글자로 합쳐진다 */
function koJong(syl, j){
  var c = syl.charCodeAt(0) - 0xAC00;
  if (c < 0 || c > 11171 || c % 28 !== 0) return syl;   /* 한글이 아니거나 이미 받침이 있으면 그대로 */
  return String.fromCharCode(0xAC00 + c + j);
}
/* 장음 ー 이 반복할 모음 */
var KO_LONG = { 0:"아", 1:"애", 2:"아", 4:"어", 5:"에", 6:"어",
                8:"오", 12:"오", 13:"우", 17:"우", 18:"으", 20:"이" };
function koLong(syl){
  var c = syl.charCodeAt(0) - 0xAC00;
  if (c < 0 || c > 11171) return "";
  return KO_LONG[Math.floor((c % 588) / 28)] || "";
}
/* 조사인가 — 낱말 한가운데의 は 는 '하' 다(はなす·はやく). 낱말 끝에 홀로 붙어야 조사다.
   앞이 글자이고(낱말 첫 글자가 아니고) 뒤가 띄어쓰기·문장부호·끝이면 조사로 본다. */
var KO_BREAK = " 　、。,.!?！？…~～「」()（）";
function koParticle(h, i){
  var pv = h[i - 1], nx = h[i + 1];
  if (!pv || KO_BREAK.indexOf(pv) >= 0) return false;     /* 낱말 첫 글자 → 조사가 아니다 */
  return !nx || KO_BREAK.indexOf(nx) >= 0;                /* 낱말 끝에 홀로 → 조사 */
}
function hasKanji(s){ return /[\u3400-\u9FFF]/.test(s || ""); }
/* 한자가 남으면 발음을 달지 않는다 — 반쯤 읽힌 줄은 없느니만 못하다 */
function pron(s){ return hasKanji(s) ? "" : toKo(s); }
function toKo(s){
  var h = toHira(s || ""), out = "", i = 0, ch, nx, hit, j, last;
  function lastSyl(){ return out.length ? out[out.length - 1] : ""; }
  while (i < h.length){
    ch = h[i];
    if (ch === " " || ch === "　"){ out += " "; i++; continue; }
    if (ch === "ー"){ out += koLong(lastSyl()); i++; continue; }
    if (ch === "っ"){                                   /* 촉음 → ㅅ 받침 */
      last = lastSyl();
      if (last) out = out.slice(0, -1) + koJong(last, 19);
      i++; continue;
    }
    if (ch === "ん"){                                   /* 발음 → 뒤 자음에 따라 ㄴ·ㅁ·ㅇ */
      nx = h[i + 1] || "";
      j = 4;                                            /* 말끝의 ん 은 언제나 ㄴ — nx 가 비면 여기서 멈춘다 */
      if (nx && "まみむめもばびぶべぼぱぴぷぺぽ".indexOf(nx) >= 0) j = 16;
      else if (nx && "かきくけこがぎぐげご".indexOf(nx) >= 0) j = 21;
      last = lastSyl();
      if (last) out = out.slice(0, -1) + koJong(last, j);
      i++; continue;
    }
    if (ch === "は" || ch === "へ"){                     /* 조사 は·へ 는 와·에 로 읽는다 */
      if (koParticle(h, i)){ out += (ch === "は" ? "와" : "에"); i++; continue; }
    }
    hit = KO2[h.substr(i, 2)];
    if (hit){ out += hit; i += 2; continue; }
    hit = KO1[ch];
    if (hit){ out += hit; i++; continue; }
    out += ch; i++;                                     /* 한자·기호는 그대로 둔다 */
  }
  return out;
}

/* ══ 동사 활용 — 어간 하나에서 세 형이 나온다 (PRD §6.2) ══ */

/* 5단 동사 어미: [u]단 → [i]단 */
var U2I = { "う":"い", "く":"き", "ぐ":"ぎ", "す":"し", "つ":"ち",
            "ぬ":"に", "ぶ":"び", "む":"み", "る":"り" };

/* ます형 어간(연용형). ます·ましょう·たい 가 전부 여기에 붙는다. */
function stem(v){
  var k = v.kana, last = k.slice(-1);
  if (v.group === 3){
    if (k === "くる") return "き";
    if (k === "する") return "し";
    if (/する$/.test(k)) return k.slice(0, -2) + "し";   /* べんきょうする → べんきょうし */
    return null;
  }
  if (v.group === 2) return k.slice(0, -1);              /* る 제거 */
  if (!U2I[last]) return null;                           /* 1류인데 [u]단이 아니면 데이터 오류 */
  return k.slice(0, -1) + U2I[last];
}

/* て형 음편 — 어간이 아니라 어미에서 갈린다 (단어장 3쪽 <동사의 음편>) */
var TE1 = { "う":"って", "つ":"って", "る":"って",
            "ぬ":"んで", "む":"んで", "ぶ":"んで",
            "く":"いて", "ぐ":"いで", "す":"して" };
function teForm(v){
  if (v.teIrreg) return v.teIrreg;          /* いく → いって (★ 촉음 예외) */
  var k = v.kana, last = k.slice(-1);
  if (v.group === 3){
    if (k === "くる") return "きて";
    if (/する$/.test(k)) return k.slice(0, -2) + "して";
    return null;
  }
  if (v.group === 2) return k.slice(0, -1) + "て";
  if (!TE1[last]) return null;
  return k.slice(0, -1) + TE1[last];
}

function conj(v, form){
  if (form === "te") return teForm(v);
  var st = stem(v), i;
  if (st === null) return null;
  for (i = 0; i < FORMS.length; i++)
    if (FORMS[i].k === form && FORMS[i].suffix) return st + FORMS[i].suffix;
  return null;
}

/* い형용사 활용 — 단어장 4쪽. いい 만 불규칙이라 데이터에 직접 적혀 있다. */
function isAdj(it){ return !it.group; }
function adjConj(a, form){
  if (a.forms && a.forms[form]) return a.forms[form];
  var base = a.kana.slice(0, -1);
  if (form === "neg")  return base + "くない";
  if (form === "te")   return base + "くて";
  if (form === "past") return base + "かった";
  return null;
}
function anyConj(it, form){ return isAdj(it) ? adjConj(it, form) : conj(it, form); }
function formsOf(it){ return isAdj(it) ? ADJFORMS : FORMS; }

function adjDataErrors(pool){
  var bad = [], i, a, j, f;
  for (i = 0; i < pool.length; i++){
    a = pool[i];
    if (a.kana.slice(-1) !== "い") bad.push(a.kana + ": い 로 끝나지 않음");
    if (a.irregular && !a.forms) bad.push(a.kana + ": 불규칙인데 forms 가 없음");
    for (j = 0; j < ADJFORMS.length; j++){
      f = ADJFORMS[j].k;
      if (!adjConj(a, f)) bad.push(a.kana + ": " + f + " 를 못 만듦");
    }
  }
  return bad;
}

/* 활용형에서 기본형으로 (유형 J). 어미를 떼고 후보를 되찾는다. */
function deconj(surface, pool){
  var out = [], i, fl, j;
  for (i = 0; i < pool.length; i++){
    fl = formsOf(pool[i]);
    for (j = 0; j < fl.length; j++)
      if (anyConj(pool[i], fl[j].k) === surface){ out.push(pool[i]); break; }
  }
  return out;
}

/* 데이터 검증 — group 이 빠졌거나 어미가 이상하면 여기서 걸린다. */
function verbDataErrors(pool){
  var bad = [], i, v;
  for (i = 0; i < pool.length; i++){
    v = pool[i];
    if ([1,2,3].indexOf(v.group) < 0){ bad.push(v.kana + ": group 없음"); continue; }
    if (stem(v) === null) bad.push(v.kana + ": 어간을 못 구함 (group " + v.group + ")");
    if (teForm(v) === null) bad.push(v.kana + ": て형을 못 만듦");
    if (v.group === 2 && v.kana.slice(-1) !== "る") bad.push(v.kana + ": 2류인데 る 로 안 끝남");
  }
  return bad;
}

/* ══ 표현 — 대비 항목의 양면 (PRD §5.2) ══ */
/* 대비 항목은 양쪽을 오간다. side 0 = 본문, 1 = 짝. */
function sideOf(p, side){
  return (side === 1 && p.vs) ? p.vs : { ja:p.ja, ko:p.ko, key:p.key, kana:p.kana };
}
function sides(p){ return p.vs ? [0, 1] : [0]; }
/* 빈칸을 파고도 문맥이 남아야 유형 G 를 낼 수 있다.
   「それから?」 처럼 문장이 곧 key 면 「____?」 가 되어 물어볼 것이 없다. */
function gOk(p, side){
  var d = sideOf(p, side);
  return d.ja.indexOf(d.key) >= 0 && (d.ja.length - d.key.length) >= 2;
}

/* 표현 데이터 검증 — key 가 문장 안에 없으면 빈칸을 팔 수 없다. */
function phraseDataErrors(pool){
  var bad = [], i, p, j, d;
  for (i = 0; i < pool.length; i++){
    p = pool[i];
    for (j = 0; j < sides(p).length; j++){
      d = sideOf(p, sides(p)[j]);
      if (!d.key) bad.push(p.id + ": key 없음");
      else if (d.ja.indexOf(d.key) < 0) bad.push(p.id + ": key「" + d.key + "」가 문장에 없음");
    }
    if (p.kind === "대비" && !p.vs) bad.push(p.id + ": 대비인데 vs 가 없음");
    if (p.vs && !p.vs.why) bad.push(p.id + ": vs 에 why 가 없음");
    if (p.vs && p.vs.key === p.key) bad.push(p.id + ": 짝의 key 가 같아 고를 수가 없음");
    if (!p.use) bad.push(p.id + ": use 없음");
    /* 한자가 든 문장은 kana 를 따로 적어야 한국어 발음을 달 수 있다 */
    if (hasKanji(p.ja) && !p.kana) bad.push(p.id + ": 한자가 있는데 kana 가 없음");
    if (p.kana && hasKanji(p.kana)) bad.push(p.id + ": kana 에 한자가 남음");
    if (p.vs && hasKanji(p.vs.ja) && !p.vs.kana) bad.push(p.id + ": 짝 문장에 한자가 있는데 kana 가 없음");
  }
  return bad;
}


/* 교과서 전체 지문 — docs/scripts/unit3-all.json · unit4-all.json · unit6-all.json */
var TEXTS = [{"unit": "t3", "page": "58", "track": "3-07", "task": "はじめる まえに 2 · 희망을 묻고 답하는 표현", "sub": "1. 잘 듣고, 두 번씩 따라 말해 봅시다.", "items": [{"lines": [["A", "どこに いきたいですか。", "어디에 가고 싶습니까?"], ["B", "テーマパークに いきたいです。", "테마파크에 가고 싶습니다."]]}], "words": [["どこ", "어디"], ["〜に", "~에"], ["いきたい", "가고 싶다 (いく → いきます → いきたい)"], ["テーマパーク", "테마파크"], ["おだいば", "오다이바 (도쿄)"], ["あらしやま", "아라시야마 (교토)"], ["どうとんぼり", "도톤보리 (오사카)"]]}, {"unit": "t3", "page": "58", "track": "3-08", "task": "2. 그림 속 단어를 밑줄 친 부분과 바꾸어 짝과 대화해 봅시다.", "sub": "밑줄 친 テーマパーク 자리에 그림 속 장소를 넣은 대화입니다.", "items": [{"no": "①", "lines": [["A", "どこに いきたいですか。", "어디에 가고 싶습니까?"], ["B", "おだいばに いきたいです。", "오다이바에 가고 싶습니다."]]}, {"no": "②", "lines": [["A", "どこに いきたいですか。", "어디에 가고 싶습니까?"], ["B", "あらしやまに いきたいです。", "아라시야마에 가고 싶습니다."]]}, {"no": "③", "lines": [["A", "どこに いきたいですか。", "어디에 가고 싶습니까?"], ["B", "どうとんぼりに いきたいです。", "도톤보리에 가고 싶습니다."]]}]}, {"unit": "t3", "page": "59", "track": "3-09", "task": "きいて はなそう 2 · 본문 ★ 서술형 집중", "sub": "온라인상에서 일본에서 하고 싶은 것을 서로 이야기합니다.", "items": [{"lines": [["はるな", "①イさん、キムさん、日本(にほん)には いつ 来(き)ますか。", "이 씨, 김 씨, 일본에는 언제 와요?"], ["ユミ", "②7月(しちがつ) 20日(はつか)に 行(い)きます。7月(しちがつ) 17日(じゅうしちにち)から 夏休(なつやす)みです。", "7월 20일에 가요. 7월 17일부터 여름 방학이에요."], ["はるな", "③わかりました。", "알겠어요."]]}, {"lines": [["れん", "④どこか 行(い)きたい ところが ありますか。", "어딘가 가고 싶은 곳이 있어요?"], ["ユミ", "⑤はい。テーマパークに 行(い)きたいです。", "네. 테마파크에 가고 싶어요."], ["ノア", "⑥ぼくは、ぎおんまつりが 見(み)たいです。", "나는 기온 마쓰리를 보고 싶어요."]]}, {"lines": [["れん", "⑦オッケー。あ、それから、これからは みんな 下(した)の なまえで よびませんか。", "오케이. 아, 그리고 이제부터는 모두 (성이 아닌) 이름으로 부르지 않을래요?"], ["ユミ", "⑧いいよ。", "좋아."]]}, {"no": "Q1  유미네 학교의 여름 방학은 언제부터인가요?", "lines": [], "answer": "정답: 7월 17일 (7月 17日から 夏休みです)"}, {"no": "Q2  노아가 일본에서 보고 싶은 것은 무엇인가요?", "lines": [], "answer": "정답: 기온 마쓰리 (ぎおんまつりが 見たいです)"}], "words": [["〜には", "~에는"], ["いつ", "언제"], ["来(き)ます", "옵니다 (くる, 3류)"], ["7月(しちがつ)", "7월"], ["20日(はつか)", "20일 (고유 읽기)"], ["行(い)く", "가다 (1류)"], ["17日(じゅうしちにち)", "17일"], ["〜から", "~부터 (날짜)"], ["夏休(なつやす)み", "여름 방학, 여름 휴가"], ["わかりました", "알겠습니다"], ["どこか", "어딘가"], ["ところ", "곳"], ["ぎおんまつり", "기온 마쓰리 (교토)"], ["見(み)る", "보다 (2류)"], ["〜たい", "~(하)고 싶다"], ["オッケー", "'OK'의 일본어 표기"], ["それから", "그리고"], ["これから", "이제부터"], ["みんな", "모두"], ["下(した)の なまえ", "(성이 아닌) 이름"], ["〜で", "~(으)로 (수단·방법)"], ["よぶ", "부르다 (1류)"], ["〜ませんか", "~(하)지 않을래요? (권유)"], ["いいよ", "좋아"]]}, {"unit": "t3", "page": "60", "task": "かくにん 2 · 날짜 · 희망 · 권유 표현", "items": [{"no": "1  날짜 표현", "lines": [["A", "日本(にほん)には いつ 来(き)ますか。", "일본에는 언제 오나요?"], ["B", "20日(はつか)に 行(い)きます。7月(しちがつ) 17日(じゅうしちにち)から 夏休(なつやす)みです。", "20일에 갑니다. 7월 17일부터 여름 방학이에요."]]}, {"no": "2  희망 표현 — 「〜たい」는 '~(하)고 싶다'", "lines": [["A", "どこか 行(い)きたい ところが ありますか。", "어딘가 가고 싶은 곳이 있습니까?"], ["B", "はい。テーマパークに 行(い)きたいです。", "네. 테마파크에 가고 싶어요."]]}, {"no": "もう すこし", "lines": [["A", "しゅうまつ、何(なに)か したい ことが ありますか。", "주말에 무언가 하고 싶은 것이 있습니까?"], ["B", "はい、えいがを 見(み)たいです。", "네, 영화를 보고 싶어요."]]}, {"no": "3  권유 표현 — 「〜ませんか」는 '~(하)지 않을래요?'", "lines": [["A", "これからは みんな 下(した)の なまえで よびませんか。", "이제부터는 모두 이름으로 부르지 않을래요?"], ["B", "いいですね。", "좋아요."]]}, {"no": "확인  알맞은 일본어 읽기는? (7월 20일)", "lines": [["", "しちがつ はつか", "7월 20일"]], "answer": "정답: しちがつ はつか  (しちがつ にじゅうにち (X))"}, {"no": "확인  알맞은 일본어 표현은? (테마파크에 가고 싶다.)", "lines": [["", "テーマパークに いきたい。", "테마파크에 가고 싶다."]], "answer": "정답: いきたい  (テーマパークに いく。 (X) — 그냥 '간다')"}, {"no": "확인  권유 표현으로 알맞은 것은?", "lines": [["", "したの なまえで よびませんか。", "이름으로 부르지 않을래요?"]], "answer": "정답: よびませんか  (したの なまえで よびます。 (X) — 그냥 '부릅니다')"}, {"no": "Tip  下(した)の なまえ", "lines": [["", "下(した)の なまえ", "일본에서는 성을 제외한 이름을 「下の なまえ」라고 합니다."]]}], "words": [["しちがつ", "7월 (숫자＋がつ)"], ["しがつ", "4월 (よん이 아니라 し)"], ["じゅうににち", "12일 (숫자＋にち)"], ["じゅうしちにち", "17일"], ["ついたち", "1일 (고유 읽기)"], ["はつか", "20일 (고유 읽기)"], ["何(なに)か", "무언가"], ["したい こと", "하고 싶은 것"], ["えいが", "영화"], ["いいですね", "좋아요"]]}, {"unit": "t3", "page": "61", "track": "3-10", "task": "みんなで はなそう 2 · 1. 잘 듣고, 빈칸에 들어갈 날짜를 히라가나로 쓰고 말해 봅시다.", "items": [{"lines": [["A", "イさん、にほんには いつ きますか。", "이 씨, 일본에는 언제 와요?"], ["B", "しちがつ はつかに いきます。しちがつ じゅうしちにちから なつやすみです。", "7월 20일에 가요. 7월 17일부터 여름 방학이에요."]], "answer": "정답: はつか  — つ 는 크게 씁니다. 작은 っ(はっか)로 쓰면 다른 말이 되어 오답입니다."}]}, {"unit": "t3", "page": "61", "track": "3-11", "task": "2. 잘 듣고, [보기]와 같이 짝과 대화해 봅시다.", "items": [{"no": "보기  ともだちと あそぶ", "lines": [["A", "しゅうまつ、なにか したい ことが ありますか。", "주말에 무언가 하고 싶은 것이 있어요?"], ["B", "はい、ともだちと あそびたいです。", "네, 친구와 놀고 싶어요."]], "answer": "あそぶ (1류) → あそびます → あそびたい"}, {"no": "①  かいものを する", "lines": [["A", "しゅうまつ、なにか したい ことが ありますか。", "주말에 무언가 하고 싶은 것이 있어요?"], ["B", "はい、かいものを したいです。", "네, 쇼핑을 하고 싶어요."]], "answer": "する (3류) → します → したい"}, {"no": "②  えいがを みる", "lines": [["A", "しゅうまつ、なにか したい ことが ありますか。", "주말에 무언가 하고 싶은 것이 있어요?"], ["B", "はい、えいがを みたいです。", "네, 영화를 보고 싶어요."]], "answer": "みる (2류) → みます → みたい"}, {"no": "③  ほっかいどうに いく", "lines": [["A", "しゅうまつ、なにか したい ことが ありますか。", "주말에 무언가 하고 싶은 것이 있어요?"], ["B", "はい、ほっかいどうに いきたいです。", "네, 홋카이도에 가고 싶어요."]], "answer": "いく (1류) → いきます → いきたい"}], "words": [["しゅうまつ", "주말"], ["なにか", "무언가"], ["ともだちと", "친구와"], ["あそぶ", "놀다 (1류)"], ["かいもの", "쇼핑, 장보기"], ["する", "하다 (3류)"], ["えいが", "영화"], ["みる", "보다 (2류)"], ["ほっかいどう", "홋카이도"], ["いく", "가다 (1류)"]]}, {"unit": "t3", "page": "61", "track": "3-12", "task": "3. 잘 듣고, 그림을 보며 빈칸에 들어갈 말을 쓰고 짝과 대화해 봅시다.", "items": [{"no": "①  おこのみやきを たべる", "lines": [["A", "いっしょに おこのみやきを たべませんか。", "같이 오코노미야키를 먹지 않을래요?"], ["B", "いいですね。", "좋아요."]], "answer": "たべる (2류) → たべます → たべませんか"}, {"no": "②  うたを うたう", "lines": [["A", "いっしょに うたを うたいませんか。", "같이 노래를 부르지 않을래요?"], ["B", "いいですね。", "좋아요."]], "answer": "うたう (1류) → うたいます → うたいませんか"}, {"no": "③  やきゅうを する", "lines": [["A", "いっしょに やきゅうを しませんか。", "같이 야구를 하지 않을래요?"], ["B", "いいですね。", "좋아요."]], "answer": "する (3류) → します → しませんか"}], "words": [["おこのみやき", "오코노미야키"], ["たべる", "먹다 (2류)"], ["いっしょに", "같이, 함께"], ["うた", "노래"], ["うたう", "(노래를) 부르다 (1류)"], ["やきゅう", "야구"], ["する", "하다 (3류)"], ["いいですね", "좋아요"]]}, {"unit": "t4", "page": "72", "track": "4-07", "task": "はじめる まえに 2 · 방법·수단을 묻는 표현", "sub": "1. 잘 듣고, 두 번씩 따라 말해 봅시다.", "items": [{"lines": [["A", "なにで いきますか。", "무엇으로 갑니까?"], ["B", "ちかてつで いきます。", "지하철로 갑니다."]]}], "words": [["なにで", "무엇으로"], ["ちかてつ", "지하철"], ["〜で", "~(으)로 (수단)"], ["しんかんせん", "신칸센"], ["タクシー", "택시"], ["バス", "버스"], ["じてんしゃ", "자전거 (필기)"]]}, {"unit": "t4", "page": "72", "track": "4-08", "task": "2. 주어진 단어를 밑줄 친 부분과 바꾸어 짝과 대화해 봅시다.", "sub": "밑줄 친 ちかてつ 자리에 주어진 단어를 넣은 대화입니다.", "items": [{"no": "①  しんかんせん", "lines": [["A", "なにで いきますか。", "무엇으로 갑니까?"], ["B", "しんかんせんで いきます。", "신칸센으로 갑니다."]]}, {"no": "②  タクシー", "lines": [["A", "なにで いきますか。", "무엇으로 갑니까?"], ["B", "タクシーで いきます。", "택시로 갑니다."]]}, {"no": "③  バス", "lines": [["A", "なにで いきますか。", "무엇으로 갑니까?"], ["B", "バスで いきます。", "버스로 갑니다."]]}]}, {"unit": "t4", "page": "73", "track": "4-09", "task": "きいて はなそう 2 · 본문 ★ 서술형 집중", "sub": "대중교통을 이용하여 테마파크에 놀러 갑니다.", "items": [{"lines": [["", "①ここから どうやって 行(い)くの?", "여기에서 어떻게 가는 거야?"], ["", "②ええと、まず、バスで おおさかえきまで 行(い)って、", "음, 먼저 버스로 오사카역까지 가서,"], ["", "③それから 電車(でんしゃ)に のりかえるよ。", "그리고 전철로 갈아탈 거야."]]}, {"lines": [["ノア", "④わあ、もう あんなに 人(ひと)が ならんで いる。", "와, 벌써 저렇게 사람이 줄을 서 있어."], ["はるな", "⑤ほんとだ。ユミちゃん、れんくん、はやく、はやく。", "정말이네. 유미야, 렌, 빨리, 빨리."], ["ユミ", "⑥え? あれに のるの?", "어? 저거 타는 거야?"], ["はるな", "⑦うん。", "응."]]}, {"lines": [["ユミ", "⑧あ、あの アトラクション、こ、こわく ない?", "아, 저 놀이기구, 무, 무섭지 않아?"], ["れん", "⑨ぜんぜん こわく ないよ。", "전혀 안 무서워."], ["ユミ", "⑩わたしは、アトラクションより ショーの ほうが いいのに……。", "나는 놀이기구보다 쇼 쪽이 좋은데……."]]}, {"no": "Q1  친구들은 버스를 타고 어느 역에서 전철로 갈아탔나요?", "lines": [], "answer": "정답: 오사카역 (バスで おおさかえきまで 行って、それから 電車に のりかえる)"}, {"no": "Q2  놀이기구를 타는 것보다 쇼를 보고 싶어 한 사람은 누구인가요?", "lines": [], "answer": "정답: 유미 (ユミ — アトラクションより ショーの ほうが いいのに)"}], "words": [["どうやって", "어떻게"], ["〜の?", "문장 끝에서 질문을 나타냄"], ["まず", "우선, 먼저"], ["おおさか", "오사카"], ["えき", "역"], ["〜まで", "~까지"], ["〜て[で]", "~(하)고, ~(해)서 — 行って 는 いく 의 て형 (예외)"], ["電車(でんしゃ)", "전철"], ["〜に のりかえる", "~(으)로 갈아타다 (2류)"], ["もう", "벌써, 이미"], ["あんなに", "저렇게"], ["人(ひと)", "사람"], ["ならぶ", "한 줄로 서다, 늘어서다 (1류)"], ["〜て[で] いる", "~(하)고 있다 — ならぶ → ならんで いる"], ["ほんとだ", "정말이다"], ["はやく", "빨리"], ["〜に のる", "~을/를 타다 (のる 1류)"], ["え", "어 (놀라거나 당황할 때의 소리)"], ["あれ", "저것"], ["あの", "저"], ["アトラクション", "놀이기구"], ["こわい", "무섭다 — こわく ない (무섭지 않다)"], ["ぜんぜん", "전혀 (부정문과 함께)"], ["〜より", "~보다"], ["ショー", "쇼"], ["ほう", "쪽, 편"], ["〜のに", "~한데 (아쉬움)"]]}, {"unit": "t4", "page": "74", "task": "かくにん 2 · 방법·안내 / て형 / 상황 설명 / 비교 표현", "items": [{"no": "1  방법·안내 표현", "lines": [["A", "ここから どうやって 行(い)くの?", "여기에서 어떻게 가는 거야?"], ["B", "ええと、まず、バスで おおさかえきまで 行(い)って、それから 電車(でんしゃ)に のりかえるよ。", "음, 먼저 버스로 오사카역에 가서, 그리고 전철로 갈아탈 거야."]]}, {"no": "동사의 て형 만들기 (부록 144쪽 워크시트) — 1류 동사", "lines": [["く", "かく → かいて", "쓰다 → 쓰고  (く → いて)"], ["ぐ", "およぐ → およいで", "수영하다 → 수영하고  (ぐ → いで)"], ["る", "はいる → はいって", "들어가[오]다 → 들어가[오]고  (う·つ·る → って, 예외 1류)"], ["む", "やすむ → やすんで", "쉬다 → 쉬고  (ぬ·ぶ·む → んで)"], ["す", "はなす → はなして", "말하다 → 말하고  (す → して)"], ["예외", "いく → いって", "가다 → 가고  (いいて (X))"]]}, {"no": "2류 동사 — る 없애고 → て", "lines": [["", "みる → みて", "보다 → 보고"], ["", "たべる → たべて", "먹다 → 먹고"]]}, {"no": "3류 동사 — 불규칙 활용", "lines": [["", "くる → きて", "오다 → 오고"], ["", "する → して", "하다 → 하고"]]}, {"no": "Tip  예외 1류 동사", "lines": [["", "はいる · かえる", "「はいる」(들어가다, 들어오다)와 「かえる」(돌아가다, 돌아오다)는 2류 동사처럼 보이지만 예외 1류 동사입니다."]]}, {"no": "2  상황 설명 — 「〜て[で] いる」는 '~어 있다', '~(하)고 있다'", "lines": [["", "わあ、もう あんなに 人(ひと)が ならんで いる。", "와, 벌써 저렇게 사람이 줄을 서 있네."], ["もう すこし", "れんくんは いま おべんとうを たべて いる。", "렌 군은 지금 도시락을 먹고 있다."]]}, {"no": "3  비교 표현 — 대답에는 「〜の ほうが」(~쪽이)", "lines": [["A", "アトラクションと ショーと どちらが いいですか。", "놀이 기구와 쇼 중 어느 쪽이 좋아요?"], ["B", "わたしは アトラクションより ショーの ほうが いいです。", "나는 놀이 기구보다 쇼 쪽이 좋아요."]]}, {"no": "확인  알맞은 일본어 표현은? (어떻게 가는 거야?)", "lines": [["", "どうやって いくの?", "어떻게 가는 거야?"]], "answer": "정답: どうやって いくの?  (どうやって くるの? (X) — '오는 거야')"}, {"no": "확인  밑줄 친 낱말을 문맥에 맞도록 알맞게 활용한 것은? (えきに いく でんしゃに のりかえる)", "lines": [["", "えきに いって でんしゃに のりかえる。", "역에 가서 전철로 갈아타다."]], "answer": "정답: いって  (いて (X) — いく 의 て형은 예외)"}, {"no": "확인  알맞은 일본어 표현은? (줄을 서 있다.)", "lines": [["", "ならんで いる。", "줄을 서 있다."]], "answer": "정답: ならんで いる  (ならって いる (X) — ぶ → んで)"}, {"no": "확인  비교 표현으로 알맞은 것은?", "lines": [["", "アトラクションより ショーの ほうが いい。", "놀이 기구보다 쇼 쪽이 좋다."]], "answer": "정답: 〜より 〜の ほうが  (アトラクションと ショーが いい。 (X))"}], "words": [["どうやって いくの?", "어떻게 가는 거야?"], ["〜て、それから", "~해서, 그리고 (순서)"], ["〜て[で] いる", "~(하)고 있다, ~어 있다"], ["いま", "지금"], ["おべんとう", "도시락"], ["Aと Bと どちらが", "A와 B 중 어느 쪽이"], ["Aより Bの ほうが", "A보다 B 쪽이"]]}, {"unit": "t4", "page": "75", "track": "4-10", "task": "みんなで はなそう 2 · 1. 잘 듣고, [보기]와 같이 짝과 대화해 봅시다.", "items": [{"no": "보기  おおさか / バス", "lines": [["A", "おおさかまで どうやって いきますか。", "오사카까지 어떻게 갑니까?"], ["B", "バスで いきます。", "버스로 갑니다."]]}, {"no": "①  とうきょう / しんかんせん", "lines": [["A", "とうきょうまで どうやって いきますか。", "도쿄까지 어떻게 갑니까?"], ["B", "しんかんせんで いきます。", "신칸센으로 갑니다."]]}, {"no": "②  ふくおか / ふね", "lines": [["A", "ふくおかまで どうやって いきますか。", "후쿠오카까지 어떻게 갑니까?"], ["B", "ふねで いきます。", "배로 갑니다."]]}, {"no": "③  おきなわ / ひこうき", "lines": [["A", "おきなわまで どうやって いきますか。", "오키나와까지 어떻게 갑니까?"], ["B", "ひこうきで いきます。", "비행기로 갑니다."]]}], "words": [["とうきょう", "도쿄"], ["ふくおか", "후쿠오카"], ["ふね", "배"], ["おきなわ", "오키나와"], ["ひこうき", "비행기"], ["〜まで", "~까지"]]}, {"unit": "t4", "page": "75", "track": "4-11", "task": "2. 잘 듣고, 그림에 해당하는 상황을 일본어로 써 봅시다.", "items": [{"no": "①  ケーキを つくる", "lines": [["", "ケーキを つくって います。", "케이크를 만들고 있습니다."]], "answer": "つくる (1류, る → って) → つくって います"}, {"no": "②  バスケを する", "lines": [["", "バスケを して います。", "농구를 하고 있습니다."]], "answer": "する (3류) → して います"}, {"no": "③  がっこうに くる", "lines": [["", "がっこうに きて います。", "학교에 와 있습니다."]], "answer": "くる (3류) → きて います  (くって (X))"}], "words": [["ケーキ", "케이크"], ["つくる", "만들다 (1류)"], ["バスケ", "농구"], ["する", "하다 (3류)"], ["がっこう", "학교"], ["くる", "오다 (3류)"], ["〜て います", "~(하)고 있습니다"]]}, {"unit": "t4", "page": "75", "track": "4-12", "task": "3. 잘 듣고, [보기]와 같이 짝과 대화해 봅시다.", "sub": "보기의 파랑·빨강·초록 자리에 ①~③의 낱말을 넣어 만든 대화입니다. B 는 보기처럼 파랑 자리 낱말로 대답합니다.", "items": [{"no": "보기  アトラクション / ショー / いい", "lines": [["A", "アトラクションと ショーと どちらが いいですか。", "놀이기구와 쇼 중 어느 쪽이 좋습니까?"], ["B", "アトラクションの ほうが いいです。", "놀이기구 쪽이 좋습니다."]]}, {"no": "①  えいご / すうがく / むずかしい", "lines": [["A", "えいごと すうがくと どちらが むずかしいですか。", "영어와 수학 중 어느 쪽이 어렵습니까?"], ["B", "えいごの ほうが むずかしいです。", "영어 쪽이 어렵습니다."]]}, {"no": "②  ほっかいどう / きゅうしゅう / おおきい", "lines": [["A", "ほっかいどうと きゅうしゅうと どちらが おおきいですか。", "홋카이도와 규슈 중 어느 쪽이 큽니까?"], ["B", "ほっかいどうの ほうが おおきいです。", "홋카이도 쪽이 큽니다."]]}, {"no": "③  サッカー / やきゅう / おもしろい", "lines": [["A", "サッカーと やきゅうと どちらが おもしろいですか。", "축구와 야구 중 어느 쪽이 재미있습니까?"], ["B", "サッカーの ほうが おもしろいです。", "축구 쪽이 재미있습니다."]]}], "words": [["どちらが", "어느 쪽이"], ["〜の ほうが", "~쪽이"], ["えいご", "영어"], ["すうがく", "수학"], ["むずかしい", "어렵다"], ["ほっかいどう", "홋카이도"], ["きゅうしゅう", "규슈"], ["おおきい", "크다"], ["サッカー", "축구"], ["やきゅう", "야구"], ["おもしろい", "재미있다"]]}, {"unit": "t6", "page": "98", "track": "6-01", "task": "단원 도입 — 의사소통 기본 표현", "items": [{"lines": [["", "ハナちゃん、あぶない!", "하나야, 위험해!  (6과 제목)"], ["", "こんどの しゅうまつ、なに する?", "[예정] 이번 주말에 뭐 해?"], ["", "ぼうさいセンターは どうやって いくのかな?", "[방법·이유] 방재 센터는 어떻게 가는 걸까?"], ["", "まず、あたまと からだを まもりましょう。", "[지시] 먼저 머리와 몸을 지킵시다."], ["", "それから?", "[화제 전개] 그다음엔?"], ["", "あぶない!", "[주의 환기] 위험해!"]]}], "words": [["あぶない", "위험하다"], ["こんど", "이번"], ["しゅうまつ", "주말"], ["なに", "무엇"], ["する", "하다"], ["ぼうさいセンター", "방재 센터"], ["どうやって", "어떻게 해서"], ["いく", "가다"], ["〜かな", "~일까"], ["まず", "우선, 먼저"], ["あたま", "머리"], ["からだ", "몸"], ["まもりましょう", "지킵시다"], ["それから", "그리고, 그다음"]]}, {"unit": "t6", "page": "100", "track": "6-02", "task": "듣고 말하기 1 · なにを する?", "sub": "단어를 잘 듣고 따라 말해 봅시다. (한 번씩 두 번 읽어 줍니다)", "words": [["① おきる", "일어나다"], ["② あらう", "씻다"], ["③ たべる", "먹다"], ["④ のむ", "마시다"], ["⑤ みる", "보다"], ["⑥ ねる", "자다"], ["⑦ いく", "가다"], ["⑧ べんきょうする", "공부하다"], ["⑨ よむ", "읽다"], ["⑩ やすむ", "쉬다"], ["⑪ くる", "오다"], ["⑫ はなす", "말하다"], ["⑬ かえる", "(집에) 돌아가다·돌아오다"], ["⑭ のる", "타다"], ["⑮ あそぶ", "놀다"]]}, {"unit": "t6", "page": "101", "track": "6-03", "task": "1. 잘 듣고 내용과 일치하는 것에 체크(V) 표를 해 봅시다.", "audio_only": true, "items": [{"no": "①", "lines": [["A", "しんじゅくに どうやって いく?", "신주쿠에 어떻게 가?"], ["B", "バスで いくよ。", "버스로 가."]], "answer": "정답: バス"}, {"no": "②", "lines": [["A", "がっこうに どうやって くる?", "학교에 어떻게 와?"], ["B", "じてんしゃで くるよ。", "자전거로 와."]], "answer": "정답: じてんしゃ"}], "words": [["しんじゅく", "신주쿠 (도쿄의 지명)"], ["どうやって", "어떻게 해서"], ["いく", "가다"], ["バス", "버스"], ["〜で", "~로 (수단)"], ["がっこう", "학교"], ["くる", "오다"], ["じてんしゃ", "자전거"], ["でんしゃ", "전철 (보기)"], ["タクシー", "택시 (보기)"]]}, {"unit": "t6", "page": "101", "track": "6-04", "task": "2. 잘 듣고 [보기]와 같이 짝과 대화해 봅시다.", "audio_only": true, "items": [{"no": "보기", "lines": [["A", "こんどの しゅうまつ、なに する?", "이번 주말에 뭐 해?"], ["B", "ともだちと アニメを みる よていだよ。", "친구랑 애니메이션 볼 예정이야."]]}, {"no": "①", "lines": [["A", "こんどの しゅうまつ、なに する?", "이번 주말에 뭐 해?"], ["B", "ともだちと かいものに いく よていだよ。", "친구랑 쇼핑하러 갈 예정이야."]]}, {"no": "②", "lines": [["A", "こんどの しゅうまつ、なに する?", "이번 주말에 뭐 해?"], ["B", "ともだちと うんどうを する よていだよ。", "친구랑 운동할 예정이야."]]}, {"no": "③", "lines": [["A", "こんどの しゅうまつ、なに する?", "이번 주말에 뭐 해?"], ["B", "ともだちと うみで あそぶ よていだよ。", "친구랑 바다에서 놀 예정이야."]]}], "words": [["こんど", "이번"], ["しゅうまつ", "주말"], ["なに", "무엇"], ["ともだち", "친구"], ["アニメ", "애니메이션"], ["みる", "보다"], ["〜よていだ", "~할 예정이다"], ["かいものに いく", "쇼핑하러 가다"], ["うんどう", "운동"], ["する", "하다"], ["うみ", "바다"], ["〜で", "~에서 (장소)"], ["あそぶ", "놀다"]]}, {"unit": "t6", "page": "102", "track": "6-05", "task": "듣고 말하기 2 · どう しますか。", "sub": "지진이 발생했을 때 필요한 표현입니다. 잘 듣고 뜻을 생각해 봅시다. (한 번씩 두 번 읽어 줍니다)", "words": [["① まもります", "지킵니다"], ["② はいります", "들어갑니다"], ["③ しゃがみます", "쭈그려 앉습니다"], ["④ まちます", "기다립니다"], ["⑤ けします", "끕니다"], ["⑥ あけます", "엽니다"], ["⑦ よびます", "부릅니다"]]}, {"unit": "t6", "page": "103", "track": "6-06", "task": "1. 잘 듣고 지진에 대피하는 순서대로 번호를 써 봅시다.", "audio_only": true, "items": [{"lines": [["", "まず、テーブルの したに はいります。", "먼저, 테이블 밑에 들어갑니다."], ["", "それから、ひを けします。", "그리고, 불을 끕니다."], ["", "ドアを あけます。", "문을 엽니다."]], "answer": "정답: 테이블 밑 1 → 불 끄기 2 → 문 열기 3"}], "words": [["まず", "우선, 먼저"], ["テーブル", "테이블"], ["した", "아래, 밑"], ["はいります", "들어갑니다"], ["それから", "그리고"], ["ひ", "불"], ["けします", "끕니다"], ["ドア", "문"], ["あけます", "엽니다"]]}, {"unit": "t6", "page": "103", "track": "6-07", "task": "2. 잘 듣고 어울리는 말과 연결한 다음 말해 봅시다.", "audio_only": true, "items": [{"no": "①", "lines": [["", "しんごうを まもりましょう。", "신호를 지킵시다."]]}, {"no": "②", "lines": [["", "プールから でましょう。", "수영장에서 나갑시다."]]}, {"no": "③", "lines": [["", "てを あらいましょう。", "손을 씻읍시다."]], "answer": "정답: ①-ㄷ まもりましょう · ②-ㄴ でましょう · ③-ㄱ あらいましょう"}], "words": [["しんごう", "신호"], ["まもりましょう", "지킵시다"], ["プール", "수영장"], ["〜から", "~에서"], ["でましょう", "나갑시다"], ["て", "손"], ["あらいましょう", "씻읍시다"]]}, {"unit": "t6", "page": "104", "track": "6-08", "task": "읽고 쓰기 1", "sub": "학교에서 방재 훈련을 받은 하나가 주말에 방재 센터에 가고 싶어 합니다.", "items": [{"lines": [["ハナ", "なみちゃん、こんどの しゅうまつ、なに する?", "나미야, 이번 주말에 뭐 해?"], ["なみ", "とくに よていは ないけど……。", "딱히 예정은 없는데……."], ["ハナ", "いっしょに どこか いく?", "같이 어디 갈래?"], ["なみ", "うん!", "응!"]]}, {"lines": [["なみ", "どこが いい?", "어디가 좋아?"], ["ハナ", "うーん。ぼうさいセンターは どう? もう すぐ ぼうさいの ひだから。", "음……. 방재 센터는 어때? 이제 곧 방재의 날이니까."], ["なみ", "うん、いいよ。ひなたくんも さそう?", "응, 좋아. 히나타도 부를까?"], ["ハナ", "そうだね。ぼうさいセンターは どうやって いくのかなあ?", "그러네. 방재 센터는 어떻게 가는 걸까?"], ["なみ", "えきから バスが あるよ。", "역에서 버스가 있어."]]}], "words": [["こんど", "이번, 이다음"], ["しゅうまつ", "주말"], ["とくに", "특별히"], ["よてい", "예정"], ["〜けど", "(이)지만"], ["いっしょに", "같이, 함께"], ["どこか", "어딘가"], ["どこが", "어디가"], ["ぼうさいセンター", "방재 센터"], ["もう すぐ", "이제 곧"], ["ぼうさいの ひ", "방재의 날"], ["〜だから", "(이)므로, (이)니까"], ["さそう", "권하다, 부르다"], ["どうやって", "어떻게 해서"], ["〜かなあ", "~일까?"], ["えき", "역"], ["〜から", "~에서"]]}, {"unit": "t6", "page": "105", "task": "정리하기 1", "items": [{"no": "1  どこか vs どこが — 어디인가? vs 어디가", "lines": [["", "どこか いく?", "어디인가 갈까?"], ["", "どこが いい?", "어디가 좋아?"]]}, {"no": "2  ～から — 때문에(이유), 에서(출발·기점)", "lines": [["", "もう すぐ ぼうさいの ひだから。", "이제 곧 방재의 날이니까."], ["", "えきから バスが あるよ。", "역에서 (가는) 버스가 있어."]]}, {"no": "3  방법", "lines": [["", "どうやって いくの?", "어떻게 해서 가는 거야?"]]}, {"no": "문제 1  낱말 카드를 알맞게 나열하여 문장을 완성해 봅시다.  (の · する · こんど · なに · しゅうまつ)", "lines": [["", "こんどの しゅうまつ、なに する?", "이번 주말에 뭐 해?"]], "answer": "정답: こんど → の → しゅうまつ → なに → する"}, {"no": "문제 2  하나와 나미가 주말에 가기로 한 장소에 체크(V) 표를 하고 일본어로 써 봅시다.", "lines": [["", "ぼうさいセンター", "방재 센터"]], "answer": "정답: ② 방재 센터  (① 신사 · ③ 테마파크 아님)"}], "words": [["どこか", "어딘가 (정해지지 않은 곳)"], ["どこが", "어디가 (고르는 대상)"], ["〜から ①", "~때문에 (명사+だから, 이유)"], ["〜から ②", "~에서 (출발·기점)"], ["どうやって", "어떻게 해서 (방법)"]]}, {"unit": "t6", "page": "106", "track": "6-09", "task": "읽고 쓰기 2", "sub": "하나 일행이 방재 센터에서 지진 체험을 합니다. (말한 사람은 교과서 그림 기준)", "items": [{"lines": [["직원", "じしんの ときは、まず、どう しますか。", "지진이 났을 때는 먼저 어떻게 합니까?"], ["ひなた", "おおきい こえで たすけを よびます。", "큰 목소리로 도움을 부릅니다."], ["직원", "いいえ、ちがいます。", "아니요, 틀렸습니다."]]}, {"lines": [["なみ", "つくえや テーブルの したに はいります。", "책상이나 테이블 밑에 들어갑니다."], ["직원", "そうです。まず、あたまと からだを まもりましょう。それから?", "맞습니다. 먼저 머리와 몸을 지킵시다. 그다음엔?"], ["ハナ", "ひを けします。", "불을 끕니다."], ["なみ", "ドアや まどを あけます。", "문이나 창문을 엽니다."], ["직원", "はい、そうです。", "네, 맞습니다."]]}, {"lines": [["", "わっ、じしんだ!", "앗, 지진이다!"], ["ひなた", "ハナちゃん、あぶない! きを つけて!", "하나야, 위험해! 조심해!"], ["", "はやく、はやく!", "빨리, 빨리!"]]}], "words": [["じしん", "지진"], ["とき", "때"], ["どう しますか", "어떻게 합니까"], ["おおきい", "크다"], ["こえで", "목소리로"], ["たすけ", "도움"], ["よびます", "부릅니다"], ["ちがいます", "틀립니다"], ["つくえ", "책상"], ["〜や", "(이)랑, (이)나"], ["テーブル", "테이블"], ["した", "아래, 밑"], ["はいります", "들어갑니다"], ["あたま", "머리"], ["からだ", "몸"], ["まもりましょう", "지킵시다"], ["それから", "그리고"], ["ひ", "불"], ["けします", "끕니다"], ["ドア", "문"], ["まど", "창문"], ["あけます", "엽니다"], ["あぶない", "위험해"], ["きを つけて", "조심해"], ["はやく", "빨리"]]}, {"unit": "t6", "page": "107", "task": "정리하기 2", "items": [{"no": "1  긍정 · 부정", "lines": [["", "はい、そうです。", "네, 그렇습니다."], ["", "いいえ、ちがいます。", "아니요, 틀렸습니다."]]}, {"no": "2  화제 전개", "lines": [["", "まず、つくえや テーブルの したに はいります。それから、ひを けします。", "우선, 책상이나 테이블 밑에 들어갑니다. 그리고, 불을 끕니다."]]}, {"no": "3  동사 표현 정리 — 동사의 기본형은 [u]단으로 끝난다.  (기본형 → ます → ましょう)", "lines": [["", "いく → いきます → いきましょう", "가다 → 갑니다 → 갑시다"], ["", "かえる → かえります → かえりましょう", "돌아가(오)다 → 돌아갑(옵)니다 → 돌아갑(옵)시다"], ["", "みる → みます → みましょう", "보다 → 봅니다 → 봅시다"], ["", "たべる → たべます → たべましょう", "먹다 → 먹습니다 → 먹읍시다"], ["", "くる → きます → きましょう", "오다 → 옵니다 → 옵시다"], ["", "する → します → しましょう", "하다 → 합니다 → 합시다"]]}, {"no": "문제 1  빈칸을 채워 문장을 완성해 봅시다.", "lines": [["", "じしんの ときは、あたまと からだを まもりましょう。", "지진이 났을 때는 머리와 몸을 지킵시다."]], "answer": "정답: あたま · からだ"}, {"no": "문제 2  지진이 일어났을 때 초기에 대처하는 요령을 써 봅시다.  (じしんの ときは)", "lines": [["①", "つくえや テーブルの したに はいります。", "책상이나 테이블 밑에 들어갑니다."], ["②", "ひを けします。", "불을 끕니다."], ["③", "ドアや まどを あけます。", "문이나 창문을 엽니다."]]}], "words": [["はい、そうです", "네, 그렇습니다 (긍정)"], ["いいえ、ちがいます", "아니요, 틀렸습니다 (부정)"], ["まず", "우선 (순서의 처음)"], ["それから", "그리고 (다음 순서)"], ["〜ます", "~합니다 (정중형)"], ["〜ましょう", "~합시다 (권유형)"]]}, {"unit": "t6", "page": "111", "track": "6-10", "task": "1. 잘 듣고 내용이 맞으면 ○표, 틀리면 ×표를 해 봅시다.", "audio_only": true, "items": [{"no": "①", "lines": [["", "ドアや まどを あけます。", "문이나 창문을 엽니다."]]}, {"no": "②", "lines": [["", "ひを けします。", "불을 끕니다."]]}, {"no": "③", "lines": [["", "ぼうさいセンターに いきます。", "방재 센터에 갑니다."]]}], "words": [["ドア", "문"], ["〜や", "(이)나"], ["まど", "창문"], ["あけます", "엽니다"], ["ひ", "불"], ["けします", "끕니다"], ["ぼうさいセンター", "방재 센터"], ["いきます", "갑니다"]]}];
