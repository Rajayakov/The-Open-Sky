#!/usr/bin/env python3
"""Урезает Noto Serif JP / Noto Sans JP (400 и 700) под символы японской страницы -> public/annapurna-2027/ja/fonts/*.woff2
Исходники TTF: npm pack @expo-google-fonts/noto-serif-jp @expo-google-fonts/noto-sans-jp, из архивов взять 400Regular и 700Bold.
  python3 scripts/i18n-ja/subset-fonts.py ПАПКА_С_TTF     (внутри serif/400Regular/NotoSerifJP_400Regular.ttf и т.д.)
После правки японского текста запускать заново: новые иероглифы попадут в подмножество.
Латиница и цифры берутся из Caladea/Carlito (en/fonts), здесь только японское."""
import sys, os, re
from fontTools import subset
from fontTools.ttLib import TTFont
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '../..'))
SRC = sys.argv[1]; OUT = os.path.join(ROOT, 'public/annapurna-2027/ja/fonts'); os.makedirs(OUT, exist_ok=True)
page = open(os.path.join(ROOT, 'src/pages/mountains/annapurna-2027-ja.html'), encoding='utf-8').read()
# Японский вебшрифт нужен только для заголовков (серифные элементы). Основной текст набирается системными шрифтами:
# так страница лёгкая, а на устройствах в Японии (Hiragino, Yu Gothic, Noto CJK) они и так хорошие.
from bs4 import BeautifulSoup
soup = BeautifulSoup(page, 'html.parser')
SERIF = 'h1,h2,h3,.sub,.dates .big,.who,.quote .q,.day .pl,.day .dn b,.pc .amt,.join-line,.join-q,.closing .msg,.guide .ds,.note b,.dp .a,.dp .b,.deep-h3,.facts dd,.stats b,.navy .quote p,.bf b,.map text,.chart text,.guide h3'
chars = set()
for el in soup.select(SERIF): chars |= {c for c in el.get_text() if ord(c) > 0x7f}
chars |= set('・、。「」『』（）〜：')
def run(path, out, text):
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']; opts.notdef_outline = True
    opts.name_IDs = [1, 2]; opts.drop_tables += ['DSIG']; opts.hinting = False
    f = TTFont(path); s = subset.Subsetter(opts); s.populate(text=text); s.subset(f)
    f.flavor = 'woff2'; f.save(out); print(os.path.basename(out), os.path.getsize(out) // 1024, 'KB')
text = ''.join(sorted(chars))
run(os.path.join(SRC, 'serif/400Regular/NotoSerifJP_400Regular.ttf'), os.path.join(OUT, 'noto-serif-jp-400.woff2'), text)
run(os.path.join(SRC, 'sans/700Bold/NotoSansJP_700Bold.ttf'), os.path.join(OUT, 'label-700.woff2'), '日本語')
print('символов:', len(chars))
