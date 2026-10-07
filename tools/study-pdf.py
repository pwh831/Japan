# -*- coding: utf-8 -*-
"""시험 직전 학습 자료 PDF — docs/study/

    FONT_DIR=... python3 tools/study-pdf.py

1. 본문 서술형 쓰기 연습   — 6과 104·106쪽, 회화 3과 59쪽, 4과 73쪽 본문을 우리말만 보고 일본어로 쓰기 (정답은 뒷장)
2. 동사 활용표 한 장       — 범위 안 동사 전부의 종류·ます·たい·て형, い형용사 (앱 엔진으로 계산: tools/extract-engine.py)
3. 시험 직전 함정 체크리스트
5. 회화 3과 54~56쪽 요약    — 범위표의 "3과~4과"가 넓을 때를 대비한 보험
본문은 docs/scripts/unit*-all.json 에서 그대로 가져온다. 글자마다 글꼴을 고르는 mix() 는 sets-pdf.py 와 같다.
"""
import importlib.util, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location("sp", os.path.join(ROOT, "tools", "sets-pdf.py"))
sp = importlib.util.module_from_spec(spec); spec.loader.exec_module(sp)
mix, esc = sp.mix, sp.esc

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle,
                                KeepTogether, PageBreak)

OUT = os.path.join(ROOT, "docs", "study")
INK, SOFT, FAINT, RULE, SHU = sp.INK, sp.SOFT, sp.FAINT, sp.RULE, sp.SHU
LINE, TINT, PINK = sp.LINE, colors.HexColor("#EEF3F1"), colors.HexColor("#FBECE8")
W, H = A4
M = 15 * mm
BODY = W - 2 * M

def st(name, size, lead, color=INK, **kw):
    return ParagraphStyle(name, fontName="KO", fontSize=size, leading=lead, textColor=color, **kw)
S = {"title": st("t", 16, 22), "lead": st("l", 9, 13, SOFT), "sec": st("s", 11.5, 16, RULE),
     "cell": st("c", 9.5, 13), "cellS": st("cs", 8.3, 11, SOFT), "ja": st("j", 11, 15.5), "jaS": st("js", 9.5, 13),
     "ko": st("k", 10, 14), "note": st("n", 8.5, 12, SOFT), "big": st("b", 10.5, 15)}

def P(t, s="cell", bold=False):
    return Paragraph(mix(t, bold=bold), S[s])

def doc(path, title, story):
    d = BaseDocTemplate(path, pagesize=A4, leftMargin=M, rightMargin=M, topMargin=M, bottomMargin=M + 3 * mm,
                        title=title, author="일본어 시험 대비")
    def on_page(c, dd):
        c.saveState(); c.setFont("KO", 7.5); c.setFillColor(FAINT)
        c.drawString(M, 9 * mm, title); c.drawRightString(W - M, 9 * mm, "%d" % dd.page); c.restoreState()
    d.addPageTemplates([PageTemplate(id="p", frames=[Frame(M, M + 3 * mm, BODY, H - 2 * M - 3 * mm, id="f",
                        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)], onPage=on_page)])
    d.build(story); print(os.path.relpath(path, ROOT))

def grid(rows, widths, head=True, zebra=False, extra=()):
    t = Table(rows, colWidths=widths, repeatRows=1 if head else 0)
    sty = [("GRID", (0, 0), (-1, -1), 0.4, LINE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
           ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4),
           ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]
    if head: sty.append(("BACKGROUND", (0, 0), (-1, 0), TINT))
    t.setStyle(TableStyle(sty + list(extra)))
    return t

RUBY = re.compile(r"([0-9]*[㐀-鿿々]+)\{([^}]+)\}")
kana = lambda s: RUBY.sub(lambda m: m.group(2), s)
plain = lambda s: RUBY.sub(lambda m: m.group(1), s)
NUMS = re.compile(r"^[①-⑳]")

# ─────────────────────────── 1. 본문 서술형 쓰기 ───────────────────────────
POINTS = [  # (정규식, 포인트) — 답 확인할 때 같이 본다
    (r"きを つけて", "★ 반드시 출제: きを つけて(つける 2류 → つけて)"), (r"ませんか", "권유 ～ませんか"),
    (r"ましょう", "～ましょう(~합시다)"), (r"たい", "희망 ～たい"), (r"て いる|で いる", "～て いる(~하고 있다/~어 있다)"),
    (r"より.*ほうが", "Aより Bの ほうが(비교)"), (r"だから", "명사＋だから(이유)"), (r"(?<![れ])から", "から: 이유 / 출발·기점·시작"),
    (r"どこか", "どこか(어딘가) ↔ どこが"), (r"どこが", "どこが(어디가) ↔ どこか"), (r"どうやって", "どうやって(방법)"),
    (r"のりかえる", "～に のりかえる(~로 갈아타다, 2류)"), (r"はいります", "はいる 예외 1류 → はいります"),
    (r"行{い}って|いって", "いく의 て형 예외 → いって"), (r"バスで|こえで", "で: 수단·방법(~로)"), (r"には", "～には(~에는)"),
    (r"よびます|よびませんか", "よぶ 1류 → よびます"), (r"ぜんぜん", "ぜんぜん＋부정"), (r"こわく", "い형용사 부정 こわく ない"),
    (r"けど", "～けど(~지만)"), (r"かなあ", "～かなあ(~일까?)"), (r"20日", "20日 = はつか"), (r"17日", "17日 = じゅうしちにち"),
    (r"下{した}の なまえ", "下の なまえ = (성이 아닌) 이름"), (r"の したに", "～の したに(~의 밑에)"), (r"や ", "～や(~이나, ~랑)"),
]
def points(ja):
    seen, out = set(), []
    for rx, p in POINTS:
        if re.search(rx, ja) and p not in seen:
            seen.add(p); out.append(p)
    return out[:3]

def honmun():
    secs = []
    def take(fn, pages):
        d = json.load(open(os.path.join(ROOT, "docs", "scripts", fn), encoding="utf-8"))
        for s in d["sections"]:
            if s.get("page") in pages and s.get("items") and "본문" in s.get("task", "") + s.get("sub", "") or (
                    s.get("page") in pages and s.get("track") in ("6-08", "6-09")):
                lines = [ln for it in s["items"] for ln in it.get("lines", []) if ln[1] and kana(ln[1]).strip(" ①②③④⑤⑥⑦⑧⑨⑩") not in ("うん!", "うん。")]
                secs.append((s["page"], s["task"], lines))
    take("unit6-all.json", ("104", "106"))
    take("unit3-all.json", ("59",))
    take("unit4-all.json", ("73",))
    names = {"104": "6과 104쪽 · 읽고 쓰기 1", "106": "6과 106쪽 · 읽고 쓰기 2", "59": "회화 3과 59쪽 · きいて はなそう 2", "73": "회화 4과 73쪽 · きいて はなそう 2"}
    story = [P("본문 서술형 쓰기 연습", "title", True),
             P("서술형 30점은 본문에서 나옵니다(선생님 안내: 6과 104·106쪽, 회화 3과 59쪽, 4과 73쪽). 우리말만 보고 일본어로 써 보세요. "
               "조사 하나도 1점, 한자가 틀리면 오답이니 자신 없는 한자는 가나로 씁니다. 정답과 포인트는 뒷장에 있습니다.", "lead"), Spacer(1, 4 * mm)]
    ans = [PageBreak(), P("정답 · 포인트", "title", True), Spacer(1, 3 * mm)]
    n = 0
    for page, task, lines in secs:
        rows, arows = [[P("번호", "cellS"), P("말한 사람", "cellS"), P("우리말", "cellS"), P("일본어로 쓰기", "cellS")]], \
                      [[P("번호", "cellS"), P("교과서 본문", "cellS"), P("포인트", "cellS")]]
        for spk, ja, ko in lines:
            n += 1
            ja0 = NUMS.sub("", ja)
            rows.append([P(str(n)), P(spk or "", "cellS"), P(ko, "ko"), ""])
            read = kana(ja0)
            txt = plain(ja0) + (("\n" + read) if read != plain(ja0) else "")
            arows.append([P(str(n)), Paragraph(mix(plain(ja0)) + (('<br/><font size="8" color="#8A918D">%s</font>' % mix(read)) if read != plain(ja0) else ""), S["ja"]),
                          P(" · ".join(points(ja0)), "cellS")])
        story += [P(names[page], "sec", True), Spacer(1, 1.5 * mm),
                  grid(rows, [10 * mm, 16 * mm, 72 * mm, BODY - 98 * mm], extra=[("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white]),
                       ("BOTTOMPADDING", (0, 1), (-1, -1), 10), ("TOPPADDING", (0, 1), (-1, -1), 10)]), Spacer(1, 5 * mm)]
        ans += [P(names[page], "sec", True), Spacer(1, 1.5 * mm), grid(arows, [10 * mm, 98 * mm, BODY - 108 * mm]), Spacer(1, 4 * mm)]
    doc(os.path.join(OUT, "1-본문-서술형-쓰기연습.pdf"), "본문 서술형 쓰기 연습", story + ans)
    return n

# ─────────────────────────── 2. 동사 활용표 ───────────────────────────
TE_RULE = {"う": "う→って", "つ": "つ→って", "る": "る→って", "ぬ": "ぬ→んで", "む": "む→んで", "ぶ": "ぶ→んで",
           "く": "く→いて", "ぐ": "ぐ→いで", "す": "す→して"}
def conj_table():
    c = json.load(open(sys.argv[1] if len(sys.argv) > 1 else os.path.join(OUT, "conj.json"), encoding="utf-8"))
    head = [P(x, "cellS", True) for x in ("기본형", "뜻", "ます형", "たい형", "て형", "て형 규칙")]
    rows, red = [head], []
    groups = [("1류 (어미 [u]단 → [i]단 + ます·たい)", [v for v in c["v"] if v["g"] == 1 and not v["tricky"] and not v["teIrreg"]]),
              ("1류 예외 ★ — る로 끝나지만 1류 / いく의 て형", [v for v in c["v"] if v["g"] == 1 and (v["tricky"] or v["teIrreg"])]),
              ("2류 (る 떼고 + ます·たい·て)", [v for v in c["v"] if v["g"] == 2]),
              ("3류 (불규칙)", [v for v in c["v"] if v["g"] == 3])]
    span = []
    for name, vs in groups:
        span.append(len(rows)); rows.append([P(name, "cellS", True), "", "", "", "", ""])
        for v in sorted(vs, key=lambda v: (v["kana"][-1], v["kana"])):
            rule = "예외: いって" if v["teIrreg"] else ("る→って (예외 1류)" if v["tricky"] else TE_RULE.get(v["kana"][-1], "") if v["g"] == 1 else ("る 떼고 て" if v["g"] == 2 else "불규칙"))
            if v["tricky"] or v["teIrreg"]: red.append(len(rows))
            rows.append([P(v["kana"] + ("" if v["word"] == v["kana"] else " (%s)" % v["word"])), P(v["m"], "cellS"),
                         P(v["masu"]), P(v["tai"]), P(v["te"]), P(rule, "cellS")])
    extra = [("SPAN", (0, i), (-1, i)) for i in span] + [("BACKGROUND", (0, i), (-1, i), TINT) for i in span] + \
            [("BACKGROUND", (0, i), (-1, i), PINK) for i in red] + [("TOPPADDING", (0, 0), (-1, -1), 1.6), ("BOTTOMPADDING", (0, 0), (-1, -1), 1.6)]
    t = grid(rows, [34 * mm, 26 * mm, 32 * mm, 30 * mm, 30 * mm, BODY - 152 * mm], extra=extra)
    adj = [[P(x, "cellS", True) for x in ("い형용사", "뜻", "부정 (~지 않다)", "연결 (~하고)", "과거 (~했다)")]]
    redA = []
    for a in c["a"]:
        if a["irr"]: redA.append(len(adj))
        adj.append([P(a["kana"]), P(a["m"], "cellS"), P(a["neg"]), P(a["te"]), P(a["past"])])
    ta = grid(adj, [30 * mm, 26 * mm, 42 * mm, 40 * mm, BODY - 138 * mm], extra=[("BACKGROUND", (0, i), (-1, i), PINK) for i in redA])
    story = [P("동사 활용표 — 이번 범위 동사 전부", "title", True),
             P("단답형 '구분 + 활용'(4문항 × 4점)과 객관식 동사 문항 대비. 분홍 줄이 예외입니다. 모든 활용형은 일본어 시험 앱의 활용 엔진으로 계산했습니다.", "lead"),
             Spacer(1, 2 * mm),
             P("구분법: る로 끝나고 る 앞이 [i]·[e]단이면 2류(みる·たべる) — 단 かえる·はいる는 예외 1류. する·くる(べんきょうする)는 3류. 나머지는 1류.  "
               "음편(て형): う·つ·る→って / ぬ·む·ぶ→んで / く→いて / ぐ→いで / す→して / いく만 いって.", "note"),
             Spacer(1, 2 * mm), t, Spacer(1, 4 * mm), P("い형용사 — いい는 よくない·よくて·よかった (いくない X)", "sec", True), Spacer(1, 1.5 * mm), ta]
    doc(os.path.join(OUT, "2-동사활용표.pdf"), "동사 활용표", story)

# ─────────────────────────── 3. 함정 체크리스트 ───────────────────────────
TRAPS = [
 ("날짜·월 읽기 (한 글자 차이 선지 단골)", [
   ("7月 20日", "しちがつ はつか", "なながつ(X) · はっか(X)(つ는 크게) · にじゅうにち(X)"),
   ("7月 17日", "しちがつ じゅうしちにち", "じゅうしちか(X) · じゅしちにち(X)"),
   ("4月 / 1日", "しがつ / ついたち", "よんがつ(X) · いちにち(X)"),
   ("고유 읽기", "1~10일·14일·20일·24일", "ついたち·ふつか…とおか·じゅうよっか·はつか·にじゅうよっか")]),
 ("가타카나 · 장음 (가타카나 어휘를 히라가나로 쓰면 오답)", [
   ("테마파크 / 방재 센터", "テーマパーク / ぼうさいセンター", "ー 두 개 · ぼうさい는 히라가나"),
   ("쇼 / 놀이기구", "ショー / アトラクション", "ショ(작은 ョ)＋ー"),
   ("택시 / 오케이 / 버스", "タクシー / オッケー / バス", "작은 ッ · 장음 ー"),
   ("케이크 / 농구 / 문", "ケーキ / バスケ / ドア", "")]),
 ("헷갈리는 짝", [
   ("어딘가 vs 어디가", "どこか いく? / どこが いい?", "정해지지 않은 곳 か, 고르는 대상 が"),
   ("から 이유 vs 출발", "ぼうさいの ひだから / えきから", "명사＋だから = 이니까, 장소＋から = 에서"),
   ("で 수단 vs 장소", "バスで いく / うみで あそぶ", "~로 / ~에서"),
   ("に 목적·장소·대상", "かいものに いく / でんしゃに のりかえる / あれに のる", "~하러 / ~로 갈아타다 / ~을 타다(を X)"),
   ("これから vs それから", "これからは みんな… / それから、ひを けします", "이제부터 / 그리고"),
   ("いく vs くる", "どうやって いくの? / くるの?", "가다 / 오다"),
   ("비교", "Aと Bと どちらが ~ですか → Aの ほうが ~です", "Aより Bの ほうが (A보다 B 쪽이)")]),
 ("활용 함정", [
   ("예외 1류", "かえる → かえります·かえりたい·かえって", "かえます(X) · はいる도 같다"),
   ("いく의 て형", "いって", "いいて(X)"),
   ("3류", "くる → きます·きたい·きて / する → します·したい·して", "くります(X) · くって(X)"),
   ("2류 て형", "みる → みて · でる → でて · つける → つけて", "みって(X)"),
   ("い형용사 부정", "こわい → こわく ない · むずかしく ない", "こわいく ない(X) · いい → よく ない"),
   ("ます 앞", "けす → けします · よぶ → よびます · はいる → はいります", "けすます(X)"),
   ("★ 반드시 출제", "きを つけて! (조심해!)", "つけで(X) · つげて(X)")]),
 ("서답형 채점 기준 (선생님 안내)", [
   ("부분 점수", "아는 낱말·조사는 전부 쓴다", "조사 하나도 1점 — 비워 두지 않기"),
   ("한자", "히라가나·가타카나·한자 다 가능", "한자가 틀리면 오답 → 자신 없으면 가나로"),
   ("단답형 구분+활용", "예: ある(있다) → 1류, あって", "구분 2점 + 활용 2점 — 둘 다 쓰기"),
   ("서술형", "본문 문장 그대로", "6과 104·106쪽 · 3과 59쪽 · 4과 73쪽")]),
 ("기출 형식 (북일고 일본어 회화)", [
   ("묶음 지문", "[n~m] 다음 글을 읽고…", "지문 속 ㉠에 우리말 → 일본어 고르기·쓰기"),
   ("순서대로 연결", "㉠,㉡ — 철자 바꾼 짝", "さんか-いっしょ / さんが-いつしょ 식으로 한 글자씩 비교"),
   ("<보기> 고르기", "ⓐ~ⓓ 조합", "하나씩 O/X 표시 후 조합 고르기"),
   ("알맞지 않은 것", "발문 끝까지 읽기", "'않은'에 동그라미")]),
]
def checklist():
    story = [P("시험 직전 함정 체크리스트", "title", True), P("한 글자 차이로 갈리는 것만 모았습니다. 시험 직전 10분에 훑어보세요.", "lead"), Spacer(1, 3 * mm)]
    for name, items in TRAPS:
        rows = [[P(a, "cellS", True), P(b, "jaS"), P(c, "cellS")] for a, b, c in items]
        story.append(KeepTogether([P(name, "sec", True), Spacer(1, 1 * mm),
                                   grid(rows, [34 * mm, 78 * mm, BODY - 112 * mm], head=False), Spacer(1, 3.5 * mm)]))
    doc(os.path.join(OUT, "3-시험직전-함정체크.pdf"), "시험 직전 함정 체크리스트", story)

# ─────────────────────────── 5. 회화 3과 54~56쪽 ───────────────────────────
def kaiwa3_topic1():
    days = [("月", "げつようび", "월요일"), ("火", "かようび", "화요일"), ("水", "すいようび", "수요일"), ("木", "もくようび", "목요일"),
            ("金", "きんようび", "금요일"), ("土", "どようび", "토요일"), ("日", "にちようび", "일요일")]
    dlg = [("れん", "つぎは いつに しますか。", "다음은 언제로 할까요?"), ("ユミ", "わたしは 金ようびが いいです。", "저는 금요일이 좋아요."),
           ("ユミ", "金ようびの 6時は どうですか。", "금요일 6시는 어때요?"), ("はるな", "あ、すみません。", "아, 미안해요."),
           ("はるな", "わたし、金ようびは ちょっと……。", "저, 금요일은 좀……."), ("はるな", "バイトが あります。", "아르바이트가 있어요."),
           ("ノア", "日本の 高校生も バイト できますか。", "일본 고등학생도 아르바이트 할 수 있어요?"),
           ("はるな", "はい、できますよ。うちの 高校は。", "네, 할 수 있어요. 우리 고등학교는."), ("ユミ", "そうですか。", "그래요?"),
           ("ユミ", "じゃ、いつに しましょうか。", "그럼 언제로 할까요?"), ("はるな", "水ようびなら だいじょうぶですが……。", "수요일이라면 괜찮은데요……."),
           ("ユミ", "じゃ、水ようびの 6時に しましょう。", "그럼 수요일 6시로 합시다."), ("れん", "はーい。", "네~."), ("ノア", "いいですよ。", "좋아요.")]
    expr = [("선택", "つぎは いつに しますか。 — わたしは 金ようびが いいです。", "~に しますか = ~(으)로 할까요?"),
            ("제안", "金ようびの 6時は どうですか。 — いいですね。/ すみません。金ようびは ちょっと……。", "~は どうですか = ~은/는 어떠세요? · ちょっと…… = 거절"),
            ("승낙", "水ようびなら だいじょうぶですが……。 — じゃ、水ようびの 6時に しましょう。", "~なら = ~(이)라면 · ~に しましょう = ~(으)로 합시다"),
            ("もう すこし", "水ようびの 6時に しましょうか。 — はい、そうしましょう。", "~ましょうか = ~할까요?")]
    masu = [("1류", "行く", "行きます", "行きません"), ("2류", "見る", "見ます", "見ません"), ("3류", "する", "します", "しません"), ("3류", "来る", "来ます", "来ません")]
    story = [P("회화 3과 54~56쪽 요약 — 범위 보험", "title", True),
             P("학교 범위표는 '일본어회화 3과~4과'로만 적혀 있습니다. 선생님 안내(3과 58~61쪽)보다 넓을 경우를 대비해, 받은 사진(54~56쪽)의 핵심만 정리했습니다. 57쪽은 사진이 없어 빠졌습니다.", "lead"),
             Spacer(1, 3 * mm), P("요일 (54쪽)", "sec", True), Spacer(1, 1 * mm),
             grid([[P(a, "jaS") for a, b, c in days], [P(b, "jaS") for a, b, c in days], [P(c, "cellS") for a, b, c in days]], [BODY / 7] * 7, head=False),
             P("にちようびは どうですか。 — いいですね。 (일요일은 어때요? — 좋네요.)", "note"), Spacer(1, 3 * mm),
             P("きいて はなそう 1 — 다음에 언제 만날지 정하기 (55쪽 본문, 음원 3-03)", "sec", True), Spacer(1, 1 * mm),
             grid([[P(s, "cellS"), P(j, "jaS"), P(k, "cellS")] for s, j, k in dlg], [16 * mm, 92 * mm, BODY - 108 * mm], head=False),
             P("Q1 하루나의 학교는 아르바이트를 할 수 있다(はい、できますよ). Q2 수요일 6시에 만나기로 했다.", "note"), Spacer(1, 3 * mm),
             P("かくにん 1 — 핵심 표현 (56쪽)", "sec", True), Spacer(1, 1 * mm),
             grid([[P(a, "cellS", True), P(b, "jaS"), P(c, "cellS")] for a, b, c in expr], [18 * mm, 104 * mm, BODY - 122 * mm], head=False),
             Spacer(1, 3 * mm), P("동사의 ます형 · ません형 (56쪽 표)", "sec", True), Spacer(1, 1 * mm),
             grid([[P(x, "cellS", True) for x in ("종류", "기본형", "~ます (~니다)", "~ません (~지 않습니다)")]] +
                  [[P(a, "cellS"), P(b, "jaS"), P(c, "jaS"), P(d, "jaS")] for a, b, c, d in masu], [20 * mm, 40 * mm, 50 * mm, BODY - 110 * mm]),
             P("'ある'의 ます형은 あります (あます(X)). ～ませんか(~지 않을래요?)·～ました·～ませんでした도 ます형과 같은 방법으로 만든다.", "note"),
             Spacer(1, 2 * mm), P("ことば: つぎ 다음 · いつ 언제 · ちょっと 좀 · バイト 아르바이트 · 高校生(こうこうせい) 고등학생 · できる 할 수 있다(2류) · うち 우리 · そうですか 그래요? · ～なら ~(이)라면 · だいじょうぶ 괜찮다", "note")]
    doc(os.path.join(OUT, "5-회화3과-54~56쪽-요약.pdf"), "회화 3과 54~56쪽 요약", story)

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    print("본문 문장", honmun())
    conj_table(); checklist(); kaiwa3_topic1()
