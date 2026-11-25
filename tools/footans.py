# -*- coding: utf-8 -*-
"""정답을 그 쪽 맨 아래에 작게 모으는 장치 — script-pdf.py(전체 지문) · sets-pdf.py(변형문제)가 같이 쓴다.

문제 자리에는 Mark 를 둔다. Mark 는 실제로 그려지는 순간 자기 쪽 번호를 알게 되므로
(KeepTogether 로 다음 쪽에 밀려도) 그 쪽에서 몇 번째 답인지 정하고, 문제 옆에 작은 '정답 n' 을 찍고,
답을 그 쪽 목록에 올린다. 쪽이 끝날 때(onPageEnd) paint() 가 목록을 쪽 아래 띠에 찍는다.

띠 높이는 미리 알 수 없어서 build_fitting() 이 '가장 많이 필요한 쪽'에 맞을 때까지 몇 번 다시 만든다.
"""
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import Flowable, Paragraph, Table, TableStyle

SHU = colors.HexColor("#C8452B")
RULE = colors.HexColor("#E3E6E4")


class Sink:
    def __init__(self):
        self.pages, self.need = {}, 0.0

    def reset(self):
        self.pages, self.need = {}, 0.0


class Mark(Flowable):
    """문제 옆(오른쪽 끝)에 작은 '정답 n ↓'. 높이는 작은 한 줄."""
    def __init__(self, sink, html, h=3.6 * mm):
        Flowable.__init__(self)
        self.sink, self.html, self.h = sink, html, h

    def wrap(self, aw, ah):
        self.aw = aw
        return (aw, self.h)

    def draw(self):
        page = self.canv.getPageNumber()
        lst = self.sink.pages.setdefault(page, [])
        lst.append(self.html)
        c = self.canv
        c.saveState()
        c.setFont("KO", 6.5); c.setFillColor(SHU)
        c.drawRightString(self.aw, 0.9 * mm, "정답 %d ↓" % len(lst))
        c.restoreState()


def paint(c, sink, page, x, y_top, width, style, draw=True):
    """y_top 에서 아래로 답 목록을 찍는다. 필요한 높이를 돌려준다(없으면 0)."""
    items = sink.pages.get(page) or []
    if not items:
        return 0.0
    # 두 칸 표 — 한 줄로 이어 쓰면 번호와 답이 줄바꿈에서 떨어진다. 왼쪽 칸을 먼저 위에서 아래로 채운다.
    cells = [Paragraph('<font name="KOB" color="#C8452B">%d</font>&nbsp; %s' % (i + 1, h), style)
             for i, h in enumerate(items)]
    half = (len(cells) + 1) // 2
    rows = [[cells[r], cells[r + half] if r + half < len(cells) else ""] for r in range(half)]
    t = Table(rows, colWidths=[width / 2] * 2)
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                           ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm), ("TOPPADDING", (0, 0), (-1, -1), 0.4 * mm),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 0.4 * mm)]))
    w, h = t.wrap(width, 400 * mm)
    need = h + 2.6 * mm
    sink.need = max(sink.need, need)
    if draw:
        c.saveState()
        c.setStrokeColor(RULE); c.setLineWidth(0.5); c.setDash(2, 2)
        c.line(x, y_top, x + width, y_top)
        c.setFont("KOB", 6.5); c.setFillColor(colors.HexColor("#8A918D"))
        c.drawRightString(x + width, y_top + 1 * mm, "정답")
        c.restoreState()
        t.drawOn(c, x, y_top - 1.6 * mm - h)
    return need


def build_fitting(make, sink, band0=14 * mm, tries=5):
    """make(band) 는 띠 높이 band 로 문서를 만든다. 띠가 모자라면 넓혀서 다시."""
    band = band0
    for _ in range(tries):
        sink.reset()
        make(band)
        if sink.need <= band + 0.01:
            return band
        band = sink.need + 1 * mm
    sink.reset()
    make(band)
    return band
