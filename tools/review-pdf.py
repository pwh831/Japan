# -*- coding: utf-8 -*-
"""시험 전날 최종 복습 자료 — docs/study/

    FONT_DIR=... python3 tools/review-pdf.py

0. 최종 복습 계획표       — 오늘 밤·내일 아침 순서, 쪽마다 확인할 것과 볼 자료(체크 칸), 지금까지 만든 자료 다시 보기 목록
6. 범위 전체 요점정리     — 6과 98~111쪽, 회화 3과 58~61쪽, 4과 72~75쪽의 모든 문장(해석)과 어휘를 쪽 순서로
7. 단어 셀프테스트        — 앱 단어장 130개를 뜻만 보고 쓰기 (정답은 뒷장)
8. 내 약한 단어           — docs/study/weak-words.json (직접 고른 단어 · 노트에 틀리게 적힌 철자) 카드와 셀프테스트 3회
최종복습-통합본.pdf        — 위 자료와 지금까지 만든 PDF 전부를 복습 순서로 한 파일에 (책갈피 포함, 굿노트용)

문장은 docs/scripts/unit*-all.json, 단어는 앱 데이터(tools/extract-engine.py 로 뽑은 엔진)에서 그대로 가져온다.
글꼴·표 도우미는 study-pdf.py 와 같다.
"""
import importlib.util, json, os, re, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location("sd", os.path.join(ROOT, "tools", "study-pdf.py"))
sd = importlib.util.module_from_spec(spec); spec.loader.exec_module(sd)
P, S, doc, grid, kana, plain, mix = sd.P, sd.S, sd.doc, sd.grid, sd.kana, sd.plain, sd.mix
TINT, PINK, BODY, OUT = sd.TINT, sd.PINK, sd.BODY, sd.OUT

from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import Paragraph, Spacer, KeepTogether, PageBreak

BOX = "□"   # 나눔고딕에 있는 빈 네모 (☐ 은 글꼴에 없다)

# ─────────────────────────── 쪽마다 확인할 것 ───────────────────────────
# (쪽, 내용, 꼭 확인할 것, 볼 자료) — 계획표의 체크리스트와 요점정리의 '확인' 줄에 같이 쓴다
PAGES = [
 ("6과 · NE능률 「고등학교 일본어」 98~111쪽", [
  ("98", "단원 도입 · 기본 표현", "どうやって いくのかな? / まず、あたまと からだを まもりましょう。 / それから?", "요점정리"),
  ("100", "동사 15개", "1·2·3류 구분 — かえる 예외 1류, くる·べんきょうする 3류, おきる·たべる·みる·ねる 2류", "활용표 · 단어테스트"),
  ("101", "듣기 (음성 전용)", "バスで·じてんしゃで (で 수단) / ～よていだ / かいものに いく / うみで あそぶ", "6과 전체지문"),
  ("102", "지진 표현 7개 (ます형)", "まもります·はいります·しゃがみます·まちます·けします·あけます·よびます → 기본형과 종류", "활용표"),
  ("103", "듣기 (음성 전용)", "대피 순서: したに はいります → ひを けします → ドアを あけます / プールから でましょう", "6과 전체지문"),
  ("104", "★ 읽고 쓰기 1 (본문 · 서술형)", "どこか いく? / どこが いい? / ぼうさいの ひだから / さそう? / えきから バスが ある / ～けど", "본문 쓰기"),
  ("105", "정리하기 1", "どこか(어딘가) ↔ どこが(어디가) / から ① 이유(명사+だから) ② 출발(えきから)", "함정체크"),
  ("106", "★ 읽고 쓰기 2 (본문 · 서술형)", "★ きを つけて! / おおきい こえで(수단) / つくえや テーブルの したに / ちがいます / よびます", "본문 쓰기"),
  ("107", "정리하기 2", "ます → ましょう 표 (いく·かえる·みる·たべる·くる·する) / はい、そうです ↔ いいえ、ちがいます", "활용표"),
  ("108~110", "(사진을 받지 못함 — 문화 쪽으로 보이며 문화는 출제 제외)", "—", "—"),
  ("111", "듣기 ○× (음성 전용)", "ドアや まどを あけます / ひを けします / ぼうさいセンターに いきます", "6과 전체지문")]),
 ("회화 3과 · 천재교과서 「고등학교 일본어 회화」 58~61쪽", [
  ("58", "희망 표현 ～たい", "どこに いきたいですか — テーマパークに いきたいです (いく → いきます → いきたい)", "요점정리"),
  ("59", "★ 본문 (서술형)", "7月 20日(しちがつ はつか) · 17日(じゅうしちにち)から / どこか 行きたい ところ / 見たい / これからは / 下の なまえで よびませんか", "본문 쓰기"),
  ("60", "かくにん 2", "날짜 읽기 (しがつ·ついたち·はつか·じゅうににち) / 何か したい ことが ありますか / ～ませんか", "함정체크"),
  ("61", "みんなで はなそう 2", "날짜를 히라가나로 / あそびたい·したい·みたい·いきたい / たべませんか·うたいませんか·しませんか", "회화 전체지문")]),
 ("회화 4과 · 천재교과서 「고등학교 일본어 회화」 72~75쪽", [
  ("72", "수단 묻기", "なにで いきますか — ちかてつで いきます (で 수단: しんかんせん·タクシー·バス)", "요점정리"),
  ("73", "★ 본문 (서술형)", "行って(いく 예외 て형) / ～まで / 電車に のりかえる / ならんで いる / あれに のる / こわく ない / ぜんぜん / より～の ほうが", "본문 쓰기"),
  ("74", "かくにん 2 · て형", "음편: く→いて · ぐ→いで · う·つ·る→って · ぬ·む·ぶ→んで · す→して · いく→いって / ～て いる / Aと Bと どちらが", "활용표 · 음편 1·2회"),
  ("75", "みんなで はなそう 2", "～まで どうやって (ふね·ひこうき) / つくって·して·きて います / どちらが ～ですか — ～の ほうが (3번은 색 칸마다 대화 1개)", "회화 전체지문")]),
]
CHECK = {pg: what for _, rows in PAGES for pg, _, what, _ in rows}

# ─────────────────────────── 0. 계획표 ───────────────────────────
TONIGHT = [
 ("30분", "범위 전체 요점정리 (6번)", "쪽마다 일본어를 소리 내어 읽고 해석을 가린 채 뜻 말하기. 막히는 줄에 표시 → 뒤의 체크리스트 1회차 칸"),
 ("25분", "단어 셀프테스트 130개 (7번)", "뜻만 보고 쓰기 → 뒷장으로 채점 → 틀린 단어는 단어장-발음 PDF에서 다시 보고 3번 쓰기"),
 ("25분", "동사 활용표 + 음편 1·2회 (20문항) 다시 풀기", "분홍 줄(かえる·はいる·いく) 먼저. 구분 + 활용 단답형(ある → 1류, あって) 형식으로 말해 보기"),
 ("40분", "본문 서술형 쓰기 36문장 (104·106·59·73쪽)", "서술형 30점. 우리말만 보고 쓰기 → 조사 하나까지 채점 → 틀린 문장만 3번 쓰기"),
 ("50분", "변형문제 실전 1세트 (아직 안 푼 5~8회 중 하나)", "시간 재고 한 번에. 채점 후 해설을 읽고 틀린 문항의 쪽을 아래 체크리스트에서 찾아 다시 보기"),
 ("20분", "자주 틀리는 유형 10문항 + 4회 오답", "4회는 17/21 — 틀렸던 4문항을 출제실에서 다시 풀기"),
 ("15분", "함정 체크리스트 → 잠자기", "한 글자 차이 선지(とこる·とくろ)만 훑고 일찍 자기"),
]
MORNING = [
 ("10분", "함정 체크리스트 1장", "날짜(しちがつ はつか · じゅうしちにち) · 장음(テーマパーク · ショー) · どこか/どこが"),
 ("10분", "본문 4개 소리 내어 1번", "104 · 106 · 59 · 73쪽 — ★ きを つけて"),
 ("5분", "동사 활용표 분홍 줄", "かえる·はいる → 1류 / いく → いって / くる → きて"),
]
IN_EXAM = ["발문의 '않은 · 아닌 · 틀린'에 동그라미", "서답형은 비워 두지 않기 — 조사 하나도 1점",
           "한자는 자신 없으면 가나로 (틀린 한자는 오답)", "가타카나 어휘는 가타카나로 (교과서가 둘 다 쓴 낱말만 아무거나)",
           "구분 + 활용 단답형은 둘 다 쓰기 (예: 1류, あって)", "철자 선지는 정답 후보끼리 한 글자씩 대 보기"]
MATERIALS = [
 ("단어", "2026-일본어회화-2학기1회고사-단어장-발음.pdf", "130개 + 발음. 셀프테스트에서 틀린 것만"),
 ("활용", "study/2-동사활용표.pdf · sets/음편-て형-10문항(1·2회).pdf", "단답형 16점 + 객관식 4문항"),
 ("본문", "study/1-본문-서술형-쓰기연습.pdf", "서술형 30점"),
 ("지문", "scripts/6과-전체지문.pdf · scripts/회화-3·4과-전체지문.pdf", "음성 전용 지문(101·103·111·61·75쪽) 포함"),
 ("함정", "study/3-시험직전-함정체크.pdf · study/4-자주틀리는유형-보충10문항.pdf", "한 글자 차이·기출 형식"),
 ("실전", "sets/변형문제-4~8회.pdf (출제실에서도 풀 수 있음)", "4회 17/21 · 5~8회는 아직 기록 없음"),
 ("보험", "study/5-회화3과-54~56쪽-요약.pdf", "범위표 '3과~4과'가 넓을 때 대비"),
]

def plan():
    tbl = lambda rows, w: grid([[P("□", "big")] + [P(x, "cellS" if i else "cell", i == 0) for i, x in enumerate(r)] for r in rows],
                               [8 * mm] + w, head=False)
    story = [P("최종 복습 계획표 — 10/08(목) 1교시", "title", True),
             P("목표 100점. 객관식 21문항 50점 + 서답형 9문항 50점(단답 20 · 서술 30). 이미 본 자료를 한 번씩 다시 보되, "
               "모든 쪽이 한 번은 체크되도록 아래 순서대로 진행하세요. 끝낸 칸에 표시합니다.", "lead"), Spacer(1, 3 * mm),
             P("오늘 밤 (약 3시간 30분)", "sec", True), Spacer(1, 1 * mm),
             tbl(TONIGHT, [16 * mm, 62 * mm, BODY - 86 * mm]), Spacer(1, 3 * mm),
             P("내일 아침 · 시험 전", "sec", True), Spacer(1, 1 * mm),
             tbl(MORNING, [16 * mm, 62 * mm, BODY - 86 * mm]), Spacer(1, 3 * mm),
             P("시험지 받으면", "sec", True), Spacer(1, 1 * mm),
             grid([[P("□", "big"), P(a), P("□", "big"), P(b)] for a, b in zip(IN_EXAM[::2], IN_EXAM[1::2])],
                  [8 * mm, BODY / 2 - 8 * mm, 8 * mm, BODY / 2 - 8 * mm], head=False),
             PageBreak(), P("쪽별 체크리스트 — 범위 전체", "title", True),
             P("한 쪽씩 '꼭 확인할 것'을 소리 내어 말할 수 있으면 1회 칸, 내일 아침에 한 번 더 보면 2회 칸에 표시합니다. ★ 은 서술형 본문.", "lead"),
             Spacer(1, 2 * mm)]
    for name, rows in PAGES:
        body = [[P(x, "cellS", True) for x in ("쪽", "내용", "꼭 확인할 것", "볼 자료", "1회", "2회")]]
        star = []
        for pg, what, check, mat in rows:
            if what.startswith("★"): star.append(len(body))
            body.append([P(pg, "cell", True), P(what, "cellS"), P(check, "jaS"), P(mat, "cellS"),
                         P("" if mat == "—" else BOX, "big"), P("" if mat == "—" else BOX, "big")])
        story += [KeepTogether([P(name, "sec", True), Spacer(1, 1 * mm),
                                grid(body, [18 * mm, 30 * mm, BODY - 92 * mm, 24 * mm, 10 * mm, 10 * mm],
                                     extra=[("BACKGROUND", (0, i), (-1, i), PINK) for i in star])]), Spacer(1, 3 * mm)]
    story += [P("지금까지 만든 자료 — 한 번씩 다시 보기", "sec", True), Spacer(1, 1 * mm),
              grid([[P(x, "cellS", True) for x in ("", "자료 (docs/ 아래)", "왜", "다시 봄")]] +
                   [[P(a, "cellS", True), P(b, "cellS"), P(c, "cellS"), P(BOX, "big")] for a, b, c in MATERIALS],
                   [12 * mm, 92 * mm, BODY - 118 * mm, 14 * mm]),
              Spacer(1, 2 * mm),
              P("범위 밖이라 넣지 않은 것: 6과 108~110쪽(사진 미수령, 문화로 보임 — 문화는 출제 안 함) · 회화 3과 57쪽 · 4과 62~71쪽(Topic 1). "
                "범위표가 '3과~4과'로만 적혀 있어 3과 54~56쪽은 보험으로 요약해 두었습니다.", "note")]
    doc(os.path.join(OUT, "0-최종복습-계획표.pdf"), "최종 복습 계획표", story)

# ─────────────────────────── 6. 범위 전체 요점정리 ───────────────────────────
UNITS = [("unit6-all.json", "6과 ハナちゃん、あぶない!"), ("unit3-all.json", "회화 3과 いつに しますか"), ("unit4-all.json", "회화 4과 どうやって いくの?")]
NUM = re.compile(r"^[①-⑳]")

def summary():
    story = [P("범위 전체 요점정리", "title", True),
             P("시험 범위의 모든 쪽을 순서대로 한 번에 다시 보는 자료입니다. 일본어 줄 밑의 작은 글씨는 한자 읽기, "
               "'확인' 줄은 그 쪽에서 꼭 나오는 포인트입니다. 해석을 손으로 가리고 뜻을 말해 보세요.", "lead"), Spacer(1, 3 * mm)]
    for fn, uname in UNITS:
        d = json.load(open(os.path.join(ROOT, "docs", "scripts", fn), encoding="utf-8"))
        story.append(P(uname, "title", True))
        last = None
        for s in d["sections"]:
            pg = s.get("page")
            head = "%s쪽 · %s" % (pg, s.get("task", "")) + ("  (음성 전용)" if s.get("audio_only") else "")
            block = [P(head, "sec", True)]
            if pg != last and pg in CHECK:
                block.append(Paragraph(mix("확인: " + CHECK[pg]), S["note"]))
            last = pg
            seen, rows = set(), []
            for it in s.get("items", []):
                for spk, ja, ko in it.get("lines", []):
                    ja0 = NUM.sub("", ja)
                    if not ja0.strip() or ja0 in seen: continue
                    seen.add(ja0)
                    read = kana(ja0)
                    cell = mix(plain(ja0)) + (('<br/><font size="7.5" color="#8A918D">%s</font>' % mix(read)) if read != plain(ja0) else "")
                    rows.append([P(spk or "", "cellS"), Paragraph(cell, S["jaS"]), P(ko, "cellS")])
            if rows:
                block += [Spacer(1, 1 * mm), grid(rows, [16 * mm, 92 * mm, BODY - 108 * mm], head=False)]
            if s.get("words"):
                ws = " · ".join("%s %s" % (kana(a), b) for a, b in s["words"])
                block += [Spacer(1, 1 * mm), Paragraph(mix("어휘: " + ws), S["note"])]
            story += [KeepTogether(block[:3]) if len(block) > 3 else KeepTogether(block)] + block[3:] + [Spacer(1, 4 * mm)]
        story.append(PageBreak())
    doc(os.path.join(OUT, "6-범위전체-요점정리.pdf"), "범위 전체 요점정리", story[:-1])

# ─────────────────────────── 7. 단어 셀프테스트 ───────────────────────────
NODE = r"""
const vm = require("vm"); const src = require("fs").readFileSync(0, "utf8");
const m = { exports: {} }; vm.runInNewContext(src, { module: m, exports: m.exports, console }); const E = m.exports;
const w = E.WORDS.filter(x => !x.skip && !x.ref).map(x => ({ u: x.unit, word: x.word, kana: x.kana, m: x.meaning.join(", "), note: x.note || "", pron: E.pron(x.kana) }));
process.stdout.write(JSON.stringify({ units: E.UNITS, w }));
"""

def words():
    eng = subprocess.check_output(["python3", os.path.join(ROOT, "tools", "extract-engine.py")])
    return json.loads(subprocess.run(["node", "-e", NODE], input=eng, capture_output=True, check=True).stdout)

def selftest():
    d = words()
    story = [P("단어 셀프테스트 — 뜻 보고 쓰기", "title", True),
             P("앱 단어장 %d개 전부입니다. 일본어로 쓰고(가타카나 낱말은 가타카나로) 뒷장 정답으로 채점하세요. "
               "틀린 번호는 동그라미 → 단어장-발음 PDF에서 확인 → 3번 쓰기." % len(d["w"]), "lead"), Spacer(1, 2 * mm)]
    ans = [PageBreak(), P("정답", "title", True), Spacer(1, 2 * mm)]
    n = 0
    half = (BODY - 4 * mm) / 2
    for u in d["units"]:
        ws = [x for x in d["w"] if x["u"] == u["code"]]
        rows, arows = [], []
        for x in ws:
            n += 1
            rows.append([P(str(n), "cellS"), P(x["m"], "cellS"), ""])
            shown = x["kana"] + ("" if x["word"] == x["kana"] else "  (%s)" % x["word"])
            arows.append([P(str(n), "cellS"), P(shown, "jaS"), P(x["m"] + ((" · " + x["note"]) if x["note"] else ""), "cellS")])
        k = (len(rows) + 1) // 2
        def two(rs, w):
            left, right = rs[:k], rs[k:] + [["", "", ""]] * (k - len(rs[k:]))
            return grid([a + [""] + b for a, b in zip(left, right)], w + [4 * mm] + w, head=False,
                        extra=[("GRID", (3, 0), (3, -1), 0, colors.white), ("LINEBEFORE", (3, 0), (3, -1), 0, colors.white),
                               ("LINEAFTER", (3, 0), (3, -1), 0, colors.white), ("TOPPADDING", (0, 0), (-1, -1), 4),
                               ("BOTTOMPADDING", (0, 0), (-1, -1), 4)])
        title = "%s · %s (%d개)" % (u["pages"], u["title"], len(ws))
        story += [P(title, "sec", True), Spacer(1, 1 * mm), two(rows, [8 * mm, 34 * mm, half - 42 * mm]), Spacer(1, 4 * mm)]
        ans += [P(title, "sec", True), Spacer(1, 1 * mm), two(arows, [8 * mm, half * 0.52, half * 0.48 - 8 * mm]), Spacer(1, 3 * mm)]
    doc(os.path.join(OUT, "7-단어-셀프테스트.pdf"), "단어 셀프테스트", story + ans)
    return n

# ─────────────────────────── 8. 내 약한 단어 ───────────────────────────
def example(k, word):
    """교과서 지문에서 이 낱말이 나온 첫 문장 (쪽, 문장, 해석)"""
    keys = [x for x in {k, word} if x]
    for fn, _ in UNITS:
        for s in json.load(open(os.path.join(ROOT, "docs", "scripts", fn), encoding="utf-8"))["sections"]:
            for it in s.get("items", []):
                for spk, ja, ko in it.get("lines", []):
                    ja0 = NUM.sub("", ja)
                    if len(ja0) > len(k) + 1 and any(x in kana(ja0) or x in plain(ja0) for x in keys):
                        return s["page"], plain(ja0), ko
    return None

def weak():
    d = json.load(open(os.path.join(OUT, "weak-words.json"), encoding="utf-8"))
    ws = d["words"]
    fix = [w for w in ws if w.get("wrong")]
    story = [P("내 약한 단어 %d개 — 집중 암기" % len(ws), "title", True),
             P("직접 고른 숙지 안 된 단어입니다. ① 노트에서 고칠 철자 → ② 단어 카드(발음·기억법·교과서 문장) → ③ 셀프테스트 3회 순서로 보세요. "
               "같은 단어로 만든 철자 고르기 20문항(내-약한단어-20문항.pdf · 출제실)도 있습니다.", "lead"), Spacer(1, 3 * mm),
             P("① 노트에서 고칠 것 %d개 — 이대로 쓰면 오답" % len(fix), "sec", True), Spacer(1, 1 * mm),
             grid([[P(x, "cellS", True) for x in ("뜻", "노트에 쓴 것", "맞는 철자", "기억법")]] +
                  [[P(w["m"], "cellS"), P(w["wrong"] + " (X)", "jaS"), P(w["kana"], "ja", True), P(w["tip"], "cellS")] for w in fix],
                  [26 * mm, 34 * mm, 36 * mm, BODY - 96 * mm], extra=[("TEXTCOLOR", (1, 1), (1, -1), sd.SHU)]),
             Spacer(1, 4 * mm), P("② 단어 카드", "sec", True), Spacer(1, 1 * mm)]
    rows = [[P(x, "cellS", True) for x in ("", "뜻", "일본어 · 발음", "기억법 · 교과서 문장")]]
    pink = []
    for i, w in enumerate(ws, 1):
        if w.get("wrong"): pink.append(i)
        jp = w["kana"] + (("  (%s)" % w["word"]) if w.get("word") else "")
        ex = example(w["kana"], w.get("word"))
        tip = w["tip"] + ((" · " + w["note"]) if w.get("note") and w["note"] not in w["tip"] else "")
        cell = mix(tip) + (('<br/><font size="7.5" color="#4A524F">%s쪽 %s — %s</font>' % (ex[0], mix(ex[1]), mix(ex[2]))) if ex else "")
        rows.append([P(str(i), "cellS"), P(w["m"], "cellS"),
                     Paragraph(mix(jp) + '<br/><font size="7.5" color="#8A918D">%s</font>' % mix(w["pron"]), S["ja"]),
                     Paragraph(cell, S["cellS"])])
    story += [grid(rows, [8 * mm, 28 * mm, 50 * mm, BODY - 86 * mm], extra=[("BACKGROUND", (0, i), (-1, i), PINK) for i in pink])]
    order = list(range(len(ws)))
    import random; random.Random(1008).shuffle(order)
    test = [[P(x, "cellS", True) for x in ("", "뜻", "1회", "2회", "3회")]] + \
           [[P(str(n), "cellS"), P(ws[i]["m"], "cellS"), "", "", ""] for n, i in enumerate(order, 1)]
    key = []
    half = (len(order) + 1) // 2
    for n in range(half):
        r = []
        for j in (n, n + half):
            if j < len(order):
                w = ws[order[j]]
                r += [P(str(j + 1), "cellS"), P(w["m"], "cellS"), P(w["kana"], "jaS")]
            else:
                r += ["", "", ""]
        key.append(r)
    hw = BODY / 2
    story += [PageBreak(), P("③ 셀프테스트 — 뜻 보고 쓰기 3회", "title", True),
              P("카드와 순서를 섞었습니다. 1회 쓰고 채점 → 틀린 것만 2회 → 3회. 가타카나 낱말은 가타카나로, 장음·작은 글자·탁점까지 정확히.", "lead"),
              Spacer(1, 2 * mm),
              grid(test, [8 * mm, 34 * mm] + [(BODY - 42 * mm) / 3] * 3, extra=[("TOPPADDING", (0, 1), (-1, -1), 5), ("BOTTOMPADDING", (0, 1), (-1, -1), 5)]),
              PageBreak(), P("셀프테스트 정답", "title", True), Spacer(1, 2 * mm),
              grid([[P(x, "cellS", True) for x in ("", "뜻", "정답")] * 2] + key,
                   [8 * mm, 30 * mm, hw - 38 * mm] * 2)]
    doc(os.path.join(OUT, "8-내-약한단어.pdf"), "내 약한 단어", story)
    return len(ws)

# ─────────────────────────── 통합본 ───────────────────────────
MERGE = [  # (책갈피, docs/ 아래 경로) — 계획표의 순서
 ("0. 최종 복습 계획표", "study/0-최종복습-계획표.pdf"),
 ("★ 내 약한 단어 51개", "study/8-내-약한단어.pdf"),
 ("★ 내 약한 단어 20문항", "sets/내-약한단어-20문항.pdf"),
 ("1. 범위 전체 요점정리", "study/6-범위전체-요점정리.pdf"),
 ("2. 단어장 (발음)", "2026-일본어회화-2학기1회고사-단어장-발음.pdf"),
 ("3. 단어 셀프테스트", "study/7-단어-셀프테스트.pdf"),
 ("4. 동사 활용표", "study/2-동사활용표.pdf"),
 ("5. 음편 て형 10문항 1회", "sets/음편-て형-10문항.pdf"),
 ("6. 음편 て형 10문항 2회", "sets/음편-て형-10문항-2회.pdf"),
 ("7. 본문 서술형 쓰기 연습", "study/1-본문-서술형-쓰기연습.pdf"),
 ("8. 6과 전체 지문", "scripts/6과-전체지문.pdf"),
 ("9. 회화 3·4과 전체 지문", "scripts/회화-3·4과-전체지문.pdf"),
 ("10. 자주 틀리는 유형 10문항", "study/4-자주틀리는유형-보충10문항.pdf"),
] + [("%d. 변형문제 %d회" % (7 + i, i), "sets/변형문제-%d회.pdf" % i) for i in range(4, 9)] + [
 ("16. 시험 직전 함정 체크", "study/3-시험직전-함정체크.pdf"),
 ("17. (보험) 회화 3과 54~56쪽 요약", "study/5-회화3과-54~56쪽-요약.pdf"),
]

def merge():
    from pypdf import PdfWriter
    w = PdfWriter()
    for title, rel in MERGE:
        w.append(os.path.join(ROOT, "docs", rel), outline_item=title)
    w.add_metadata({"/Title": "일본어회화 2학기 1회고사 최종 복습 통합본"})
    w.page_mode = "/UseOutlines"
    out = os.path.join(OUT, "최종복습-통합본.pdf")
    with open(out, "wb") as f: w.write(f)
    print(os.path.relpath(out, ROOT), len(w.pages), "쪽")

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    plan(); summary(); print("단어", selftest()); print("약한 단어", weak()); merge()
