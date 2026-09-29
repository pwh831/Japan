#!/usr/bin/env python3
"""변형 출제실(studio/index.html)이 읽는 파일을 만든다.

    python3 tools/build-studio.py            # studio/source.js
    python3 tools/build-studio.py --fonts    # + studio/fonts/*.ttf (PDF 받기용)

source.js — 앱과 같은 데이터(단어장·활용표·표현)와 앱의 채점·활용 엔진, 교과서 전체 지문(3과·4과·6과).
  출제실은 이 엔진으로 Claude가 낸 활용형 정답을 다시 계산해 맞는지 본다.
  엔진을 두 벌로 적지 않으려고 index.html 에서 그대로 잘라 온다(extract-engine.py 와 같은 구간).

fonts — PDF 에 벡터 글자로 넣을 글꼴. 한글(나눔고딕)과 일본어(Zen Kaku Gothic New)를 따로 쓴다.
  통째로 넣으면 4개에 14MB 라 쓰는 글자만 남긴다: 한글 2350자(KS X 1001), 가나,
  JIS 제1수준 한자 2965자, 기호. 원본 글꼴은 FONT_DIR(기본 tools/fonts/)에 둔다 — 저장소에는 넣지 않는다.
"""
import io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
OUT = os.path.join(ROOT, "studio")


def source():
    parts = []
    for f in ("data/words.js", "data/verbs.js", "data/phrases.js"):
        parts.append(io.open(os.path.join(ROOT, f), encoding="utf-8").read())
    h = io.open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    js = h.split("<script>\n(function(){")[1]
    a, b = js.index("/* ══ 가나 채점"), js.index("/* ══ 세 시험 ══ */")
    parts.append("/* ══ 앱 엔진 (index.html 에서 그대로) ══ */\n" + js[a:b])
    # 원고의 후리가나 「日本{にほん}」는 출제 자료에서 「日本(にほん)」로 적는다
    ruby = lambda o: (re.sub(r"\{([^}]+)\}", r"(\1)", o) if isinstance(o, str)
                      else [ruby(x) for x in o] if isinstance(o, list)
                      else {k: ruby(v) for k, v in o.items()} if isinstance(o, dict) else o)
    keep = []
    for unit, fn in (("t3", "unit3-all.json"), ("t4", "unit4-all.json"), ("t6", "unit6-all.json")):
        texts = json.load(io.open(os.path.join(ROOT, "docs", "scripts", fn), encoding="utf-8"))
        keep += [dict(unit=unit, **{k: ruby(s[k]) for k in ("page", "track", "task", "sub", "audio_only", "items", "words") if k in s})
                 for s in texts["sections"]]
    parts.append("/* 교과서 전체 지문 — docs/scripts/unit3-all.json · unit4-all.json · unit6-all.json */\nvar TEXTS = "
                 + json.dumps(keep, ensure_ascii=False) + ";\n")
    os.makedirs(OUT, exist_ok=True)
    p = os.path.join(OUT, "source.js")
    io.open(p, "w", encoding="utf-8").write("\n".join(parts))
    print("%s  (%d KB)" % (os.path.relpath(p, ROOT), os.path.getsize(p) // 1024))


def fonts():
    from fontTools import subset
    src = os.environ.get("FONT_DIR", os.path.join(HERE, "fonts"))
    ko = set()
    for hi in range(0xB0, 0xC9):                     # KS X 1001 한글 2350자
        for lo in range(0xA1, 0xFF):
            try: ko.add(bytes([hi, lo]).decode("euc_kr"))
            except UnicodeDecodeError: pass
    ja = set(chr(c) for c in range(0x3041, 0x3097)) | set(chr(c) for c in range(0x30A1, 0x30FB))
    for hi in range(0xB0, 0xD0):                     # JIS X 0208 제1수준 한자
        for lo in range(0xA1, 0xFF):
            try: ja.add(bytes([hi, lo]).decode("euc_jp"))
            except UnicodeDecodeError: pass
    # 자료에 실제로 나오는 한자는 수준과 상관없이 넣는다
    for ch in io.open(os.path.join(OUT, "source.js"), encoding="utf-8").read():
        if "㐀" <= ch <= "鿿": ja.add(ch)
    common = set(chr(c) for c in range(0x20, 0x7F)) | set("ー・、。「」『』（）〈〉《》【】〜～！？…‥①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳○×→←↔·—–‘’“”※★☆□■◎△▲▽")
    ko |= common | set("ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ")
    ja |= common
    jobs = [("NanumGothic.ttf", "KoR.ttf", ko), ("NanumGothicBold.ttf", "KoB.ttf", ko),
            ("ZenKakuGothicNew-Regular.ttf", "JaR.ttf", ja), ("ZenKakuGothicNew-Bold.ttf", "JaB.ttf", ja)]
    os.makedirs(os.path.join(OUT, "fonts"), exist_ok=True)
    for a, b, chars in jobs:
        opt = subset.Options(); opt.name_IDs = ["*"]; opt.notdef_outline = True; opt.layout_features = ["*"]; opt.hinting = False
        font = subset.load_font(os.path.join(src, a), opt)
        s = subset.Subsetter(opt); s.populate(unicodes=[ord(c) for c in chars]); s.subset(font)
        p = os.path.join(OUT, "fonts", b)
        subset.save_font(font, p, opt)
        print("%s  (%d KB, %d자)" % (os.path.relpath(p, ROOT), os.path.getsize(p) // 1024, len(chars)))


if __name__ == "__main__":
    source()
    if "--fonts" in sys.argv:
        fonts()
