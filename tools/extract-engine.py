#!/usr/bin/env python3
"""index.html 에서 순수 함수 구간(채점기 + 로마자 변환기)만 뽑아 node 로 테스트할 수 있게 한다.

    python3 tools/extract-engine.py > /tmp/engine.js && node tools/test-engine.js /tmp/engine.js
"""
import io, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
s = io.open(os.path.join(HERE, "..", "index.html"), encoding="utf-8").read()
js = s.split("<script>\n(function(){")[1]
a = js.index("/* ══ 가나 채점")
b = js.index("/* ══ 설정 ══ */")
sys.stdout.write(js[a:b])
sys.stdout.write("module.exports={judge:judge,toKana:toKana,norm:norm,confusablePair:confusablePair};\n")
