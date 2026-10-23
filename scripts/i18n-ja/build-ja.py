#!/usr/bin/env python3
"""Собирает японскую страницу из EN-лендинга и перевода (формат `[ID] текст`),
обновляет переключатель RU|EN|日本語 и подсказку языка во всех трёх страницах.

  python3 scripts/i18n-ja/extract.py                      # карта map.json из EN (один раз, после правок EN)
  python3 scripts/i18n-ja/build-ja.py путь/к/переводу.txt  # собрать annapurna-2027-ja.html
  python3 scripts/i18n-ja/subset-fonts.py                  # шрифты под символы страницы

EN-файл не пересобирается парсером: меняются только куски текста по точным смещениям."""
import re, json, sys, os, html
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '../..'))
PG = os.path.join(ROOT, 'src/pages/mountains')
PATH = {'ru': 'annapurna-2027.html', 'en': 'annapurna-2027-en.html', 'ja': 'annapurna-2027-ja.html'}
URL = {'ru': '/mountains/annapurna-2027', 'en': '/mountains/annapurna-2027-en', 'ja': '/mountains/annapurna-2027-ja'}
BASE = 'https://theopensky.vercel.app'
PREFIX = {'HERO': 'hero', 'LETTER': 'letter', 'TRAIL': 'trail', 'ROUTE': 'route', 'DAYS': 'days', 'IMMERSION': 'immersion',
          'GUIDES': 'guides', 'SAFETY': 'safety', 'PRICE': 'price', 'NOTINC': 'not-included', 'JOIN': 'join', 'CLOSING': 'closing'}

# ---------- общее для всех трёх страниц ----------
LANG_LABEL = {'ru': 'Язык страницы', 'en': 'Page language', 'ja': 'ページの言語'}
TIP = {  # куда предложить перейти: (текст, название ссылки, aria закрытия)
    'ru': ('Эта страница есть на русском.', 'Русский'),
    'en': ('This page is also available in English.', 'English'),
    'ja': ('このページは日本語でもご覧いただけます。', '日本語'),
}
CLOSE = {'ru': 'Закрыть', 'en': 'Close', 'ja': '閉じる'}

def switcher(cur):
    def a(l, name):
        c = ' aria-current="page"' if l == cur else ''
        return f'<a href="{URL[l]}" hreflang="{l}" lang="{l}" data-lang="{l}"{c}>{name}</a>'
    return f'<div class="lang" role="group" aria-label="{LANG_LABEL[cur]}">{a("ru","RU")}{a("en","EN")}{a("ja","日本語")}</div>'

def lang_script(cur):
    tips = json.dumps({k: {'t': v[0], 'a': v[1], 'u': URL[k], 'c': CLOSE[cur]} for k, v in TIP.items()}, ensure_ascii=False)
    return ("<script>\n(function(){\n  var KEY='ap27-lang', CUR='%s';\n  var TIP=%s;\n" % (cur, tips) + r"""  function get(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function put(v){try{localStorage.setItem(KEY,v)}catch(e){}}
  function sectionId(){
    if(window.scrollY<240) return '';
    var y=window.innerHeight*.35, cur='', els=document.querySelectorAll('section[id],#last');
    for(var i=0;i<els.length;i++){ if(els[i].getBoundingClientRect().top<=y) cur=els[i].id; }
    return cur;
  }
  function target(a){
    var id=sectionId(), to=a.getAttribute('data-lang');
    if(to==='ru'){ if(id==='immersion') id='deepening'; } else if(id==='deepening') id='immersion';
    return a.getAttribute('href').split('#')[0]+(id?'#'+id:'');
  }
  document.querySelectorAll('.lang a').forEach(function(a){
    a.addEventListener('click',function(){ put(a.getAttribute('data-lang')); a.setAttribute('href',target(a)); });
  });
  try{
    if(get()) return;
    var l=(navigator.languages&&navigator.languages[0])||navigator.language||'';
    if(!l) return;
    var pref=/^ja/i.test(l)?'ja':/^(ru|uk|be|kk|ky|tg)/i.test(l)?'ru':'en';
    if(pref===CUR) return;
    var T=TIP[pref], t=document.createElement('div');
    t.className='lang-tip'; t.setAttribute('role','status');
    var s=document.createElement('span'); s.textContent=T.t;
    var a=document.createElement('a'); a.href=T.u; a.setAttribute('hreflang',pref); a.setAttribute('data-lang',pref); a.textContent=T.a;
    var b=document.createElement('button'); b.type='button'; b.setAttribute('aria-label',T.c); b.textContent='×';
    a.addEventListener('click',function(){ put(pref); a.setAttribute('href',target(a)); });
    b.addEventListener('click',function(){ put(CUR); t.remove(); });
    t.appendChild(s); t.appendChild(a); t.appendChild(b);
    document.body.appendChild(t);
  }catch(e){}
})();
</script>""")

LABEL_CSS = ("@font-face{font-family:'JPLabel';font-style:normal;font-weight:700;font-display:swap;"
             "src:url(/annapurna-2027/ja/fonts/label-700.woff2) format('woff2')}\n")
LABEL_RULE = (".lang a[lang=ja]{font-family:'JPLabel','Noto Sans JP','Hiragino Sans','Yu Gothic',sans-serif;letter-spacing:.04em}\n")

def common(src, cur):
    """переключатель из трёх языков, подсказка, hreflang ja, отступ меню под широкий переключатель"""
    s = src
    s = re.sub(r'<div class="lang"[^>]*>.*?</div>', lambda m: switcher(cur), s, count=1, flags=re.S)
    s = re.sub(r"<script>\n\(function\(\)\{\n  var KEY='ap27-lang'.*?</script>", lambda m: lang_script(cur), s, count=1, flags=re.S)
    # hreflang: ru, en, ja, x-default(en)
    s = re.sub(r'<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?', '', s)
    block = ''.join(f'<link rel="alternate" hreflang="{l}" href="{BASE}{URL[l]}">\n' for l in ('ru', 'en', 'ja')) + \
            f'<link rel="alternate" hreflang="x-default" href="{BASE}{URL["en"]}">\n'
    s = re.sub(r'(<link rel="canonical"[^>]*>\n)', lambda m: m.group(1) + block, s, count=1)
    s = s.replace('@media (max-width:1180px){.nav{padding-right:7.5rem}}', '@media (max-width:1180px){.nav{padding-right:11.5rem}}')
    if 'JPLabel' not in s:
        s = s.replace('</style>', LABEL_CSS + LABEL_RULE + '</style>', 1)
    return s

# ---------- японская страница ----------
def build_ja():
    EN = open(f'{PG}/{PATH["en"]}', encoding='utf-8').read()
    mp = json.load(open(f'{HERE}/map.json', encoding='utf-8'))
    tr = {}
    for m in re.finditer(r'^\[([A-Z]+-\d{3})\]\s*(?:\[(?:alt|aria)\]\s*)?(.*)$', open(sys.argv[1], encoding='utf-8').read(), re.M):
        tr[m.group(1)] = m.group(2).strip()
    OVER = {'HERO-021': 'とともに', 'ROUTE-018': '日目', 'ROUTE-075': '日目'}  # правки к присланному переводу
    tr.update(OVER)
    miss = [i for i in mp if i not in tr and not i.startswith('UI')]
    assert not miss, f'нет перевода: {miss}'
    for i, v in mp.items():  # числа из EN должны сохраниться
        if i.startswith('UI') or i in OVER: continue
        for n in [x.rstrip(',') for x in re.findall(r'\d[\d,]*', v['orig'])]:
            if n not in tr[i]: print('ЧИСЛО?', i, n, '|', v['orig'][:50], '|', tr[i][:50])

    repl, expect = {}, {}
    for i, v in mp.items():
        if i.startswith('UI'): continue
        sec = PREFIX.get(i.split('-')[0])
        for l in v['locs']:
            k = l['kind']
            if k in ('text', 'svgtext'):
                repl[(sec, v['orig'], 'text')] = i
                expect[i] = expect.get(i, 0) + (len(l['loc']['nodes']) if k == 'svgtext' else 1)
            elif k == 'attr':
                repl[(sec, v['orig'], l['loc']['attr'])] = i
                expect[i] = expect.get(i, 0) + 1
    edits, hits = [], {}

    class P(HTMLParser):
        def __init__(s, src):
            super().__init__(convert_charrefs=False)
            s.src, s.sec, s.run, s.skip = src, 'hero', None, 0
            s.ls = [0] + [m.end() for m in re.finditer('\n', src)]
        def off(s):
            l, c = s.getpos(); return s.ls[l - 1] + c
        def flush(s):
            if s.run is None: return
            a, b = s.run; s.run = None
            if s.skip: return
            raw = s.src[a:b]
            flat = re.sub(r'\s+', ' ', html.unescape(raw)).strip()
            i = repl.get((s.sec, flat, 'text'))
            if i:
                lead = len(raw) - len(raw.lstrip()); trail = len(raw) - len(raw.rstrip())
                edits.append((a + lead, b - trail, html.escape(tr[i], quote=False))); hits[i] = hits.get(i, 0) + 1
        def addrun(s, a, b):
            if s.run and s.run[1] == a: s.run = (s.run[0], b)
            else: s.flush(); s.run = (a, b)
        def handle_data(s, d): a = s.off(); s.addrun(a, a + len(d))
        def handle_entityref(s, n): a = s.off(); s.addrun(a, a + re.match(r'&\w+;?', s.src[a:]).end())
        def handle_charref(s, n): a = s.off(); s.addrun(a, a + re.match(r'&#\w+;?', s.src[a:]).end())
        def handle_comment(s, d): s.flush()
        def handle_decl(s, d): s.flush()
        def handle_pi(s, d): s.flush()
        def handle_starttag(s, tag, attrs):
            s.flush(); a = s.off(); raw = s.get_starttag_text()
            if tag == 'section':
                d = dict(attrs)
                if d.get('id'): s.sec = d['id']
            elif tag == 'header': s.sec = 'hero'
            elif tag == 'footer': s.sec = 'closing'
            if tag in ('script', 'style'): s.skip += 1
            for name, val in attrs:
                if name in ('alt', 'aria-label') and val:
                    i = repl.get((s.sec, re.sub(r'\s+', ' ', val).strip(), name))
                    if i:
                        m = re.search(r'(?<![\w-])' + name + r'\s*=\s*(["\'])(.*?)\1', raw, re.S)
                        edits.append((a + m.start(2), a + m.end(2), html.escape(tr[i], quote=True))); hits[i] = hits.get(i, 0) + 1
        def handle_endtag(s, tag):
            s.flush()
            if tag in ('script', 'style'): s.skip = max(0, s.skip - 1)
    p = P(EN); p.feed(EN); p.close(); p.flush()

    for i, v in mp.items():  # title и meta
        for l in v['locs']:
            if l['kind'] == 'title':
                m = re.search(r'<title>(.*?)</title>', EN, re.S); edits.append((m.start(1), m.end(1), html.escape(tr[i], quote=False)))
            elif l['kind'] == 'meta':
                m = re.search(r'<meta (?:property|name)="' + re.escape(l['loc']['key']) + r'" content="(.*?)"', EN)
                edits.append((m.start(1), m.end(1), html.escape(tr[i], quote=True)))
    bad = [(i, expect[i], hits.get(i, 0)) for i in expect if hits.get(i, 0) != expect[i]]
    for b in bad: print('ВСТАВКА?', b)
    out = EN
    for a, b, t in sorted(edits, reverse=True): out = out[:a] + t + out[b:]
    print(f'вставок: {len(edits)}, расхождений: {len(bad)}')

    def sub1(pat, rep, s, flags=0):
        n = len(re.findall(pat, s, flags)); assert n >= 1, f'не найдено: {pat[:60]}'
        return re.sub(pat, rep, s, count=1, flags=flags)
    out = out.replace('<html lang="en">', '<html lang="ja">')
    out = out.replace('content="en_US"', 'content="ja_JP"')
    out = re.sub(r'(<link rel="canonical" href="[^"]*)-en(">)', r'\1-ja\2', out)
    out = re.sub(r'(<meta property="og:url" content="[^"]*)-en(">)', r'\1-ja\2', out)
    # шрифты: латиница остаётся Caladea/Carlito, японское берётся из Noto JP (подмножество)
    out = re.sub(r'<link rel="preload" href="/annapurna-2027/en/fonts/[a-z]+-latin-400-italic\.woff2"[^>]*>\n', '', out)
    out = re.sub(r"@font-face\{font-family:'(?:Caladea|Carlito)';font-style:italic[^\n]*\n", '', out)
    pre = ''.join(f'<link rel="preload" href="/annapurna-2027/ja/fonts/{f}.woff2" as="font" type="font/woff2" crossorigin>\n'
                  for f in ('noto-serif-jp-400',))
    out = sub1(r'(<link rel="preload" href="/annapurna-2027/en/fonts/carlito-latin-700-normal\.woff2"[^>]*>\n)', lambda m: m.group(1) + pre, out)
    ff = ''.join(f"@font-face{{font-family:'Noto {fam} JP';font-style:normal;font-weight:{w};font-display:swap;src:url(/annapurna-2027/ja/fonts/noto-{fam.lower()}-jp-{w}.woff2) format('woff2')}}\n"
                 for fam, w in (('Serif', 400),))
    out = sub1(r"(@font-face\{font-family:'Carlito';font-style:normal;font-weight:700[^\n]*\n)", lambda m: m.group(1) + ff, out)
    # byline: «имена とともに»
    out = sub1(r'<p class="who"><span class="with">([^<]*)</span><span class="nm">([^<]*)</span></p>',
               lambda m: f'<p class="who"><span class="nm">{m.group(2)}</span><span class="with">{m.group(1)}</span></p>', out)
    out = out.replace('<span class="nm">Yakov Rajuna、Akari Tamura</span>', '<span class="nm">Yakov Rajuna、Akari Tamura</span>')
    css = open(f'{HERE}/ja.css', encoding='utf-8').read()
    out = out.replace('</style>', css + '</style>', 1)
    out = common(out, 'ja')
    open(f'{PG}/{PATH["ja"]}', 'w', encoding='utf-8').write(out)
    print('записан', PATH['ja'], len(out), 'байт')

if __name__ == '__main__':
    if len(sys.argv) > 1: build_ja()
    for l in ('ru', 'en'):  # переключатель и подсказка в RU и EN
        p = f'{PG}/{PATH[l]}'; s = open(p, encoding='utf-8').read(); n = common(s, l)
        if n != s: open(p, 'w', encoding='utf-8').write(n); print('обновлён', PATH[l])
