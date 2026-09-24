# -*- coding: utf-8 -*-
"""교과서 듣기 대본을 굿노트에서 볼 PDF 로 만든다.

교과서 PDF 에는 듣기 문제의 대화문이 없다(음성으로만 나온다). 능률 NE Books 의
음성을 Whisper 로 받아적고 사람이 교과서 표기(히라가나 띄어쓰기)로 다듬은 것이
docs/scripts/unit6.json 이고, 이 스크립트는 그걸 A4 로 찍기만 한다.

한국어 발음은 앱과 같은 함수(pron)로 만든다 — annotate-pdf.py 와 같은 이유.
"""
import json, os, subprocess, sys

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

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

S = {
    "unit":  ParagraphStyle("unit", fontName="KOB", fontSize=10, textColor=RULE, leading=14),
    "h1":    ParagraphStyle("h1", fontName="JAB", fontSize=22, textColor=INK, leading=30),
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
    body = [Paragraph(esc(ja), S["ja"])]
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
    note = "음성 %s" % sec["track"]
    cells = [Paragraph("p.%s" % sec["page"], S["page"]), Paragraph(esc(note), S["sub"])]
    widths = [16 * mm, 20 * mm]
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

    # 발음은 한 번에 — node 를 줄마다 띄우면 느리다
    flat = []
    for sec in data["sections"]:
        for it in sec.get("items", []):
            for ln in it["lines"]: flat.append(ln[1])
        for w in sec.get("words", []): flat.append(w[0].split(" ", 1)[-1])
    prs = iter(pronounce(flat))

    story = [Paragraph(esc(data["unit"]), S["unit"]),
             Paragraph('%s <font name="KOB" size="15" color="#4A524F">%s</font>'
                       % (esc(data["title_ja"]), esc(data["title_ko"])), S["h1"]),
             Spacer(1, 2 * mm),
             Paragraph(esc(data["lead"]), S["lead"]),
             Spacer(1, 7 * mm)]

    for sec in data["sections"]:
        head = [page_tag(sec), Spacer(1, 2 * mm), Paragraph(esc(sec["task"]), S["task"])]
        if sec.get("sub"): head.append(Paragraph(esc(sec["sub"]), S["sub"]))
        head.append(Spacer(1, 3 * mm))
        blocks = []
        for it in sec.get("items", []):
            b = []
            if it.get("no"): b.append(Paragraph(esc(it["no"]), S["no"]))
            for spk, ja, ko in it["lines"]:
                b.append(line_block(spk, ja, next(prs), ko))
            if it.get("answer"): b.append(Paragraph(esc(it["answer"]), S["ans"]))
            b.append(Spacer(1, 2.5 * mm))
            blocks.append(b)                     # 날것의 목록 — KeepTogether 를 겹치면 쪽이 통째로 넘어간다
        if sec.get("words"):
            rows = []
            for ja, ko in sec["words"]:
                pr = next(prs)
                rows.append([Paragraph(esc(ja), S["word"]),
                             Paragraph(esc(ko_punct(pr)), S["pr"]), Paragraph(esc(ko), S["wko"])])
            wt = Table(rows, colWidths=[46 * mm, 34 * mm, W - 2 * M - NOTE - 80 * mm])
            wt.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                                    ("LINEBELOW", (0, 0), (-1, -1), 0.3, colors.HexColor("#E3E6E4")),
                                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                                    ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]))
            blocks.append([wt])
        # 제목이 쪽 끝에 홀로 남지 않게 첫 덩어리와 묶는다
        story.append(KeepTogether(head + (blocks[0] if blocks else [])))
        story += [KeepTogether(b) for b in blocks[1:]]
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

if __name__ == "__main__":
    build(os.path.join(ROOT, "docs", "scripts", "unit6.json"),
          os.path.join(ROOT, "docs", "scripts", "6과-듣기대본.pdf"))
