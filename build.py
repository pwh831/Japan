#!/usr/bin/env python3
"""데이터 파일을 index.html 안에 넣어 단일 파일을 만든다.

파일 하나만 옮기면 되므로 폴더 구조가 깨지거나 상대 경로가 어긋날 여지가 없다.
Jiri(지역이해 암기 퀴즈)와 같은 방식.

    python3 build.py   →  일본어-단어시험.html

⚠️ 데이터 파일이 늘면 DATA 목록에 반드시 추가한다.
   빠뜨리면 산출물에 <script src="..."> 가 남아, 파일 하나만 옮겼을 때
   그 변수가 undefined 가 되어 앱 전체가 죽는다. 마지막 단언이 그것을 막는다.
"""
import io, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(HERE, "index.html")
OUT  = os.path.join(HERE, "일본어-단어시험.html")
DATA = ["data/words.js", "data/verbs.js"]      # data/phrases.js 는 M7 예정

def main():
    html = io.open(SRC, encoding="utf-8").read()

    for rel in DATA:
        tag = '<script src="%s"></script>' % rel
        if tag not in html:
            sys.exit("index.html 에 %s 가 없습니다. DATA 목록과 어긋났습니다." % tag)
        data = io.open(os.path.join(HERE, rel), encoding="utf-8").read()
        if "</script" in data:
            sys.exit("%s 안에 </script 가 있습니다. 문자열을 쪼개 주세요." % rel)
        html = html.replace(tag, "<script>\n" + data + "\n</script>")

    # 파일 하나로 도는지 여기서 못 박는다. 이 단언이 없어서 verbs.js 누락을 놓쳤다.
    if "<script src=" in html:
        left = [l.strip() for l in html.splitlines() if "<script src=" in l]
        sys.exit("산출물에 외부 스크립트가 남았습니다 — 파일 하나로 안 돕니다:\n  "
                 + "\n  ".join(left))

    io.open(OUT, "w", encoding="utf-8").write(html)
    print("%s  (%.0f KB · 데이터 %d개 인라인)"
          % (os.path.basename(OUT), len(html.encode("utf-8")) / 1024, len(DATA)))

if __name__ == "__main__":
    main()
