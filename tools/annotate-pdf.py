# -*- coding: utf-8 -*-
"""단어장 PDF 의 일본어 밑에 작은 한국어 발음을 깔아 준다.

발음은 앱과 **같은 함수**로 만든다 — tools/extract-engine.py 가 index.html 에서
toKo/pron 을 떼어 주고, 그걸 node 로 돌린다. 여기에 규칙을 다시 적으면 두 곳이
어긋나는 날이 오고, 어긋난 쪽이 어느 쪽인지 아무도 모르게 된다.

한자가 남는 항목은 건너뛴다. 후리가나가 있으면 漢字(かな) → かな 로 풀고,
없으면 읽을 방법이 없으니 반쯤 읽힌 줄을 다느니 비워 둔다.

자리 잡기 — 원문은 표다. 칸을 넘어가면 남의 칸을 덮는다.
  ① 아래에 자리가 있으면 아래에 깐다(줄 아래 작게).
  ② 두 줄짜리 칸의 아랫줄처럼 아래가 막혔으면 오른쪽에 붙인다.
  ③ 둘 다 안 되면 적지 않는다. 겹쳐 적으면 원문이 못 읽힌다.
"""
import io, json, os, re, subprocess, sys

import pdfplumber
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader, PdfWriter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, "docs", "2026-일본어회화-2학기1회고사-단어장.pdf")
OUT  = os.path.join(ROOT, "docs", "2026-일본어회화-2학기1회고사-단어장-발음.pdf")
FONT = "/usr/local/lib/python3.11/dist-packages/koreanize_matplotlib/fonts/NanumGothic.ttf"

KANA  = re.compile(r"[ぁ-ゖァ-ヺー]")
HAN   = re.compile(r"[가-힣]")
KANJI = re.compile(r"[㐀-鿿々]")
FURI  = re.compile(r"[㐀-鿿々]+[(（]([ぁ-ゖァ-ヺー]+)[)）]")

SIZE = 6.2      # 발음 글자 크기 — 원문 10.4pt 아래 줄 간격에 들어가야 한다
MIN  = 4.3      # 이보다 작으면 읽히지 않으니 차라리 안 적는다
DROP = 1.0      # 원문 아래로 얼마나 띄울지
PAD  = 0.6      # 표 선에서 떨어뜨릴 여백
ROW  = 5.0      # 이 안에 들어오면 같은 줄로 본다
GAP  = 15.0     # 이만큼 떨어지면 다른 항목으로 본다
RULE = 40.0     # 이보다 짧은 가로선은 표 테두리가 아니라 밑줄이다 — 자리를 막지 않는다
GRAY = 0.42
RUBY = 6.5      # 이보다 작은 글자는 본문이 아니라 한자 위에 올려 둔 후리가나다
BODY = 8.0
DIGIT = re.compile(r"[0-9０-９]")   # ７月(しちがつ) 의 ７ — 읽기는 후리가나가 이미 갖고 있다

def is_ja(t):
    return bool(KANA.search(t)) and not HAN.search(t)

def resolve(t):
    """漢字(かな) → かな. 후리가나가 없는 한자는 그대로 남겨 둔다(그러면 건너뛴다)."""
    return DIGIT.sub("", FURI.sub(lambda m: m.group(1), t))

def unruby(pg, words):
    """한자 위에 작게 얹힌 후리가나(ルビ)를 한자 자리에 내려 놓는다.

    이 단어장은 대개 漢字(かな) 로 괄호 안에 적지만, 3쪽 ★ 예외촉음 줄만
    진짜 루비로 얹혀 있다. 그대로 두면 「行」 은 읽을 수 없어 빠지고
    남은 「く」 만 '쿠' 로 달려 원문을 덮는다.
    """
    def size_of(w):
        sz = [c["size"] for c in pg.chars
              if w["x0"] - .5 <= (c["x0"] + c["x1"]) / 2 <= w["x1"] + .5
              and w["top"] - .5 <= (c["top"] + c["bottom"]) / 2 <= w["bottom"] + .5]
        return min(sz) if sz else BODY
    ruby = [w for w in words if size_of(w) < RUBY]
    body = [w for w in words if size_of(w) >= BODY]
    out  = [w for w in words if w not in ruby]
    for r in ruby:
        host = [b for b in body
                if b["top"] > r["top"] and b["top"] - r["top"] < 14
                and b["x0"] < r["x1"] and b["x1"] > r["x0"]]
        if not host:
            continue
        b = min(host, key=lambda b: b["top"] - r["top"])
        keep = [c["text"] for c in pg.chars
                if b["x0"] - .5 <= c["x0"] and c["x1"] <= b["x1"] + .5
                and b["top"] - .5 <= c["top"] <= b["bottom"]
                and not (c["x0"] < r["x1"] and c["x1"] > r["x0"])]
        b["text"] = r["text"] + "".join(keep)
    return out

def rows(words):
    """같은 줄끼리 모은다.

    칸마다 글자 크기가 달라 top 이 몇 pt 씩 어긋난다(루비를 내려 놓은 한자는 더).
    고정 눈금으로 나누면 「行」 과 「く」 가 다른 줄로 갈라지므로 붙여 나간다.
    줄 간격은 26pt 쯤이고 한 칸 안의 두 줄도 13pt 는 떨어져 있어 ROW 로 충분하다."""
    out = []
    for w in sorted(words, key=lambda w: w["top"]):
        if out and w["top"] - out[-1][0] <= ROW:
            out[-1][1].append(w)
        else:
            out.append((w["top"], [w]))
    return [sorted(r, key=lambda w: w["x0"]) for _, r in out]

def runs(row):
    """한 줄에서 가로로 붙어 있는 일본어 낱말들을 한 항목으로 묶는다."""
    out, cur = [], []
    for w in row:
        if is_ja(w["text"]) and (not cur or w["x0"] - cur[-1]["x1"] <= GAP):
            cur.append(w)
        else:
            if cur: out.append(cur)
            cur = [w] if is_ja(w["text"]) else []
    if cur: out.append(cur)
    return out

def below(edges, x0, x1, bottom):
    """이 항목 바로 아래를 가로지르는 표 선까지 남은 높이."""
    ys = [e["top"] for e in edges
          if e["top"] > bottom + 0.5 and e["x0"] <= x1 + 1 and e["x1"] >= x0 - 1]
    return (min(ys) - bottom) if ys else None

def right_of(vedges, row, x1, top, bottom):
    """오른쪽으로 쓸 수 있는 끝 — 같은 줄의 다음 글자나 칸 테두리 중 먼저 오는 것."""
    lim = [w["x0"] for w in row if w["x0"] > x1 + 0.5]
    lim += [e["x0"] for e in vedges
            if e["x0"] > x1 + 0.5 and e["top"] <= bottom and e["bottom"] >= top]
    return min(lim) if lim else None

def left_of(vedges, row, x0, top, bottom):
    """왼쪽으로 쓸 수 있는 끝."""
    lim = [w["x1"] for w in row if w["x1"] < x0 - 0.5]
    lim += [e["x1"] for e in vedges
            if e["x1"] < x0 - 0.5 and e["top"] <= bottom and e["bottom"] >= top]
    return max(lim) if lim else None

def fit(avail):
    """선까지 남은 높이에 맞춰 글자 크기를 줄인다. 글자 높이 ≒ 0.95·size."""
    if avail is None: return SIZE
    return min(SIZE, (avail - DROP - PAD) / 0.95)

def pronounce(texts):
    """앱의 pron 을 그대로 쓴다 — 한자가 남으면 빈 문자열이 돌아온다."""
    eng = subprocess.run([sys.executable, os.path.join(ROOT, "tools", "extract-engine.py")],
                         capture_output=True, check=True).stdout.decode("utf-8")
    js = ("%s\nvar IN=JSON.parse(process.argv[1]);"
          "process.stdout.write(JSON.stringify(IN.map(function(s){return pron(s);})));" % eng)
    r = subprocess.run(["node", "-e", js, json.dumps(texts, ensure_ascii=False)],
                       capture_output=True, check=True)
    return json.loads(r.stdout.decode("utf-8"))

def main():
    pdfmetrics.registerFont(TTFont("Nanum", FONT))
    src = pdfplumber.open(SRC)

    plan, flat = [], []
    for pg in src.pages:
        hedges = [e for e in pg.edges
                  if e["orientation"] == "h" and e["x1"] - e["x0"] >= RULE]
        vedges = [e for e in pg.edges if e["orientation"] == "v"]
        items = []
        ws = pg.extract_words(use_text_flow=False, keep_blank_chars=False)
        for row in rows(unruby(pg, ws)):
            for run in runs(row):
                ja = run[0]["text"]
                for a, b in zip(run, run[1:]):
                    ja += (" " if b["x0"] - a["x1"] > 3.0 else "") + b["text"]
                ja = resolve(ja)
                if KANJI.search(ja):        # 후리가나 없는 한자 — 읽을 방법이 없다
                    continue
                x0, x1 = run[0]["x0"], run[-1]["x1"]
                top    = min(w["top"] for w in run)
                bottom = max(w["bottom"] for w in run)
                items.append({
                    "x0": x0, "x1": x1, "top": top, "bottom": bottom, "ja": ja,
                    "size":  fit(below(hedges, x0, x1, bottom)),
                    "right": right_of(vedges, row, x1, top, bottom),
                    "left":  left_of(vedges, row, x0, top, bottom)
                })
                flat.append(ja)
        plan.append((pg.width, pg.height, items))

    ko = pronounce(flat)
    for _, _, items in plan:
        for it in items:
            it["ko"] = ko.pop(0)

    buf = io.BytesIO()
    c = canvas.Canvas(buf)
    laid, missed = dict(아래=0, 옆=0, 못=0), []
    for w, h, items in plan:
        c.setPageSize((w, h))
        c.setFillGray(GRAY)
        for it in items:
            if not it["ko"]:
                continue
            if it["size"] >= MIN:                                   # ① 아래
                c.setFont("Nanum", it["size"])
                c.drawString(it["x0"], h - it["bottom"] - DROP - 0.75 * it["size"], it["ko"])
                laid["아래"] += 1
                continue
            need = pdfmetrics.stringWidth(it["ko"], "Nanum", SIZE)
            y    = h - it["bottom"] + 0.6
            rm   = (it["right"] - it["x1"] - 3.0) if it["right"] else None
            lm   = (it["x0"] - it["left"] - 3.0) if it["left"] else None
            if rm is not None and need <= rm:                       # ② 오른쪽에 붙인다
                c.setFont("Nanum", SIZE)
                c.drawString(it["x1"] + 2.0, y, it["ko"])
                laid["옆"] += 1
            elif lm is not None and need <= lm:                     # ③ 왼쪽에 붙인다
                c.setFont("Nanum", SIZE)
                c.drawRightString(it["x0"] - 2.0, y, it["ko"])
                laid["옆"] += 1
            else:                                                   # ④ 자리가 없다
                missed.append(it["ja"])                             # 겹쳐 적느니 비워 둔다
        c.showPage()
    c.save()
    buf.seek(0)

    base, over = PdfReader(SRC), PdfReader(buf)
    out = PdfWriter()
    for i, page in enumerate(base.pages):
        page.merge_page(over.pages[i])
        out.add_page(page)
    with open(OUT, "wb") as f:
        out.write(f)
    print("발음 %d개 (아래 %d · 옆 %d) → %s"
          % (laid["아래"] + laid["옆"], laid["아래"], laid["옆"], os.path.relpath(OUT, ROOT)))
    if missed:
        print("자리가 없어 비워 둔 %d개: %s" % (len(missed), " ".join(missed)))

if __name__ == "__main__":
    main()
