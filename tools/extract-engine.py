#!/usr/bin/env python3
"""index.html 의 순수 함수 구간(채점기 · 로마자 변환기 · 활용 엔진)과 데이터를
   묶어 node 로 테스트할 수 있게 뽑는다.

    python3 tools/extract-engine.py > /tmp/engine.js
    node tools/test-engine.js /tmp/engine.js
"""
import io, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")

out = []
for f in ("data/words.js", "data/verbs.js"):
    out.append(io.open(os.path.join(ROOT, f), encoding="utf-8").read())

h = io.open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
js = h.split("<script>\n(function(){")[1]
a = js.index("/* ══ 가나 채점")
b = js.index("/* ══ 세 시험 ══ */")
out.append(js[a:b])

out.append("module.exports={judge:judge,toKana:toKana,norm:norm,"
           "stem:stem,conj:conj,deconj:deconj,verbDataErrors:verbDataErrors,"
           "WORDS:WORDS,UNITS:UNITS,VERBS:VERBS,FORMS:FORMS};\n")

sys.stdout.write("\n".join(out))
