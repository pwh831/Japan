# -*- coding: utf-8 -*-
"""교과서 듣기 대본을 굿노트에서 볼 PDF 로 만든다.

교과서 PDF 에는 듣기 문제의 대화문이 없다(음성으로만 나온다). 능률 NE Books 의
음성을 Whisper 로 받아적고 사람이 교과서 표기(히라가나 띄어쓰기)로 다듬은 것이
docs/scripts/unit6.json 이고, 이 스크립트는 그걸 A4 로 찍기만 한다.

한국어 발음은 앱과 같은 함수(pron)로 만든다 — annotate-pdf.py 와 같은 이유.
"""
import json, os, re, subprocess, sys

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate, Paragraph,
                                Spacer, Table, TableStyle, KeepTogether, PageBreak)
from reportlab.lib.styles import ParagraphStyle

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.environ.get("FONT_DIR", os.path.join(ROOT, "tools", "fonts"))

INK, SOFT, FAINT, RULE = (colors.HexColor(c) for c in ("#1B2021", "#4A524F", "#8A918D", "#4F8378"))
SHU = colors.HexColor("#C8452B")

def fonts():
    for name, fn in (("JA", "ZenKakuGothicNew-Regular.ttf"), ("JAB", "ZenKakuGothicNew-Bold.ttf"),
                     ("KO", "NanumGothic.ttf"), ("KOB", "NanumGothicBold.ttf")):
        pdfmetrics.registerFont(TTFont(name, os.path.join(FONTS, fn)))

def pronounce(texts):
    eng = subprocess.run([sys.executable, os.path.join(ROOT, "tools", "extract-engine.py")],
                         capture_output=True, check=True).stdout.decode("utf-8")
    js = ("%s\nvar IN=JSON.parse(require('fs').readFileSync(0,'utf8'));"
          "process.stdout.write(JSON.stringify(IN.map(function(s){return pron(s);})));" % eng)
    r = subprocess.run(["node", "-e", js], input=json.dumps(texts, ensure_ascii=False).encode("utf-8"),
                       capture_output=True, check=True)
    return json.loads(r.stdout.decode("utf-8"))

NUM = re.compile(r"^[\u2460-\u2473]\s*")    # 낱말 앞의 ①② 번호 — 발음에는 넣지 않는다

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

# 후리가나 — 원고에 「日本{にほん}」처럼 적는다. 한자(앞 숫자 포함) 바로 뒤의 {읽기}.
RUBY = re.compile(r"([0-9]*[\u3400-\u9fff\u3005]+)\{([^}]+)\}")

def kana(s):
    """발음용 — 한자를 읽기로 바꾼다(pron 은 한자가 남으면 비운다)."""
    return RUBY.sub(lambda m: m.group(2), s)

def mark(s):
    """PDF 용 — 한자 뒤에 작은 회색 읽기를 붙인다."""
    out, at = [], 0
    for m in RUBY.finditer(s):
        out.append(esc(s[at:m.start()]))
        out.append('%s<font name="JA" size="8" color="#8A918D">(%s)</font>' % (esc(m.group(1)), esc(m.group(2))))
        at = m.end()
    out.append(esc(s[at:]))
    return "".join(out)

S = {
    "unit":  ParagraphStyle("unit", fontName="KOB", fontSize=10, textColor=RULE, leading=14),
    "h1":    ParagraphStyle("h1", fontName="JAB", fontSize=22, textColor=INK, leading=30),
    "h2":    ParagraphStyle("h2", fontName="JAB", fontSize=17, textColor=INK, leading=24),
    "lead":  ParagraphStyle("lead", fontName="KO", fontSize=10, textColor=SOFT, leading=16),
    "page":  ParagraphStyle("page", fontName="KOB", fontSize=9, textColor=colors.white, leading=12,
                            alignment=1),
    "task":  ParagraphStyle("task", fontName="KOB", fontSize=12, textColor=INK, leading=17),
    "sub":   ParagraphStyle("sub", fontName="KO", fontSize=9, textColor=FAINT, leading=13),
    "no":    ParagraphStyle("no", fontName="KOB", fontSize=10, textColor=RULE, leading=15),
    "spk":   ParagraphStyle("spk", fontName="JAB", fontSize=11, textColor=SOFT, leading=17),
    "spkko": ParagraphStyle("spkko", fontName="KOB", fontSize=10, textColor=SOFT, leading=17),
    "badge": ParagraphStyle("badge", fontName="KOB", fontSize=8.5, textColor=SHU, leading=12),
    "ans":   ParagraphStyle("ans", fontName="KOB", fontSize=9, textColor=RULE, leading=13),
    "ja":    ParagraphStyle("ja", fontName="JA", fontSize=15, textColor=INK, leading=21),
    "pr":    ParagraphStyle("pr", fontName="KO", fontSize=8.5, textColor=FAINT, leading=11),
    "ko":    ParagraphStyle("ko", fontName="KO", fontSize=10, textColor=SOFT, leading=14),
    "word":  ParagraphStyle("word", fontName="JA", fontSize=11.5, textColor=INK, leading=16),
    "wko":   ParagraphStyle("wko", fontName="KO", fontSize=9, textColor=SOFT, leading=13),
    "foot":  ParagraphStyle("foot", fontName="KO", fontSize=8, textColor=FAINT, leading=12),
}

W, H = A4
M = 18 * mm
NOTE = 42 * mm     # 오른쪽은 굿노트에서 필기할 자리로 비워 둔다

def on_page(c, doc):
    c.saveState()
    c.setStrokeColor(colors.HexColor("#E3E6E4")); c.setLineWidth(0.6)
    x = W - M - NOTE + 6 * mm
    c.line(x, M, x, H - M)                                   # 필기 칸 경계
    c.setFont("KO", 7.5); c.setFillColor(FAINT)
    c.drawString(x + 3 * mm, H - M - 3 * mm, "메모")
    c.drawRightString(W - M, 10 * mm, "%d" % doc.page)
    c.drawString(M, 10 * mm, doc.footer)
    c.restoreState()

def ko_punct(t):
    """발음 줄은 한국어로 읽히게 — 、。 를 , . 로 바꾼다."""
    return t.replace("、", ", ").replace("。", ". ").replace("  ", " ").strip()

def has_hangul(t):
    return any("\uac00" <= ch <= "\ud7a3" for ch in t)

def line_block(spk, ja, pr, ko):
    body = [Paragraph(mark(ja), S["ja"])]
    if pr: body.append(Paragraph(esc(ko_punct(pr)), S["pr"]))
    if ko: body.append(Paragraph(esc(ko), S["ko"]))
    who = Paragraph(esc(spk or ""), S["spkko"] if has_hangul(spk or "") else S["spk"])
    t = Table([[who, body]],
              colWidths=[15 * mm, W - 2 * M - NOTE - 15 * mm])
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                           ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                           ("TOPPADDING", (0, 0), (-1, -1), 1), ("BOTTOMPADDING", (0, 0), (-1, -1), 5)]))
    return t

def page_tag(sec):
    cells, widths = [Paragraph("p.%s" % sec["page"], S["page"])], [16 * mm]
    if sec.get("track"):                        # 정리하기 쪽은 음성이 없다
        cells.append(Paragraph(esc("음성 %s" % sec["track"]), S["sub"]))
        widths.append(20 * mm)
    if sec.get("audio_only"):
        cells.append(Paragraph("교과서에 없음 · 음성 전용", S["badge"]))
        widths.append(50 * mm)
    t = Table([cells], colWidths=widths, rowHeights=[6 * mm], hAlign="LEFT")
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, 0), SHU if sec.get("audio_only") else RULE),
                           ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                           ("LEFTPADDING", (1, 0), (-1, 0), 6),
                           ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    return t

def build(src, out):
    fonts()
    data = json.load(open(src, encoding="utf-8"))
    # include — 여러 과 원고를 한 파일로. 과마다 제목 줄(heading)을 넣고 새 쪽에서 시작한다.
    if data.get("include"):
        secs = []
        for fn in data["include"]:
            sub = json.load(open(os.path.join(os.path.dirname(src), fn), encoding="utf-8"))
            secs.append({"heading": sub["title_ja"], "heading_ko": sub["title_ko"], "heading_unit": sub["unit"]})
            secs += sub["sections"]
        data["sections"] = secs

    # 발음은 한 번에 — node 를 줄마다 띄우면 느리다
    flat = []
    for sec in data["sections"]:
        for it in sec.get("items", []):
            for ln in it["lines"]: flat.append(kana(ln[1]))
        for w in sec.get("words", []): flat.append(kana(NUM.sub("", w[0])))
    prs = iter(pronounce(flat))

    story = [Paragraph(esc(data["unit"]), S["unit"]),
             Paragraph('%s <font name="KOB" size="15" color="#4A524F">%s</font>'
                       % (esc(data["title_ja"]), esc(data["title_ko"])), S["h1"]),
             Spacer(1, 2 * mm),
             Paragraph(esc(data["lead"]), S["lead"]),
             Spacer(1, 7 * mm)]

    first_heading = True
    for sec in data["sections"]:
        if sec.get("heading"):
            if not first_heading: story.append(PageBreak())
            first_heading = False
            story += [Paragraph(esc(sec["heading_unit"]), S["unit"]),
                      Paragraph('%s <font name="KOB" size="13" color="#4A524F">%s</font>'
                                % (esc(sec["heading"]), esc(sec["heading_ko"])), S["h2"]),
                      Spacer(1, 5 * mm)]
            continue
        head = [page_tag(sec), Spacer(1, 2 * mm), Paragraph(esc(sec["task"]), S["task"])]
        if sec.get("sub"): head.append(Paragraph(esc(sec["sub"]), S["sub"]))
        head.append(Spacer(1, 3 * mm))
        blocks = []
        for it in sec.get("items", []):
            b = []
            if it.get("no"): b.append(Paragraph(mark(it["no"]), S["no"]))
            for spk, ja, ko in it["lines"]:
                pr = next(prs)
                # line_pron:false — 본문 바로 밑에 해석이 오게 한다(발음은 어휘 표에만)
                b.append(line_block(spk, ja, pr if data.get("line_pron", True) else None, ko))
            if it.get("answer"): b.append(Paragraph(esc(it["answer"]), S["ans"]))
            b.append(Spacer(1, 2.5 * mm))
            blocks.append(b)                     # 날것의 목록 — KeepTogether 를 겹치면 쪽이 통째로 넘어간다
        if sec.get("words"):
            rows = []
            for ja, ko in sec["words"]:
                pr = next(prs)
                rows.append([Paragraph(mark(ja), S["word"]),
                             Paragraph(esc(ko_punct(pr)), S["pr"]), Paragraph(esc(ko), S["wko"])])
            # 어휘 표는 쪽을 넘어가도 된다 — 통째로 넘기면 앞 쪽이 반쯤 빈다.
            # 제목은 표의 첫 줄로 넣고 repeatRows 로 다음 쪽에서도 다시 찍는다.
            head_row = 1 if sec.get("words_title") else 0
            if head_row:
                rows.insert(0, [Paragraph(esc(sec["words_title"]), S["no"]), "", ""])
            wt = Table(rows, colWidths=[46 * mm, 34 * mm, W - 2 * M - NOTE - 80 * mm],
                       repeatRows=head_row)
            st = [("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                  ("LINEBELOW", (0, head_row), (-1, -1), 0.3, colors.HexColor("#E3E6E4")),
                  ("LEFTPADDING", (0, 0), (-1, -1), 0),
                  ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]
            if head_row: st.append(("SPAN", (0, 0), (-1, 0)))
            wt.setStyle(TableStyle(st))
            blocks.append(("split", [Spacer(1, 1 * mm), wt]))
        # 제목이 쪽 끝에 홀로 남지 않게 첫 덩어리와 묶는다. 어휘 표("split")는 묶지 않는다.
        def put(b, first):
            if isinstance(b, tuple):
                return (head if first else []) + b[1]
            return [KeepTogether((head if first else []) + b)]
        for i, b in enumerate(blocks or [[]]):
            story += put(b, i == 0)
        story.append(Spacer(1, 8 * mm))

    story.append(Paragraph(esc(data["source"]), S["foot"]))

    doc = BaseDocTemplate(out, pagesize=A4, leftMargin=M, rightMargin=M + NOTE,
                          topMargin=M, bottomMargin=M + 4 * mm,
                          title=data["title_ja"] + " " + data["title_ko"], author="일본어 시험 대비")
    doc.footer = data["footer"]
    fr = Frame(M, M + 4 * mm, W - 2 * M - NOTE, H - 2 * M - 4 * mm, id="f", leftPadding=0,
               rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="p", frames=[fr], onPage=on_page)])
    doc.build(story)
    print(os.path.relpath(out, ROOT))

# 원고 → PDF. 인자가 없으면 둘 다 만든다.
JOBS = [("unit6.json", "6과-듣기대본.pdf"), ("unit6-honmun.json", "6과-본문.pdf"),
        ("unit6-all.json", "6과-전체지문.pdf"), ("unit3-all.json", "3과-전체지문.pdf"),
        ("unit4-all.json", "4과-전체지문.pdf"),
        ("kaiwa-all.json", "회화-3·4과-전체지문.pdf")]

if __name__ == "__main__":
    d = os.path.join(ROOT, "docs", "scripts")
    jobs = [(a, b) for a, b in JOBS if len(sys.argv) < 2 or a in sys.argv[1:]]
    for src, out in jobs:
        build(os.path.join(d, src), os.path.join(d, out))
