# -*- coding: utf-8 -*-
"""변형문제 세트(docs/sets/set*.json) → 굿노트용 시험지 PDF.

    FONT_DIR=... python3 tools/sets-pdf.py        # docs/sets/변형문제-N회.pdf

앞쪽은 문제지(답을 적을 빈칸 포함), 새 쪽부터 정답·해설(채점 요소와 부분 점수).
한 줄 안에 한글과 가나·한자가 섞이므로 글자마다 글꼴을 고른다(한글 → 나눔고딕, 가나·한자 → Zen Kaku).
문항 내용의 검증은 tools/check-sets.js 가 한다 — 이 스크립트는 찍기만 한다.
"""
import json, os, re, sys

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table,
                                TableStyle, KeepTogether, PageBreak)
from reportlab.lib.styles import ParagraphStyle

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.environ.get("FONT_DIR", os.path.join(ROOT, "tools", "fonts"))
INK, SOFT, FAINT, RULE, SHU = (colors.HexColor(c) for c in ("#1B2021", "#4A524F", "#8A918D", "#4F8378", "#C8452B"))
LINE = colors.HexColor("#D9DDDB")
CIRC = "①②③④⑤"

for name, fn in (("JA", "ZenKakuGothicNew-Regular.ttf"), ("JAB", "ZenKakuGothicNew-Bold.ttf"),
                 ("KO", "NanumGothic.ttf"), ("KOB", "NanumGothicBold.ttf")):
    pdfmetrics.registerFont(TTFont(name, os.path.join(FONTS, fn)))

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

JA_RE = re.compile(r"[぀-ヿ㐀-鿿々　-〃「-』〒〜！-／：-＠]")

def mix(text, bold=False):
    """글자마다 글꼴 — 가나·한자·일본어 문장부호는 JA, 나머지(한글·숫자·기호)는 KO. [[밑줄]] 과 줄바꿈 처리."""
    ja, ko = ("JAB", "KOB") if bold else ("JA", "KO")
    out, cur, buf = [], None, []
    def flush():
        if buf:
            out.append('<font name="%s">%s</font>' % (cur, esc("".join(buf))))
    i = 0
    while i < len(text):
        if text.startswith("[[", i): flush(); buf.clear(); out.append("<u>"); cur = None; i += 2; continue
        if text.startswith("]]", i): flush(); buf.clear(); out.append("</u>"); cur = None; i += 2; continue
        ch = text[i]
        if ch == "\n": flush(); buf.clear(); out.append("<br/>"); cur = None; i += 1; continue
        f = ja if (JA_RE.match(ch) and ch != "～") else ko
        if f != cur: flush(); buf.clear(); cur = f
        buf.append(ch); i += 1
    flush()
    return "".join(out)

def st(name, size, lead, color=INK, **kw):
    return ParagraphStyle(name, fontName="KO", fontSize=size, leading=lead, textColor=color, **kw)
S = {"title": st("title", 17, 23), "meta": st("meta", 8.5, 12.5, SOFT), "sec": st("sec", 11, 15, RULE),
     "stem": st("stem", 10.5, 15.5), "box": st("box", 11, 17.5), "ch": st("ch", 11, 16.5),
     "tag": st("tag", 7.5, 10, FAINT), "exp": st("exp", 9.5, 14, SOFT), "ans": st("ans", 10, 14.5),
     "foot": st("foot", 8, 11, FAINT)}

W, H = A4
M = 17 * mm
BODY = W - 2 * M

def on_page(c, doc):
    c.saveState(); c.setFont("KO", 7.5); c.setFillColor(FAINT)
    c.drawString(M, 10 * mm, doc.footer); c.drawRightString(W - M, 10 * mm, "%d" % doc.page); c.restoreState()

def boxed(text):
    t = Table([[Paragraph(mix(text), S["box"])]], colWidths=[BODY - 8 * mm])
    t.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 0.6, LINE), ("LEFTPADDING", (0, 0), (-1, -1), 8),
                           ("RIGHTPADDING", (0, 0), (-1, -1), 8), ("TOPPADDING", (0, 0), (-1, -1), 6),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 7)]))
    t.hAlign = "RIGHT"
    return t

def pts(p):
    return ("%.1f" % p).rstrip("0").rstrip(".")

def question(q):
    b = [Paragraph(mix(q["tag"]), S["tag"]),
         Paragraph('<font name="KOB">%d.</font> %s <font color="#8A918D">[%s점]</font>'
                   % (q["no"], mix(q["stem"]), pts(q["pts"])) if "choices" in q else
                   '<font name="KOB">%d.</font> %s' % (q["no"], mix(q["stem"])), S["stem"])]
    if q.get("box"): b += [Spacer(1, 2 * mm), boxed(q["box"])]
    if "choices" in q:
        b.append(Spacer(1, 1.5 * mm))
        for i, c in enumerate(q["choices"]):
            b.append(Paragraph('<font name="KO">%s</font>&nbsp; %s' % (CIRC[i], mix(c)), ParagraphStyle(
                "c", parent=S["ch"], leftIndent=10 * mm, firstLineIndent=-5 * mm)))
    else:
        n = 1 if q["kind"] == "단답형" else 2
        rows = [[""] for _ in range(n)]
        t = Table(rows, colWidths=[BODY - 8 * mm], rowHeights=[11 * mm] * n)
        t.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), 0.6, LINE)]))
        t.hAlign = "RIGHT"
        b += [Spacer(1, 1 * mm), t]
    b.append(Spacer(1, 5 * mm))
    return KeepTogether(b)

def answers(d):
    out = [PageBreak(), Paragraph(mix(d["title"] + " · 정답 및 해설", bold=True), S["title"]), Spacer(1, 4 * mm)]
    mc = [q for q in d["questions"] if "choices" in q]
    head = [Paragraph('<font name="KOB">%d</font>' % q["no"], S["ans"]) for q in mc]
    ans = [Paragraph('<font name="KO">%s</font>' % CIRC[q["answer"] - 1], S["ans"]) for q in mc]
    rows = []
    for k in range(0, len(mc), 11):
        rows += [head[k:k + 11] + [""] * (11 - len(head[k:k + 11])), ans[k:k + 11] + [""] * (11 - len(ans[k:k + 11]))]
    t = Table(rows, colWidths=[BODY / 11] * 11)
    t.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.5, LINE), ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                           ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#EEF3F1")),
                           ("BACKGROUND", (0, 2), (-1, 2), colors.HexColor("#EEF3F1"))]))
    out += [t, Spacer(1, 6 * mm), Paragraph(mix("객관식 해설", bold=True), S["sec"]), Spacer(1, 2 * mm)]
    for q in mc:
        out.append(Paragraph('<font name="KOB">%d. %s</font>&nbsp; %s' % (q["no"], CIRC[q["answer"] - 1], mix(q["exp"])), S["exp"]))
        out.append(Spacer(1, 1.8 * mm))
    out += [Spacer(1, 4 * mm), Paragraph(mix("서답형 모범 답안 · 채점 요소", bold=True), S["sec"]), Spacer(1, 2 * mm)]
    for q in d["questions"]:
        if "choices" in q: continue
        b = [Paragraph('<font name="KOB">%d.</font> <font color="#8A918D">%s %s점</font>&nbsp; %s'
                       % (q["no"], mix(q["kind"]), pts(q["pts"]), mix(q["answer"], bold=True)), S["ans"])]
        parts = " · ".join("%s (%s점)" % (p[0], pts(p[1])) for p in q["parts"])
        b.append(Paragraph(mix("채점: " + parts), S["exp"]))
        if q.get("accept"): b.append(Paragraph(mix("인정: " + " / ".join(q["accept"])), S["exp"]))
        b.append(Paragraph(mix(q["exp"]), S["exp"]))
        b.append(Spacer(1, 3 * mm))
        out.append(KeepTogether(b))
    return out

def build(src, out):
    d = json.load(open(src, encoding="utf-8"))
    story = [Paragraph(mix(d["title"], bold=True), S["title"]),
             Paragraph(mix("범위: " + d["range"]), S["meta"]),
             Paragraph(mix(d["rule"]), S["meta"]), Spacer(1, 2 * mm)]
    name = Table([[Paragraph(mix("학번"), S["meta"]), "", Paragraph(mix("이름"), S["meta"]), "",
                   Paragraph(mix("점수"), S["meta"]), ""]],
                 colWidths=[12 * mm, 30 * mm, 12 * mm, 40 * mm, 12 * mm, 25 * mm], hAlign="LEFT")
    name.setStyle(TableStyle([("LINEBELOW", (1, 0), (1, 0), 0.6, LINE), ("LINEBELOW", (3, 0), (3, 0), 0.6, LINE),
                              ("LINEBELOW", (5, 0), (5, 0), 0.6, LINE)]))
    nmc = sum(1 for q in d["questions"] if "choices" in q)
    head1 = "Ⅰ. 선택형 (1~%d번%s)" % (nmc, "" if d.get("drill") else ", 50점")
    story += [name, Spacer(1, 6 * mm), Paragraph(mix(head1, bold=True), S["sec"]), Spacer(1, 3 * mm)]
    for q in d["questions"]:
        if d.get("drill") and q["no"] == nmc + 1:
            story += [Spacer(1, 2 * mm), Paragraph(mix("Ⅱ. 서답형 (%d~%d번)" % (nmc + 1, len(d["questions"])), bold=True), S["sec"]), Spacer(1, 3 * mm)]
        if not d.get("drill") and q["no"] == 22:
            story += [Spacer(1, 2 * mm), Paragraph(mix("Ⅱ. 서답형 (22~30번, 50점) — 단답형 22~26번 20점 · 서술형 27~30번 30점", bold=True), S["sec"]),
                      Paragraph(mix("부분 점수가 있습니다. 아는 어휘·조사는 최대한 쓰세요. 서술형은 교과서 본문 표현으로 씁니다."), S["meta"]),
                      Spacer(1, 3 * mm)]
        story.append(question(q))
    story += answers(d)
    story += [Spacer(1, 4 * mm), Paragraph(mix("문항은 교과서 본문·듣기 지문과 선생님 시험 안내를 바탕으로 만든 연습용 변형 문제입니다. "
                                               "활용형·동사 종류·가나 답은 일본어 시험 앱의 활용·채점 규칙으로 다시 계산해 확인했습니다(tools/check-sets.js)."), S["foot"])]
    doc = BaseDocTemplate(out, pagesize=A4, leftMargin=M, rightMargin=M, topMargin=M, bottomMargin=M + 3 * mm,
                          title=d["title"], author="일본어 시험 대비")
    doc.footer = d["title"]
    fr = Frame(M, M + 3 * mm, BODY, H - 2 * M - 3 * mm, id="f", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="p", frames=[fr], onPage=on_page)])
    doc.build(story)
    print(os.path.relpath(out, ROOT))

if __name__ == "__main__":
    d = os.path.join(ROOT, "docs", "sets")
    for f in sorted(os.listdir(d)):
        m = re.match(r"set(\d+)\.json$", f)
        if m: build(os.path.join(d, f), os.path.join(d, "변형문제-%s회.pdf" % m.group(1)))
        if f == "drill-te.json": build(os.path.join(d, f), os.path.join(d, "음편-て형-10문항.pdf"))
        if f == "drill-te2.json": build(os.path.join(d, f), os.path.join(d, "음편-て형-10문항-2회.pdf"))
        if f == "drill-weak.json": build(os.path.join(d, f), os.path.join(ROOT, "docs", "study", "4-자주틀리는유형-보충10문항.pdf"))
        if f == "drill-mywords.json": build(os.path.join(d, f), os.path.join(d, "내-약한단어-20문항.pdf"))
