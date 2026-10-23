# Выгрузка переводимого текста EN-лендинга в блоки с ID для перевода (ChatGPT) и карта для обратной вставки.
# Запуск: python3 scripts/i18n-ja/extract.py  ->  scripts/i18n-ja/source-en.md + map.json
import re, json, os
from bs4 import BeautifulSoup, NavigableString, Comment, Tag
HERE=os.path.dirname(__file__)
SRC=os.path.join(HERE,'../../src/pages/mountains/annapurna-2027-en.html')
soup=BeautifulSoup(open(SRC,encoding='utf-8').read(),'html.parser')
SKIP={'script','style','svg','noscript','title'}
PREFIX={'hero':'HERO','letter':'LETTER','trail':'TRAIL','route':'ROUTE','days':'DAYS','immersion':'IMMERSION','guides':'GUIDES','safety':'SAFETY','price':'PRICE','not-included':'NOTINC','join':'JOIN','closing':'CLOSING','lang':'LANG'}
def sec(e):
    for p in [e]+list(e.parents):
        if isinstance(p,Tag):
            if p.name=='section' and p.get('id'): return p['id']
            if p.name=='header': return 'hero'
            if p.name=='footer': return 'closing'
            cl=p.get('class') or []
            if 'lang' in cl: return 'lang'
    return 'hero'
items=[]   # (section, kind, locator, text, unit_key)
# 1) meta (head)
head=soup.find('head')
title=soup.find('title')
items.append(('meta','title',{'tag':'title'},title.get_text(),'t'))
for m in head.find_all('meta'):
    k=m.get('property') or m.get('name')
    if k in('og:title','og:description','og:site_name','og:image:alt','twitter:title','twitter:description','description'):
        items.append(('meta','meta',{'key':k},m['content'],k))
# 2) body: text nodes and attrs, in document order
body=[c for c in soup.contents if isinstance(c,Tag) and c.name=='html'][0]
els=[e for e in body.descendants if isinstance(e,Tag) and e.name not in SKIP and not any(p.name in SKIP for p in e.parents)]
allel=[e for e in body.find_all(True)]
eidx={id(e):i for i,e in enumerate(allel)}
tidx=0
text_nodes=[]
for n in body.descendants:
    if isinstance(n,NavigableString) and not isinstance(n,Comment):
        text_nodes.append(n)
tindex={id(n):i for i,n in enumerate(text_nodes)}
for n in body.descendants:
    if isinstance(n,Tag) and (n.name not in SKIP or n.name=='svg') and not any(p.name in SKIP for p in n.parents):
        for a in('alt','aria-label'):
            if n.get(a) and re.search('[A-Za-z]{2,}',n[a]) and not (n.get('class') and 'lang' in n.get('class') and a=='aria-label'):
                if n.name=='div' and n.get('class') and 'lang' in n['class']: continue
                items.append((sec(n),'attr',{'el':eidx[id(n)],'attr':a},n[a],('a',eidx[id(n)])))
    elif isinstance(n,NavigableString) and not isinstance(n,Comment):
        par=n.parent
        if par.name in SKIP or any(p.name in SKIP for p in par.parents): continue
        t=str(n)
        if not re.search('[A-Za-z]{2,}',t): continue
        s=sec(par)
        # hero h1 остаётся английским по решению
        if par.name=='h1' or (par.name=='span' and par.parent.name=='h1'): continue
        if s=='lang': continue
        if re.fullmatch(r'\s*@\S+\s*',t): continue   # хэндлы не переводим
        # единица = ближайший блочный предок
        u=par
        while u.name in('span','b','small','a','strong','em','i') and u.parent: u=u.parent
        items.append((s,'text',{'node':tindex[id(n)]},t.strip() if False else t,('u',id(u))))
# svg <text>: уникальные подписи, одна запись на строку, список узлов
svgtxt={}
for n in text_nodes:
    par=n.parent
    if par.name!='text': continue
    t=str(n).strip()
    rest=re.sub(r'[0-9,.~·\s]|\bm\b','',t)
    if len(re.findall('[A-Za-z]',rest))<2 or t in('DAY',) and False: continue
    svgtxt.setdefault((sec(par),t),[]).append(tindex[id(n)])
for (s_,t),nodes in svgtxt.items():
    items.append((s_,'svgtext',{'nodes':nodes},t,('svg',t)))
# UI-строки подсказки языка (в скрипте)
ui=[('Эта страница есть на русском.', 'This page is also available in English.'),]
order=['meta','hero','letter','trail','route','days','immersion','guides','safety','price','not-included','join','closing']
bysec={}
for it in items: bysec.setdefault(it[0],[]).append(it)
ids={}; out=[]; mp={}
def heading(s):
    if s=='meta': return 'META (заголовок вкладки, превью ссылки в мессенджерах, описание для поиска)'
    sc=soup.find(id=s) if s not in('hero','closing') else soup.find('header' if s=='hero' else 'footer')
    h=sc.find(['h2','h1']) if sc else None
    return f"{s.upper()}"+(f" — «{h.get_text(' ',strip=True)}»" if h else '')
for s in order:
    if s not in bysec: continue
    pre=PREFIX.get(s,'META') if s!='meta' else 'META'
    out.append(f"\n=== SECTION: {heading(s)} ===\n")
    n=0; last=None; seen={}
    for (_,kind,loc,text,ukey) in bysec[s]:
        flat=re.sub(r'\s+',' ',text).strip()
        k=(flat,kind=='attr' and loc.get('attr'))
        if k in seen:   # повтор в той же секции: та же строка, тот же ID
            mp[seen[k]]['locs'].append({'kind':kind,'loc':loc}); continue
        n+=1; i=f"{pre}-{n:03d}"; seen[k]=i
        if last is not None and ukey!=last and not (ukey[0]=='svg' and last[0]=='svg'): out.append('')
        last=ukey
        tag='' if kind in('text','title','meta','svgtext') else ('[alt] ' if loc.get('attr')=='alt' else '[aria] ')
        out.append(f"[{i}] {tag}{flat}")
        mp[i]={'locs':[{'kind':kind,'loc':loc}],'orig':flat}
# UI
out.append("\n=== SECTION: UI (подсказка языка внизу экрана) ===\n")
out.append("[UI-001] This page is also available in English.")
out.append("[UI-002] This page is also available in Russian.")
out.append("[UI-003] [aria] Close")
for i in('UI-001','UI-002','UI-003'): mp[i]={'locs':[{'kind':'ui'}]}
open(os.path.join(HERE,'map.json'),'w',encoding='utf-8').write(json.dumps(mp,ensure_ascii=False,indent=0))
open(os.path.join(HERE,'_body.md'),'w',encoding='utf-8').write('\n'.join(out)+'\n')
print(len(mp),'блоков')
