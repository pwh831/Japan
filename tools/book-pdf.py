# -*- coding: utf-8 -*-
"""GoodNotes 에서 손으로 쓰며 공부하는 학습장 PDF.

앱의 학습 과정(docs/학습원리.md)을 종이로 옮긴 것이다.
  배우기(읽기·따라 쓰기) → 꺼내쓰기 ① 당일 → 정답 확인 → 꺼내쓰기 ② +1~3일 → 꺼내쓰기 ③ +7일
한 번 배운 단어를 같은 쪽에서 세 번 다시 쓰되, 번호는 그대로 두고 순서만 바꿔 위치로 외우지 못하게 한다.

    python3 tools/book-pdf.py [진도쪽 [결과.pdf]] [--from 이전진도] [--start 첫세션번호]

진도(--upto)까지 배운 것만 넣는다. 진도가 나가면 `--from 89` 처럼 이전 진도를 주어 **새로 배운 것만**
담은 다음 권을 만든다 — 이미 손글씨를 쓴 앞 권을 덮어쓰지 않으려는 것이다(세션 번호는 --start 로 이어 간다).

발음·활용형·진도 규칙은 앱과 같은 엔진(tools/extract-engine.py → tools/book-data.js)에서 뽑는다.
글꼴은 tools/fonts 의 ZenKakuGothicNew(일본어)·NanumGothic(한글, 가나가 들어 있는 원본)을 쓴다.
"""
import json, math, os, random, re, subprocess, sys, tempfile

from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.environ.get("FONT_DIR", os.path.join(ROOT, "tools", "fonts"))

HEX = colors.HexColor
INK, SOFT, FAINT, RULE, SHU = HEX("#1B2021"), HEX("#4A524F"), HEX("#79817D"), HEX("#4F8378"), HEX("#C8452B")
LINE, TINT, GUIDE, BOX, WHITE = HEX("#D5DAD7"), HEX("#EEF3F1"), HEX("#B4BBB7"), HEX("#A9B9B3"), HEX("#FFFFFF")
A4 = (210 * mm, 297 * mm)
LAND = (297 * mm, 210 * mm)
M = 13 * mm
HAN = re.compile(r"[가-힣]")
KANJI = re.compile(r"[㐀-鿿々]")
RUBY = re.compile(r"([0-9]*[㐀-鿿々]+)\{([^}]+)\}")

# ── 글꼴 ────────────────────────────────────────────────────────────────
for _n, _f in (("JA", "ZenKakuGothicNew-Regular.ttf"), ("JAB", "ZenKakuGothicNew-Bold.ttf"),
               ("KO", "NanumGothic.ttf"), ("KOB", "NanumGothicBold.ttf")):
    pdfmetrics.registerFont(TTFont(_n, os.path.join(FONTS, _f)))

def glyph_ok(font, s):
    cm = pdfmetrics.getFont(font).face.charToGlyph
    return all(ord(ch) in cm or ch in " \n" for ch in s)

def font_for(s, bold=False):
    """한글이 있으면 나눔고딕(가나도 들어 있다). 아니면 Zen 으로 쓰되 빠진 글자(～ 등)가 있으면 나눔고딕."""
    ja, ko = ("JAB", "KOB") if bold else ("JA", "KO")
    if HAN.search(s):
        return ko, s
    t = s.replace("～", "〜")
    if glyph_ok(ja, t):
        return ja, t
    return ko, s

JRUN = re.compile(r"([\u3000-\u30ff\u3400-\u9fff\uff01-\uff60々]+)")

def segs(s, bold=False):
    """(글꼴, 글자) 덩어리들. 한글이 섞인 줄은 일본어 덩어리만 Zen 으로, 나머지는 나눔고딕으로 쓴다."""
    ja, ko = ("JAB", "KOB") if bold else ("JA", "KO")
    if not HAN.search(s):
        f, t = font_for(s, bold)
        return [(f, t)]
    out = []
    for part in JRUN.split(s):
        if not part:
            continue
        if JRUN.fullmatch(part):
            t = part.replace("\uff5e", "\u301c")
            out.append((ja, t) if glyph_ok(ja, t) else (ko, part))
        else:
            out.append((ko, part))
    return out

def text_w(s, size, bold=False):
    return sum(pdfmetrics.stringWidth(t, f, size) for f, t in segs(s, bold))

def put(c, x, y, s, size, color=INK, bold=False, align="l", maxw=None, minsize=6.0):
    if maxw:
        while text_w(s, size, bold) > maxw and size > minsize:
            size -= 0.25
    c.setFillColor(color)
    w = text_w(s, size, bold)
    if align == "c": x -= w / 2
    elif align == "r": x -= w
    for f, t in segs(s, bold):
        c.setFont(f, size)
        c.drawString(x, y, t)
        x += pdfmetrics.stringWidth(t, f, size)
    return size

def wrap(s, size, maxw, bold=False):
    out, cur = [], ""
    for ch in s:
        if cur and text_w(cur + ch, size, bold) > maxw:
            out.append(cur.rstrip()); cur = ch.lstrip() if ch == " " else ch
        else:
            cur += ch
    if cur.strip(): out.append(cur.rstrip())
    return out

def para(c, x, y, s, size, maxw, lead, color=SOFT, bold=False, maxlines=99, bottom=None):
    """줄바꿈해 적고 마지막 줄 아래 y 를 돌려준다. 자리가 모자라면 …로 줄인다."""
    ls = wrap(s, size, maxw, bold)
    for k, ln in enumerate(ls):
        if k >= maxlines or (bottom is not None and y < bottom):
            break
        if (k == maxlines - 1 or (bottom is not None and y - lead < bottom)) and k < len(ls) - 1:
            ln = ln[:-1] + "…"
        put(c, x, y, ln, size, color, bold)
        y -= lead
    return y

def hline(c, x0, x1, y, color=LINE, w=0.5, dash=None):
    c.setStrokeColor(color); c.setLineWidth(w)
    c.setDash(*dash) if dash else c.setDash()
    c.line(x0, y, x1, y)
    c.setDash()

def write_box(c, x, y, w, h, guide=True):
    c.setStrokeColor(BOX); c.setLineWidth(0.7); c.setDash()
    c.roundRect(x, y, w, h, 1.6 * mm, stroke=1, fill=0)
    if guide:
        for f in ((0.3,) if h < 22 * mm else (0.5, 0.15)):
            hline(c, x + 2 * mm, x + w - 2 * mm, y + h * f, HEX("#DCE3E0"), 0.5, (1.2, 2))

def dot(c, cx, cy, n, r=3.1 * mm, color=RULE):
    c.setStrokeColor(color); c.setLineWidth(0.8); c.setFillColor(WHITE)
    c.circle(cx, cy, r, stroke=1, fill=1)
    put(c, cx, cy - 1.0 * mm, str(n), 8.5, color, True, "c")

def chip(c, x, y, w, h, label, size=7.5, color=SOFT):
    c.setStrokeColor(BOX); c.setLineWidth(0.6); c.setFillColor(WHITE)
    c.roundRect(x, y, w, h, 1.2 * mm, stroke=1, fill=1)
    put(c, x + w / 2, y + h / 2 - size * 0.34, label, size, color, False, "c")

def ko_punct(t):
    return t.replace("、", ", ").replace("。", ". ").replace("  ", " ").strip()

# ── 데이터 ──────────────────────────────────────────────────────────────
def node(*args, stdin=None):
    r = subprocess.run(["node", *args], input=stdin, capture_output=True, check=True)
    return r.stdout.decode("utf-8")

def load(upto, frm):
    eng = subprocess.run([sys.executable, os.path.join(ROOT, "tools", "extract-engine.py")],
                         capture_output=True, check=True).stdout
    tmp = tempfile.mkdtemp(prefix="book-")
    ep = os.path.join(tmp, "engine.js"); open(ep, "wb").write(eng)
    bd = os.path.join(ROOT, "tools", "book-data.js")
    d = json.loads(node(bd, ep, str(upto)))
    for w in d["words"]: w["pron"] = ko_punct(w["pron"])
    for p in d["phrases"]: p["pron"] = ko_punct(p["pron"])
    for a in d["adjs"]:
        a["pron"] = ko_punct(a["pron"])
        for f in a["forms"]: f["pron"] = ko_punct(f["pron"])
    new = lambda x: (x["pg"] or 0) > frm
    d["words"] = [w for w in d["words"] if new(w)]
    d["phrases"] = [p for p in d["phrases"] if new(p)]
    d["adjs"] = [a for a in d["adjs"] if (a["pg"] or 0) > frm and (frm == 0 or not a["always"])]
    # 본문 대화 — 85·89쪽의 줄마다 해석. 서답형이 몰려 있다(선생님 안내)
    dl = []
    tr = json.load(open(os.path.join(ROOT, "docs", "scripts", "unit5-all.json"), encoding="utf-8"))
    for sec in tr["sections"]:
        pg = int(sec["page"])
        if not (sec["task"].startswith("きいて") and frm < pg <= upto):
            continue
        lines = []
        for it in sec["items"]:
            if it.get("no") or not it["lines"]:
                continue
            for spk, ja, ko in it["lines"]:
                m = re.match(r"^([①-⑳])\s*", ja)
                n = ord(m.group(1)) - 0x2460 + 1 if m else len(lines) + 1
                ja = ja[m.end():] if m else ja
                lines.append(dict(n=n, spk=spk, kana=RUBY.sub(r"\2", ja), disp=RUBY.sub(r"\1", ja), ko=ko,
                                  star=(pg == 85 and n == 8)))
        dl.append(dict(pg=pg, lines=lines, sub=sec.get("sub", "")))
    prons = json.loads(node(bd, ep, "--pron", stdin=json.dumps([l["kana"] for x in dl for l in x["lines"]]).encode("utf-8")))
    for x in dl:
        for l in x["lines"]:
            l["pron"] = ko_punct(prons.pop(0))
    d["dialogues"] = dl
    return d

def split_sessions(items, size=10):
    """쪽 순서대로 size 개 안팎으로 자른다. 마지막이 너무 작아지지 않게 고르게 나눈다."""
    if not items:
        return []
    k = math.ceil(len(items) / size)
    base, extra = divmod(len(items), k)
    out, at = [], 0
    for j in range(k):
        n = base + (1 if j < extra else 0)
        out.append(items[at:at + n]); at += n
    return out

def pg_label(items):
    pgs = sorted({x["pg"] for x in items if x.get("pg")})
    if not pgs: return ""
    return "%d쪽" % pgs[0] if len(pgs) == 1 else "%d~%d쪽" % (pgs[0], pgs[-1])

def shuffled(n, seed, avoid=None):
    for k in range(50):
        o = list(range(n)); random.Random(seed * 101 + k).shuffle(o)
        if o != list(range(n)) and (avoid is None or all(a != b for a, b in zip(o, avoid)) or n < 4):
            return o
    return list(reversed(range(n)))

# ── 쪽 틀 ───────────────────────────────────────────────────────────────
class Book:
    def __init__(self, upto, frm):
        self.pages, self.pnum = [], {}
        self.upto, self.frm = upto, frm

    def add(self, key, title, size, draw, sec=None):
        self.pnum[key] = len(self.pages)
        self.pages.append(dict(key=key, title=title, size=size, draw=draw, sec=sec))

    def link(self, c, key, x0, y0, x1, y1):
        c.linkRect("", key, (x0, y0, x1, y1), relative=0, thickness=0)

BOOK = None

def chrome(c, W, H, idx, chipt, title, sub="", instr="", score=None, date=True):
    y = H - M
    cw = max(11 * mm, text_w(chipt, 9, True) + 6 * mm)
    c.setFillColor(RULE); c.roundRect(M, y - 7.2 * mm, cw, 7.2 * mm, 1.6 * mm, stroke=0, fill=1)
    put(c, M + cw / 2, y - 5.1 * mm, chipt, 9, WHITE, True, "c")
    put(c, M + cw + 3 * mm, y - 5.3 * mm, title, 15, INK, True)
    if sub: put(c, M, y - 11.6 * mm, sub, 8.5, SOFT, maxw=W - 2 * M - 62 * mm)
    if instr: put(c, M, y - 16.2 * mm, instr, 8.4, RULE, maxw=W - 2 * M, minsize=6.8)
    rx = W - M
    if date:
        hline(c, rx - 22 * mm, rx, y - 5.6 * mm, BOX, 0.7)
        put(c, rx - 24 * mm, y - 5.2 * mm, "날짜", 8, FAINT, False, "r")
    if score:
        hline(c, rx - 22 * mm, rx - 8 * mm, y - 12.2 * mm, BOX, 0.7)
        put(c, rx - 24 * mm, y - 11.8 * mm, "점수", 8, FAINT, False, "r")
        put(c, rx - 7 * mm, y - 11.8 * mm, "/ %s" % score, 8, FAINT)
    hline(c, M, W - M, y - 19.2 * mm, LINE, 0.8)
    put(c, M, 7 * mm, "일본어 회화 · 2학기 2회고사 학습장 · 진도 %d쪽까지" % BOOK.upto, 7, FAINT)
    put(c, W - M, 7 * mm, "%d / %d" % (idx + 1, len(BOOK.pages)), 7, FAINT, False, "r")
    return y - 22.5 * mm

CIRC = "①②③"
ATT = [("①", "당일 (배운 뒤 조금 있다가)"), ("②", "+1~3일 뒤"), ("③", "+7일 뒤")]
CAUSE = ["가", "촉", "탁", "철", "뜻"]
LEGEND = "원인  가=가나 종류(히라가나↔가타카나) · 촉=촉음·장음·요음 · 탁=탁점 · 철=글자 하나 · 뜻=몰랐음"

# ── 표지 · 사용법 ───────────────────────────────────────────────────────
def d_cover(c, W, H, idx, info):
    put(c, M, H - 34 * mm, "일본어 회화", 13, RULE, True)
    put(c, M, H - 50 * mm, "2학기 2회고사 학습장", 30, INK, True)
    put(c, M, H - 60 * mm, info["range"], 11, SOFT)
    put(c, M, H - 66 * mm, info["count"], 9, FAINT)
    y = H - 84 * mm
    put(c, M, y, "공부 순서 — 같은 내용을 날짜를 벌려서 세 번 보지 않고 씁니다", 11, INK, True)
    steps = [("배우기", "당일", "읽고 따라 쓰기"), ("꺼내쓰기 ①", "당일", "10분 뒤쯤"), ("꺼내쓰기 ②", "+1~3일", "그날 복습"),
             ("꺼내쓰기 ③", "+7일", "한 주 뒤"), ("총복습", "+14일", "틀린 것만")]
    bw = (W - 2 * M - 4 * 3 * mm) / 5
    for k, (a, b, d) in enumerate(steps):
        x = M + k * (bw + 3 * mm)
        c.setStrokeColor(RULE if k < 4 else SHU); c.setLineWidth(1); c.setFillColor(TINT if k < 4 else WHITE)
        c.roundRect(x, y - 30 * mm, bw, 22 * mm, 2 * mm, stroke=1, fill=1)
        put(c, x + bw / 2, y - 15 * mm, a, 9.5, INK, True, "c", maxw=bw - 3 * mm)
        put(c, x + bw / 2, y - 21 * mm, b, 10.5, RULE if k < 4 else SHU, True, "c")
        put(c, x + bw / 2, y - 26 * mm, d, 7.5, SOFT, False, "c", maxw=bw - 3 * mm)
    y -= 44 * mm
    rules = [
        ("쓰기가 공부입니다", "다시 읽기만 하면 아는 느낌만 남습니다. 꺼내쓰기 쪽은 앞 쪽을 보지 않고 뜻만 보고 씁니다."),
        ("확실 / 애매를 꼭 표시", "맞게 썼어도 자신 없었으면 '애매'에 ○. 애매하게 맞힌 것은 맞힌 것으로 세지 않고 다음 날 다시 봅니다."),
        ("정답 쪽에서 원인을 적어요", "틀린 곳을 빨간 펜으로 고치고 원인(가·촉·탁·철·뜻)에 ○. 100점은 '아는데 틀리는 것'에서 갈립니다."),
        ("색깔로 몇 번째인지", "처음 고친 곳 빨강 → 두 번째 파랑 → 세 번째 초록. 색이 겹치는 곳이 내 약점입니다."),
        ("가나는 글자 하나까지", "ロボット와 ニュース 는 가타카나로, 장음(ー)·촉음(っ)·탁점(が, ざ)이 시험에서 가장 많이 틀립니다."),
        ("GoodNotes 에서", "왼쪽 목차(Outline)에서 구역으로 이동합니다. 쪽 위의 '정답 →'은 누르면 이동하고, 안 되면 목차를 쓰세요."),
    ]
    for t, d in rules:
        put(c, M, y, t, 10, RULE, True)
        y = para(c, M + 52 * mm, y, d, 9, W - 2 * M - 52 * mm, 4.6 * mm, SOFT, maxlines=2)
        y -= 4.2 * mm
    y -= 4 * mm
    c.setFillColor(TINT); c.roundRect(M, y - 36 * mm, W - 2 * M, 40 * mm, 2 * mm, stroke=0, fill=1)
    put(c, M + 5 * mm, y - 3 * mm, "하루 예시 — 하루에 세션 하나씩 나갈 때 (10~15분)", 10, INK, True)
    ex = [("새로 배운 날", "S4 배우기 → 10분쯤 뒤 S4 꺼내쓰기 ① → 정답 확인(원인에 ○)"),
          ("같은 날 복습", "S3 꺼내쓰기 ② (어제 배운 것) · S1 꺼내쓰기 ③ (일주일 전 것)"),
          ("진도가 없는 날", "복습만. 달력에서 오늘 날짜에 걸리는 칸을 찾아 그 쪽을 씁니다."),
          ("시험 전 주", "마지막 쪽의 '시험 전 점검'과 실수 노트만. 새로 보지 않습니다.")]
    yy = y - 10 * mm
    for a, b in ex:
        put(c, M + 5 * mm, yy, a, 9, RULE, True)
        put(c, M + 38 * mm, yy, b, 9, SOFT, False, maxw=W - 2 * M - 44 * mm)
        yy -= 6.6 * mm
    put(c, M, 7 * mm, "진도 %d쪽까지 · 단어장(선생님) · 교과서 5과 · 형용사 활용 학습지" % BOOK.upto, 7, FAINT)

# ── 복습 달력 ───────────────────────────────────────────────────────────
def d_calendar(c, W, H, idx, rows):
    top = chrome(c, W, H, idx, "달력", "복습 달력", "배운 날부터 +1~3일, +7일, +14일에 다시 씁니다",
                 "날짜를 적고, 끝낸 칸에는 ◎(확실) 또는 △(애매)를 적으세요. △ 는 다음 칸에서 먼저 다시 봅니다.", date=False)
    cols = ["", "배운 날", "② +1~3일", "③ +7일", "총복습 +14일"]
    x0 = M; lw = 62 * mm; cw = (W - 2 * M - lw) / 4
    c.setFillColor(TINT); c.rect(x0, top - 8 * mm, W - 2 * M, 8 * mm, stroke=0, fill=1)
    for k, h in enumerate(cols[1:]):
        put(c, x0 + lw + k * cw + cw / 2, top - 5.4 * mm, h, 8.5, INK, True, "c")
    rh = min(15.5 * mm, (top - 18 * mm) / max(1, len(rows)))
    y = top - 8 * mm
    for k, (label, sub, key) in enumerate(rows):
        yb = y - rh
        hline(c, M, W - M, yb)
        put(c, x0 + 2 * mm, y - 6 * mm, label, 10, INK, True, maxw=lw - 3 * mm)
        if sub: put(c, x0 + 2 * mm, y - 10.5 * mm, sub, 7.5, FAINT, maxw=lw - 3 * mm)
        BOOK.link(c, key, x0, yb, x0 + lw, y)
        for j in range(4):
            bx = x0 + lw + j * cw
            c.setStrokeColor(BOX); c.setLineWidth(0.6)
            c.roundRect(bx + 2 * mm, yb + 2 * mm, cw - 4 * mm, rh - 4 * mm, 1.4 * mm, stroke=1, fill=0)
            put(c, bx + 3.5 * mm, yb + rh - 6.5 * mm, "월  일", 6.5, GUIDE)
        y = yb
    c.setStrokeColor(LINE); c.setLineWidth(0.5)
    for j in range(5):
        c.line(x0 + lw + j * cw, top - 8 * mm, x0 + lw + j * cw, y)
    put(c, M, y - 7 * mm, "시험일: ______월 ______일      시험 D-7 · D-3 · D-1 에는 마지막 쪽의 '시험 전 점검'과 실수 노트만 봅니다.", 8.5, SOFT)

# ── 목차 ────────────────────────────────────────────────────────────────
def d_toc(c, W, H, idx, secs):
    top = chrome(c, W, H, idx, "목차", "목차", "제목을 누르면 그 쪽으로 이동합니다", date=False)
    y = top - 3 * mm
    for title, key in secs:
        put(c, M + 2 * mm, y, title, 10.5, INK, False, maxw=W - 2 * M - 22 * mm)
        n = BOOK.pnum[key] + 1
        put(c, W - M, y, str(n), 10, RULE, True, "r")
        tw = text_w(title, 10.5)
        c.setStrokeColor(LINE); c.setLineWidth(0.5); c.setDash(1, 2.5)
        if M + 4 * mm + tw < W - M - 10 * mm:
            c.line(M + 4 * mm + tw, y + 0.6 * mm, W - M - 8 * mm, y + 0.6 * mm)
        c.setDash()
        BOOK.link(c, key, M, y - 2 * mm, W - M, y + 5 * mm)
        y -= 7.4 * mm

# ── 단어 세션 ───────────────────────────────────────────────────────────
def d_learn(c, W, H, idx, S):
    its = S["items"]
    top = chrome(c, W, H, idx, "S%d" % S["n"], "배우기", "교과서 %s · 단어 %d개" % (S["pg"], len(its)),
                 "① 소리 내어 읽기   ② 연한 글씨를 따라 쓰기   ③ 뜻을 입으로 말해 보기  →  다음 쪽에서 보지 않고 쓰기")
    n = len(its); rh = min(23.5 * mm, (top - 14 * mm) / n)
    xn, wn = M, 9 * mm
    xj, wj = xn + wn, 58 * mm
    xm, wm = xj + wj, 44 * mm
    xt = xm + wm; wt = W - M - xt
    for k, it in enumerate(its):
        yt = top - k * rh; yb = yt - rh
        hline(c, M, W - M, yb)
        dot(c, xn + 4 * mm, yt - rh / 2, k + 1)
        put(c, xj + 1 * mm, yt - 8.2 * mm, it["word"], 16, INK, False, maxw=wj - 3 * mm, minsize=9)
        y2 = yt - 13 * mm
        if it["kana"] != it["word"]:
            put(c, xj + 1 * mm, y2, it["kana"], 9.5, SOFT, False, maxw=wj - 3 * mm); y2 -= 4.2 * mm
        put(c, xj + 1 * mm, y2, it["pron"], 8, FAINT, False, maxw=wj - 3 * mm)
        yy = para(c, xm + 1 * mm, yt - 6.8 * mm, ", ".join(it["meaning"]), 10.5, wm - 3 * mm, 4.3 * mm, INK, True, maxlines=2)
        if it["note"]:
            para(c, xm + 1 * mm, yy - 0.3 * mm, it["note"], 7.4, wm - 3 * mm, 3.2 * mm, FAINT, False, bottom=yb + 2.2 * mm)
        put(c, xt + 2 * mm, yt - 7.6 * mm, it["kana"], 14, GUIDE, False, maxw=wt - 4 * mm, minsize=8)
        write_box(c, xt, yb + 2.4 * mm, wt - 1 * mm, 9.6 * mm)

def d_retr(c, W, H, idx, S, order, att):
    its = S["items"]
    top = chrome(c, W, H, idx, "S%d" % S["n"], "꺼내쓰기 %s" % ATT[att][0],
                 ATT[att][1] + ("" if att == 0 else " · 번호는 배우기 쪽과 같고 순서만 바뀌었습니다"),
                 "배우기 쪽을 보지 않고 뜻만 보고 쓰세요. 다 쓰면 확실/애매에 ○ 하고 정답 쪽에서 확인.", score=len(its))
    n = len(its); rh = min(22.5 * mm, (top - 12 * mm) / n)
    xn = M; xm = M + 9 * mm; wm = 50 * mm; xw = xm + wm; ww = 104 * mm; xc = xw + ww
    key = "s%d-ans" % S["n"]
    put(c, W - M, top - 3.2 * mm, "정답 →", 8.5, RULE, True, "r")
    BOOK.link(c, key, W - M - 16 * mm, top - 6 * mm, W - M, top)
    top -= 4 * mm
    for k, ix in enumerate(order):
        it = its[ix]
        yt = top - k * rh; yb = yt - rh
        hline(c, M, W - M, yb)
        dot(c, xn + 4 * mm, yt - rh / 2, ix + 1)
        yy = para(c, xm + 1 * mm, yt - rh / 2 + 1.5 * mm, ", ".join(it["meaning"]), 11.5, wm - 3 * mm, 4.8 * mm, INK, True, maxlines=2)
        put(c, xm + 1 * mm, yy - 0.2 * mm, it["pos"], 7.2, GUIDE)
        write_box(c, xw, yb + 2.6 * mm, ww - 2 * mm, rh - 5.2 * mm)
        chip(c, xc + 0.5 * mm, yt - rh / 2 + 0.8 * mm, 10 * mm, 5.2 * mm, "확실", 7)
        chip(c, xc + 0.5 * mm, yt - rh / 2 - 6 * mm, 10 * mm, 5.2 * mm, "애매", 7)

def d_ans(c, W, H, idx, S):
    its = S["items"]
    top = chrome(c, W, H, idx, "S%d" % S["n"], "정답 확인", "꺼내쓰기 ①②③ 공용 · 번호로 찾습니다",
                 "틀린 곳은 빨간 펜으로 고치고, 맞으면 ○ 틀리면 ×. 틀린 이유는 원인에 ○ 하세요.")
    put(c, M, top - 3.4 * mm, LEGEND, 7.4, FAINT, maxw=W - 2 * M)
    top -= 6 * mm
    n = len(its); rh = min(23 * mm, (top - 12 * mm) / n)
    xn = M; xm = M + 9 * mm; wm = 38 * mm; xa = xm + wm; wa = 66 * mm; xr = xa + wa; xcz = xr + 3 * 10 * mm
    put(c, xr + 15 * mm, top - 3 * mm, "①  ②  ③", 7.5, FAINT, False, "c")
    put(c, xcz + 1 * mm, top - 3 * mm, "원인", 7.5, FAINT)
    top -= 4 * mm
    for k, it in enumerate(its):
        yt = top - k * rh; yb = yt - rh
        hline(c, M, W - M, yb)
        dot(c, xn + 4 * mm, yt - rh / 2, k + 1)
        para(c, xm + 1 * mm, yt - rh / 2 + 1 * mm, ", ".join(it["meaning"]), 8.6, wm - 2 * mm, 3.7 * mm, SOFT, False, maxlines=3)
        put(c, xa + 1 * mm, yt - 9 * mm, it["kana"], 14, INK, False, maxw=wa - 3 * mm, minsize=8)
        y2 = yt - 13.6 * mm
        if it["word"] != it["kana"]:
            put(c, xa + 1 * mm, y2, "표기 " + it["word"], 8.2, SOFT, False, maxw=wa - 3 * mm); y2 -= 3.9 * mm
        put(c, xa + 1 * mm, y2, it["pron"], 7.8, FAINT, False, maxw=wa - 3 * mm)
        for j in range(3):
            c.setStrokeColor(BOX); c.setLineWidth(0.6)
            c.roundRect(xr + j * 10 * mm + 1.2 * mm, yt - rh / 2 - 4 * mm, 7.6 * mm, 8 * mm, 1.2 * mm, stroke=1, fill=0)
        for j, ch in enumerate(CAUSE):
            put(c, xcz + 1.5 * mm + j * 5.6 * mm, yt - rh / 2 - 1.2 * mm, ch, 9, SOFT, False)

# ── 활용 (형용사) ───────────────────────────────────────────────────────
def d_adj_rule(c, W, H, idx):
    top = chrome(c, W, H, idx, "활용", "형용사 규칙", "선생님 학습지 「형용사 활용 (부정형, 과거형)」 + 단어장 2쪽",
                 "표를 소리 내어 읽고, 아래 ★ 세 가지를 입으로 말해 보세요.", date=False)
    rows = [("い형 현재", "～い", "～く ない"), ("과거", "～かった", "～く なかった"), ("과거 정중", "～かったです", "～く なかったです"),
            ("な형 현재", "～だ", "～じゃ ない"), ("과거", "～だった", "～じゃ なかった"), ("과거 정중", "～でした", "～じゃ なかったです")]
    x0 = M; c1 = 34 * mm; cw = (W - 2 * M - c1) / 2; rh = 14 * mm
    c.setFillColor(TINT); c.rect(x0, top - 9 * mm, W - 2 * M, 9 * mm, stroke=0, fill=1)
    put(c, x0 + c1 + cw / 2, top - 6 * mm, "긍정", 9.5, INK, True, "c"); put(c, x0 + c1 + cw * 1.5, top - 6 * mm, "부정", 9.5, INK, True, "c")
    y = top - 9 * mm
    for k, (a, b, d) in enumerate(rows):
        yb = y - rh
        if k == 3:
            hline(c, M, W - M, y, RULE, 1.0)
        hline(c, M, W - M, yb)
        put(c, x0 + 2 * mm, y - 8.4 * mm, a, 9.5, RULE if "형" in a else SOFT, True)
        put(c, x0 + c1 + cw / 2, y - 8.8 * mm, b, 15, INK, False, "c")
        put(c, x0 + c1 + cw * 1.5, y - 8.8 * mm, d, 15, INK, False, "c")
        y = yb
    y -= 10 * mm
    notes = [("★", RULE, "과거 부정은 부정문으로 바꾼 뒤 과거형", "さむい → さむく ない → さむく なかった   /   すきだ → すきじゃ ない → すきじゃ なかった"),
             ("★", RULE, "いい(좋다)는 よい 로 활용", "よく ない · よかった · よかったです · よく なかった · よく なかったです   (いく ない X)"),
             ("×", SHU, "～かったでした · ～だったです 는 없는 말 (선생님 필기)", "재미있었어요 = おもしろかったです (おもしろいでした X) · 좋아했습니다 = すきでした (すきだったです X)")]
    for mark, col, t, d in notes:
        put(c, M, y, mark, 12, col, True)
        put(c, M + 8 * mm, y, t, 10.5, INK, True, maxw=W - 2 * M - 8 * mm)
        put(c, M + 8 * mm, y - 5.6 * mm, d, 8.8, SOFT, False, maxw=W - 2 * M - 8 * mm)
        y -= 17 * mm
    put(c, M, y, "직접 써 보기 — 규칙을 보지 않고 아래에 す き だ 와 こ わ い 의 5가지 형을 써 보세요", 9.5, INK, True)
    y -= 4 * mm
    write_box(c, M, 24 * mm, W - 2 * M, y - 24 * mm, guide=False)
    for k in range(1, 5):
        hline(c, M + 2 * mm, W - M - 2 * mm, 24 * mm + k * (y - 24 * mm) / 5, HEX("#DCE3E0"), 0.5, (1.2, 2))

def adj_cols(W):
    x0 = M; cn = 43 * mm; cw = (W - 2 * M - cn) / 5
    return x0, cn, cw

def d_adj_table(c, W, H, idx, adjs):
    top = chrome(c, W, H, idx, "활용", "활용표 (정답)", "%d개 · い형 %d · な형 %d" % (len(adjs), sum(1 for a in adjs if not a["na"]), sum(1 for a in adjs if a["na"])),
                 "소리 내어 한 줄씩 읽고, 틀리기 쉬운 형에 빨간 밑줄. 다음 쪽부터 이 표를 보지 않고 씁니다.", date=False)
    x0, cn, cw = adj_cols(W)
    heads = [f["nm"] for f in adjs[0]["forms"]]
    c.setFillColor(TINT); c.rect(x0, top - 8 * mm, W - 2 * M, 8 * mm, stroke=0, fill=1)
    put(c, x0 + 2 * mm, top - 5.4 * mm, "형용사", 8.5, INK, True)
    for j, h in enumerate(heads):
        put(c, x0 + cn + j * cw + cw / 2, top - 5.4 * mm, h, 8.5, INK, True, "c")
    n = len(adjs); rh = (top - 8 * mm - 13 * mm) / n
    y = top - 8 * mm
    for k, a in enumerate(adjs):
        yb = y - rh
        if k and a["na"] != adjs[k - 1]["na"]:
            hline(c, M, W - M, y, RULE, 1.0)
        hline(c, M, W - M, yb)
        put(c, x0 + 2 * mm, y - rh * 0.5 - 0.3 * mm, a["kana"], 11, INK, True, maxw=cn - 14 * mm)
        put(c, x0 + 2 * mm, y - rh * 0.5 - 3.6 * mm, ", ".join(a["meaning"]) + (" · な형" if a["na"] else ""), 6.8, FAINT, maxw=cn - 3 * mm)
        for j, f in enumerate(a["forms"]):
            put(c, x0 + cn + j * cw + cw / 2, y - rh * 0.5 - 0.1 * mm, f["ja"], 10.5, INK, False, "c", maxw=cw - 3 * mm, minsize=7)
            put(c, x0 + cn + j * cw + cw / 2, y - rh * 0.5 - 3.4 * mm, f["pron"], 6.4, FAINT, False, "c", maxw=cw - 3 * mm, minsize=5)
        y = yb

def d_adj_retr(c, W, H, idx, adjs, att, na, sec_label, tkey):
    sub_ = [a for a in adjs if a["na"] == na]
    top = chrome(c, W, H, idx, "활용", "활용 꺼내쓰기 %s · %s형" % (ATT[att][0], "な" if na else "い"), ATT[att][1] + " · 활용표를 보지 않고",
                 "형용사를 보고 5가지 형을 씁니다. 틀리기 쉬운 것은 과거 부정(～く なかった · ～じゃ なかった).", score=len(sub_) * 5)
    put(c, W - M, top - 3.2 * mm, "정답 →", 8.5, RULE, True, "r")
    BOOK.link(c, tkey, W - M - 16 * mm, top - 6 * mm, W - M, top)
    top -= 5 * mm
    x0, cn, cw = adj_cols(W)
    c.setFillColor(TINT); c.rect(x0, top - 8 * mm, W - 2 * M, 8 * mm, stroke=0, fill=1)
    put(c, x0 + 2 * mm, top - 5.4 * mm, "형용사", 8.5, INK, True)
    for j, f in enumerate(adjs[0]["forms"]):
        put(c, x0 + cn + j * cw + cw / 2, top - 5.4 * mm, f["nm"], 8.5, INK, True, "c")
    rh = 15 * mm
    y = top - 8 * mm
    for k, a in enumerate(sub_):
        yb = y - rh
        hline(c, M, W - M, yb)
        put(c, x0 + 2 * mm, y - 7 * mm, a["kana"] if att == 0 else a["kana"], 12, INK, True, maxw=cn - 3 * mm)
        put(c, x0 + 2 * mm, y - 11.4 * mm, ", ".join(a["meaning"]), 7.6, FAINT, maxw=cn - 3 * mm)
        for j in range(5):
            write_box(c, x0 + cn + j * cw + 1.2 * mm, yb + 1.6 * mm, cw - 2.4 * mm, rh - 3.2 * mm)
        y = yb
    if na:
        put(c, M, y - 8 * mm, "틀린 형 다시 쓰기 (3번씩) — 위에서 틀린 것을 정답과 비교해 아래에 옮겨 쓰세요", 9, INK, True)
        by = y - 12 * mm
        write_box(c, M, 18 * mm, W - 2 * M, by - 18 * mm, guide=False)
        for k in range(1, 4):
            hline(c, M + 2 * mm, W - M - 2 * mm, 18 * mm + k * (by - 18 * mm) / 4, HEX("#DCE3E0"), 0.5, (1.2, 2))

# ── 표현 ────────────────────────────────────────────────────────────────
def with_key(c, x, y, ja, key, size, maxw, color=INK):
    """문장 안의 핵심어를 빨갛게 — 폭이 넘치면 글자 크기를 줄인다."""
    parts = ja.split(key, 1) if key and key in ja else [ja, ""]
    segs = [(parts[0], color, False)]
    if len(parts) == 2 and key in ja:
        segs += [(key, SHU, True), (parts[1], color, False)]
    tot = sum(text_w(s, size, b) for s, _, b in segs)
    while tot > maxw and size > 7:
        size -= 0.25; tot = sum(text_w(s, size, b) for s, _, b in segs)
    for s, col, b in segs:
        if not s: continue
        put(c, x, y, s, size, col, b); x += text_w(s, size, b)
    return size

def blankable(p):
    return p["key"] and p["key"] in p["ja"] and len(p["ja"]) - len(p["key"]) >= 2

def d_phr_learn(c, W, H, idx, S):
    its = S["items"]
    top = chrome(c, W, H, idx, "표현", "표현 배우기 %d/%d" % (S["part"], S["parts"]), "교과서 %s · 문형 %d개" % (S["pg"], len(its)),
                 "소리 내어 읽고, 빨간 핵심어를 확인하세요. 다음 쪽부터 핵심어를 보지 않고 씁니다.", date=False)
    n = len(its); rh = min(31 * mm, (top - 14 * mm) / n)
    for k, p in enumerate(its):
        yt = top - k * rh; yb = yt - rh
        hline(c, M, W - M, yb)
        dot(c, M + 4 * mm, yt - 8 * mm, p["no"])
        with_key(c, M + 11 * mm, yt - 8.6 * mm, p["ja"], p["key"], 14, W - 2 * M - 12 * mm)
        put(c, M + 11 * mm, yt - 13.2 * mm, p["pron"], 8, FAINT, False, maxw=W - 2 * M - 12 * mm)
        put(c, M + 11 * mm, yt - 18 * mm, p["ko"], 10, INK, True, maxw=W - 2 * M - 12 * mm)
        yy = para(c, M + 11 * mm, yt - 22.4 * mm, p["use"], 7.8, W - 2 * M - 12 * mm, 3.4 * mm, SOFT, maxlines=1)
        if p["vs"]:
            para(c, M + 11 * mm, yy, "↔ " + p["vs"]["ja"] + " — " + p["vs"]["why"], 7.4, W - 2 * M - 12 * mm, 3.2 * mm, FAINT, maxlines=1, bottom=yb + 1.5 * mm)

def d_phr_retr(c, W, H, idx, S, att, tkey):
    its = S["items"]
    top = chrome(c, W, H, idx, "표현", "표현 꺼내쓰기 %s %d/%d" % (ATT[att][0], S["part"], S["parts"]), ATT[att][1] + " · 배우기 쪽을 보지 않고",
                 "뜻과 문장을 보고 빈칸의 핵심어를 씁니다. 빈칸이 없는 표현은 전체를 씁니다.", score=len(its))
    put(c, W - M, top - 3.2 * mm, "정답 →", 8.5, RULE, True, "r")
    BOOK.link(c, tkey, W - M - 16 * mm, top - 6 * mm, W - M, top)
    top -= 4 * mm
    n = len(its); rh = min(28 * mm, (top - 12 * mm) / n)
    for k, p in enumerate(its):
        yt = top - k * rh; yb = yt - rh
        hline(c, M, W - M, yb)
        dot(c, M + 4 * mm, yt - 8 * mm, p["no"])
        put(c, M + 11 * mm, yt - 7.6 * mm, p["ko"], 10.5, INK, True, maxw=W - 2 * M - 12 * mm)
        full = not blankable(p)
        if full:
            put(c, M + 11 * mm, yt - 12.2 * mm, p["use"], 7.6, FAINT, maxw=W - 2 * M - 12 * mm)
            write_box(c, M + 11 * mm, yb + 2.6 * mm, W - 2 * M - 12 * mm, rh - 17 * mm)
        else:
            put(c, M + 11 * mm, yt - 13.4 * mm, p["ja"].replace(p["key"], "（　　　　　）"), 12.5, INK, False,
                maxw=W - 2 * M - 12 * mm, minsize=8)
            put(c, M + 11 * mm, yt - 18 * mm, p["use"], 7.4, FAINT, maxw=W - 2 * M - 52 * mm)
            write_box(c, W - M - 40 * mm, yb + 2.4 * mm, 40 * mm, 8.8 * mm)
            put(c, W - M - 42 * mm, yb + 5 * mm, "핵심어", 7.2, FAINT, False, "r")
        chip(c, W - M - 21 * mm, yt - 6.4 * mm, 9.6 * mm, 4.8 * mm, "확실", 6.6)
        chip(c, W - M - 10.4 * mm, yt - 6.4 * mm, 9.6 * mm, 4.8 * mm, "애매", 6.6)

# ── 본문 서술형 ─────────────────────────────────────────────────────────
def d_dlg_read(c, W, H, idx, D):
    top = chrome(c, W, H, idx, "본문", "본문 %d쪽 읽기" % D["pg"], D["sub"] + " · ★ 선생님이 서답형으로 짚은 문장" if any(l["star"] for l in D["lines"]) else D["sub"],
                 "소리 내어 읽고 해석을 입으로 말해 보세요. 다음 쪽부터 해석만 보고 일본어로 씁니다.", date=False)
    n = len(D["lines"]); rh = min(24 * mm, (top - 12 * mm) / n)
    for k, l in enumerate(D["lines"]):
        yt = top - k * rh; yb = yt - rh
        hline(c, M, W - M, yb)
        dot(c, M + 4 * mm, yt - 6.5 * mm, l["n"])
        put(c, M + 10.5 * mm, yt - 5.7 * mm, l["spk"], 7.6, FAINT, True)
        x = M + 27 * mm; w = W - M - x
        s = put(c, x, yt - 6.4 * mm, ("★ " if l["star"] else "") + l["kana"], 13, SHU if l["star"] else INK, False, maxw=w, minsize=7.5)
        y2 = yt - 10.6 * mm
        if l["disp"] != l["kana"]:
            put(c, x, y2, "교과서 표기 " + l["disp"], 7.4, FAINT, False, maxw=w); y2 -= 3.5 * mm
        put(c, x, y2, l["pron"], 7.4, FAINT, False, maxw=w); y2 -= 3.9 * mm
        put(c, x, y2, l["ko"], 8.8, SOFT, False, maxw=w)

def d_dlg_retr(c, W, H, idx, D, lines, att, part, parts, tkey):
    top = chrome(c, W, H, idx, "본문", "본문 %d쪽 쓰기 %s %d/%d" % (D["pg"], ATT[att][0], part, parts), ATT[att][1] + " · 읽기 쪽을 보지 않고",
                 "해석을 보고 일본어로 한 문장씩 씁니다. 한자는 가나로 써도 됩니다(선생님 기준).", score=len(lines))
    put(c, W - M, top - 3.2 * mm, "읽기 쪽 →", 8.5, RULE, True, "r")
    BOOK.link(c, tkey, W - M - 20 * mm, top - 6 * mm, W - M, top)
    top -= 4 * mm
    rh = min(42 * mm, (top - 12 * mm) / max(1, len(lines)))
    for k, l in enumerate(lines):
        yt = top - k * rh; yb = yt - rh
        hline(c, M, W - M, yb)
        dot(c, M + 4 * mm, yt - 6 * mm, l["n"])
        put(c, M + 10.5 * mm, yt - 5.4 * mm, ("★ " if l["star"] else "") + l["spk"], 7.6, SHU if l["star"] else FAINT, True)
        put(c, M + 27 * mm, yt - 5.6 * mm, l["ko"], 10, INK, True, maxw=W - 2 * M - 27 * mm - 22 * mm)
        write_box(c, M + 10.5 * mm, yb + 2.6 * mm, W - 2 * M - 10.5 * mm, rh - 12 * mm)
        chip(c, W - M - 21 * mm, yt - 7.2 * mm, 9.6 * mm, 4.8 * mm, "확실", 6.6)
        chip(c, W - M - 10.4 * mm, yt - 7.2 * mm, 9.6 * mm, 4.8 * mm, "애매", 6.6)

# ── 실수 노트 · 시험 전 점검 ───────────────────────────────────────────
def d_mistakes(c, W, H, idx, part, parts):
    top = chrome(c, W, H, idx, "노트", "실수 노트 %d/%d" % (part, parts), "정답 쪽에서 틀린 것을 이 쪽에 옮겨 적고, 3번 다시 씁니다",
                 "특히 원인이 가·촉·탁·철(아는데 틀린 것)인 것을 먼저. 시험 주에는 이 노트만 봅니다.", date=False)
    put(c, M, top - 3.4 * mm, LEGEND + " · 활=활용 · 조=조사", 7.2, FAINT, maxw=W - 2 * M)
    top -= 6 * mm
    cols = [("날짜", 13), ("문제(뜻)", 40), ("내가 쓴 것", 36), ("정답", 36), ("원인", 28), ("다시 쓰기", 31)]
    sx = W - 2 * M; tot = sum(w for _, w in cols); x = M
    c.setFillColor(TINT); c.rect(M, top - 7 * mm, sx, 7 * mm, stroke=0, fill=1)
    xs = []
    for t, w in cols:
        ww = sx * w / tot; xs.append((x, ww))
        put(c, x + ww / 2, top - 4.8 * mm, t, 8, INK, True, "c"); x += ww
    rh = (top - 7 * mm - 13 * mm) / 14
    for k in range(14):
        yb = top - 7 * mm - (k + 1) * rh
        hline(c, M, W - M, yb)
        cx, cw = xs[4]
        for j, ch in enumerate(CAUSE + ["활", "조"]):
            put(c, cx + 2 * mm + j * 3.5 * mm, yb + rh / 2 - 1.2 * mm, ch, 7.4, GUIDE)
        rx, rw = xs[5]
        for j in range(3):
            c.setStrokeColor(BOX); c.setLineWidth(0.6)
            c.roundRect(rx + 1.5 * mm + j * (rw - 3 * mm) / 3, yb + 2 * mm, (rw - 3 * mm) / 3 - 1.5 * mm, rh - 4 * mm, 1.2 * mm, stroke=1, fill=0)
    c.setStrokeColor(LINE); c.setLineWidth(0.5)
    for x, w in xs[1:]:
        c.line(x, top - 7 * mm, x, top - 7 * mm - 14 * rh)

def d_final(c, W, H, idx, words):
    top = chrome(c, W, H, idx, "점검", "시험 전 점검", "시험 D-7 · D-3 · D-1 에 이 쪽과 실수 노트만 봅니다",
                 "새로 보지 않습니다. 아는데 틀리는 것을 마지막으로 확인합니다.", date=False)
    kata, small = [], []
    for w in words:
        for m in re.findall(r"[ァ-ヺー]{2,}", w["kana"]):
            if m not in kata: kata.append(m)
        for tok in re.split(r"[\s、。?!～]+", w["kana"]):
            if re.fullmatch(r"[ぁ-ゖー]+", tok) and re.search(r"[っゃゅょ]", tok) and tok not in small: small.append(tok)
    kata = [{"kana": k} for k in kata]; long_ = [{"kana": k} for k in small]
    def block(title, sub, items, y, per=4):
        put(c, M, y, title, 10.5, INK, True)
        put(c, M + text_w(title, 10.5, True) + 3 * mm, y, sub, 8, FAINT)
        y -= 6 * mm
        cw = (W - 2 * M) / per
        for k, w in enumerate(items):
            col, row = k % per, k // per
            xx = M + col * cw; yy = y - row * 6.1 * mm
            c.setStrokeColor(BOX); c.setLineWidth(0.6); c.rect(xx, yy - 1.2 * mm, 3.4 * mm, 3.4 * mm, stroke=1, fill=0)
            put(c, xx + 5 * mm, yy - 0.4 * mm, w["kana"], 9.2, INK, False, maxw=cw - 7 * mm, minsize=6)
        return y - math.ceil(len(items) / per) * 6.1 * mm - 4 * mm
    y = top - 2 * mm
    y = block("가타카나로 쓰는 말", "히라가나로 쓰면 틀립니다 · 장음 ー · 촉음 ッ", kata, y)
    y = block("촉음 っ · 요음 ゃゅょ 가 있는 말", "작은 글자를 빠뜨리거나 크게 쓰기 쉽습니다", long_, y)
    put(c, M, y, "마지막 점검", 10.5, INK, True); y -= 6.4 * mm
    for t in ["활용: 과거 부정은 '부정문 → 과거'로 만든다 (～く なかった · ～じゃ なかった)",
              "いい 는 よい 로 활용한다 (よく ない · よかった)",
              "～かったでした · ～だったです 는 없는 말이다",
              "く → いた · ぐ → いだ · う·つ·る → った · ぬ·む·ぶ → んだ · す → した · 行く → 行った",
              "조사: ロボット が いる (は X) · じてんしゃ に のる · からだ に 気を つけて",
              "聞く 는 뜻이 둘(듣다·묻다) · 見る 는 2류 · 聞いて みる 는 みる(2류)를 따른다"]:
        c.setStrokeColor(BOX); c.setLineWidth(0.6); c.rect(M, y - 1.2 * mm, 3.4 * mm, 3.4 * mm, stroke=1, fill=0)
        y = para(c, M + 5 * mm, y, t, 9, W - 2 * M - 6 * mm, 4.6 * mm, SOFT, maxlines=2) - 1.6 * mm
    y -= 4 * mm
    put(c, M, y, "시험 주 계획", 10.5, INK, True); y -= 7 * mm
    for lab, t in [("D-7", "각 세션 꺼내쓰기 ③ 한 번씩 · 활용 꺼내쓰기 · 본문 서술형 쓰기 — 시험 시간을 재고 풉니다"),
                   ("D-3", "실수 노트에서 원인이 가·촉·탁·철인 것부터 다시 쓰기 · 이 쪽 점검"),
                   ("D-1", "실수 노트만. 새로 보지 않고, 8시간 이상 잡니다")]:
        c.setStrokeColor(BOX); c.setLineWidth(0.6); c.rect(M, y - 1.2 * mm, 3.4 * mm, 3.4 * mm, stroke=1, fill=0)
        put(c, M + 6 * mm, y, lab, 9.5, RULE, True)
        put(c, M + 18 * mm, y, t, 9, SOFT, False, maxw=W - 2 * M - 19 * mm)
        y -= 7 * mm

# ── 조립 ────────────────────────────────────────────────────────────────
def build(upto, frm, start, out):
    global BOOK
    d = load(upto, frm)
    BOOK = Book(upto, frm)
    words, adjs, phrases, dlgs = d["words"], d["adjs"], d["phrases"], d["dialogues"]
    sessions = split_sessions(words, 10)
    secs = []                      # 목차 (제목, 쪽 key)
    cal = []                       # 달력 행 (이름, 설명, key)

    nsess = len(sessions)
    info = dict(range=("교과서 5과 %d~%d쪽" % (frm + 1, upto)) if frm else ("교과서 5과 · 진도 %d쪽까지" % upto),
                count="단어 %d · 형용사 활용 %d · 표현 %d · 본문 %d쪽" % (len(words), len(adjs), len(phrases), len(dlgs)))
    BOOK.add("cover", "표지 · 사용법", A4, lambda c, W, H, i: d_cover(c, W, H, i, info), sec=("표지 · 사용법", "cover"))
    BOOK.add("cal", "복습 달력", A4, None, sec=("복습 달력", "cal"))
    BOOK.add("toc", "목차", A4, None, sec=("목차", "toc"))

    for j, items in enumerate(sessions):
        n = start + j
        S = dict(n=n, items=items, pg=pg_label(items))
        o1 = list(range(len(items))); o2 = shuffled(len(items), n * 2 + 1); o3 = shuffled(len(items), n * 2 + 2, o2)
        title = "S%d · 교과서 %s (%d개)" % (n, S["pg"], len(items))
        secs.append((title, "s%d-learn" % n)); cal.append(("S%d  단어 %s" % (n, S["pg"]), "%d개" % len(items), "s%d-learn" % n))
        BOOK.add("s%d-learn" % n, "S%d 배우기" % n, A4, (lambda S: lambda c, W, H, i: d_learn(c, W, H, i, S))(S), sec=(title, "sec-s%d" % n))
        for att, o, key in ((0, o1, "s%d-r1"), (None, None, "s%d-ans"), (1, o2, "s%d-r2"), (2, o3, "s%d-r3")):
            if att is None:
                BOOK.add(key % n, "S%d 정답 확인" % n, A4, (lambda S: lambda c, W, H, i: d_ans(c, W, H, i, S))(S))
            else:
                BOOK.add(key % n, "S%d 꺼내쓰기 %s" % (n, ATT[att][0]), A4,
                         (lambda S, o, att: lambda c, W, H, i: d_retr(c, W, H, i, S, o, att))(S, o, att))

    if adjs:
        ia = [a for a in adjs if not a["na"]]; na = [a for a in adjs if a["na"]]
        secs.append(("활용 · 형용사 부정형·과거형 (%d개)" % len(adjs), "adj-rule")); cal.append(("활용 형용사", "%d개 · 학습지" % len(adjs), "adj-rule"))
        BOOK.add("adj-rule", "활용 규칙", A4, lambda c, W, H, i: d_adj_rule(c, W, H, i), sec=("활용 · 형용사 부정형·과거형", "sec-adj"))
        BOOK.add("adj-table", "활용표 (정답)", LAND, lambda c, W, H, i: d_adj_table(c, W, H, i, adjs))
        for att in range(3):
            for isna, grp in ((False, ia), (True, na)):
                if grp:
                    BOOK.add("adj-r%d%s" % (att + 1, "n" if isna else "i"), "활용 꺼내쓰기 %s %s형" % (ATT[att][0], "な" if isna else "い"), LAND,
                             (lambda att, isna: lambda c, W, H, i: d_adj_retr(c, W, H, i, adjs, att, isna, "", "adj-table"))(att, isna))

    if phrases:
        for k, p in enumerate(phrases): p["no"] = k + 1
        parts = split_sessions(phrases, 8)
        secs.append(("표현 · 문형 (%d개)" % len(phrases), "phr-learn1")); cal.append(("표현 문형", "%d개" % len(phrases), "phr-learn1"))
        for j, items in enumerate(parts):
            S = dict(items=items, pg=pg_label(items), part=j + 1, parts=len(parts))
            BOOK.add("phr-learn%d" % (j + 1), "표현 배우기 %d/%d" % (j + 1, len(parts)), A4,
                     (lambda S: lambda c, W, H, i: d_phr_learn(c, W, H, i, S))(S), sec=(("표현 · 문형", "sec-phr") if j == 0 else None))
        for att in range(3):
            for j, items in enumerate(parts):
                S = dict(items=items, pg=pg_label(items), part=j + 1, parts=len(parts))
                BOOK.add("phr-r%d-%d" % (att + 1, j + 1), "표현 꺼내쓰기 %s %d/%d" % (ATT[att][0], j + 1, len(parts)), A4,
                         (lambda S, att, j: lambda c, W, H, i: d_phr_retr(c, W, H, i, S, att, "phr-learn%d" % (j + 1)))(S, att, j))

    for D in dlgs:
        pg = D["pg"]; key = "dlg%d" % pg
        secs.append(("본문 %d쪽 · 서술형" % pg, key + "-read")); cal.append(("본문 %d쪽 서술형" % pg, "%d문장 · ★ 서답형" % len(D["lines"]) if pg == 85 else "%d문장" % len(D["lines"]), key + "-read"))
        BOOK.add(key + "-read", "본문 %d쪽 읽기" % pg, A4, (lambda D: lambda c, W, H, i: d_dlg_read(c, W, H, i, D))(D), sec=("본문 %d쪽 · 서술형" % pg, "sec-" + key))
        chunks = split_sessions(D["lines"], 6)
        for att in range(2):
            for j, ls in enumerate(chunks):
                BOOK.add("%s-r%d-%d" % (key, att + 1, j + 1), "본문 %d쪽 쓰기 %s %d/%d" % (pg, ATT[att][0], j + 1, len(chunks)), A4,
                         (lambda D, ls, att, j, n: lambda c, W, H, i: d_dlg_retr(c, W, H, i, D, ls, att, j + 1, n, key + "-read"))(D, ls, att, j, len(chunks)))

    secs.append(("실수 노트", "notes1")); cal_notes = 3
    for j in range(cal_notes):
        BOOK.add("notes%d" % (j + 1), "실수 노트 %d/%d" % (j + 1, cal_notes), A4, (lambda j: lambda c, W, H, i: d_mistakes(c, W, H, i, j + 1, cal_notes))(j),
                 sec=(("실수 노트", "sec-notes") if j == 0 else None))
    secs.append(("시험 전 점검", "final"))
    BOOK.add("final", "시험 전 점검", A4, lambda c, W, H, i: d_final(c, W, H, i, words), sec=("시험 전 점검", "sec-final"))

    pnum = BOOK.pnum
    BOOK.pages[pnum["cal"]]["draw"] = lambda c, W, H, i: d_calendar(c, W, H, i, cal)
    BOOK.pages[pnum["toc"]]["draw"] = lambda c, W, H, i: d_toc(c, W, H, i, secs)

    cv = canvas.Canvas(out)
    cv.setTitle("일본어 회화 2학기 2회고사 학습장 (진도 %d쪽까지)" % upto)
    cv.setAuthor("일본어 시험 대비")
    cv.setSubject("GoodNotes 용 · 배우기 → 꺼내쓰기 → 정답 확인 → 간격 복습")
    cv.showOutline()
    for i, pg in enumerate(BOOK.pages):
        W, H = pg["size"]
        cv.setPageSize((W, H))
        if pg["sec"]:
            cv.bookmarkPage(pg["sec"][1]); cv.addOutlineEntry(pg["sec"][0], pg["sec"][1], 0, closed=1)
        cv.bookmarkPage(pg["key"])
        if pg["sec"] is None or pg["sec"][0] != pg["title"]:
            if not (pg["sec"] and pg["key"] in ("cover", "cal", "toc")):
                cv.addOutlineEntry(pg["title"], pg["key"], 1)
        pg["draw"](cv, W, H, i)
        cv.showPage()
    cv.save()
    print("%s — %d쪽 (단어 %d · 세션 %d · 활용 %d · 표현 %d · 본문 %d쪽)" % (os.path.relpath(out, ROOT), len(BOOK.pages), len(words), nsess, len(adjs), len(phrases), len(dlgs)))

def main():
    a = sys.argv[1:]
    frm, start = 0, 1
    if "--from" in a:
        k = a.index("--from"); frm = int(a[k + 1]); del a[k:k + 2]
    if "--start" in a:
        k = a.index("--start"); start = int(a[k + 1]); del a[k:k + 2]
    upto = int(a[0]) if a else 89
    out = os.path.abspath(a[1]) if len(a) > 1 else os.path.join(ROOT, "docs", "2026-일본어회화-2학기2회고사-학습장.pdf")
    build(upto, frm, start, out)

if __name__ == "__main__":
    main()
