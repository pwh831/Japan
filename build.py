#!/usr/bin/env python3
"""data/words.js 를 index.html 안에 넣어 단일 파일을 만든다.

파일 하나만 옮기면 되므로 폴더 구조가 깨지거나 상대 경로가 어긋날 여지가 없다.
Jiri(지역이해 암기 퀴즈)와 같은 방식.

    python3 build.py   →  일본어-단어시험.html
"""
import io, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(HERE, "index.html")
DATA = os.path.join(HERE, "data", "words.js")
OUT  = os.path.join(HERE, "일본어-단어시험.html")
TAG  = '<script src="data/words.js"></script>'

def main():
    html = io.open(SRC, encoding="utf-8").read()
    data = io.open(DATA, encoding="utf-8").read()

    if TAG not in html:
        sys.exit("index.html 에서 %s 를 찾지 못했습니다." % TAG)

    # </script> 가 데이터 안에 있으면 인라인 시 스크립트가 일찍 닫힌다
    if "</script" in data:
        sys.exit("data/words.js 안에 </script 가 있습니다. 문자열을 쪼개 주세요.")

    html = html.replace(TAG, "<script>\n" + data + "\n</script>")
    io.open(OUT, "w", encoding="utf-8").write(html)

    n = data.count('{ id:"')
    print("%s  (%.0f KB · 단어 %d)" % (os.path.basename(OUT), len(html.encode("utf-8")) / 1024, n))

if __name__ == "__main__":
    main()
