# Builds zh/index.html and es/index.html from index.html, and refreshes the language menu on all 4 pages.
# usage (from hje-site/):  python3 tools/build_i18n.py
import re, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from i18n_strings import T, KEEP

BASE = 'https://scherchen99-kim.github.io/hje-homepage/'
LANGS = [('en', '', 'English', 'EN'), ('ko', 'ko/', '한국어', 'KO'), ('zh', 'zh/', '简体中文', '中文'), ('es', 'es/', 'Español', 'ES')]
HTML_LANG = {'en': 'en', 'ko': 'ko', 'zh': 'zh-CN', 'es': 'es'}

GLOBE = '<svg class="globe" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>'
CODES = {'en': 'EN', 'ko': 'KO', 'zh': 'ZH', 'es': 'ES'}

def menu(cur, root):
    items = []
    for code, path, name, _ in LANGS:
        cur_attr = ' aria-current="true"' if code == cur else ''
        items.append(f'<li><a href="{root}{path}" lang="{HTML_LANG[code]}"{cur_attr}><span>{name}</span><small>{CODES[code]}</small></a></li>')
    btn = next(b for c, _, _, b in LANGS if c == cur)
    return btn, '\n          '.join(items)

def set_menu(s, cur, root):
    btn, items = menu(cur, root)
    s = re.sub(r'(<button class="lang__btn" aria-haspopup="true">).*?(<svg width="10" height="6")', lambda m: m.group(1) + GLOBE + btn + ' ' + m.group(2), s, count=1, flags=re.S)
    s = re.sub(r'<ul class="lang__menu">.*?</ul>', lambda m: '<ul class="lang__menu">\n          ' + items + '\n        </ul>', s, count=1, flags=re.S)
    return s

def translate(src, idx):
    missing = set()
    def tx(text):
        key = ' '.join(text.split())
        if key in T: return T[key][idx]
        if key and any(c.isalpha() for c in key) and key not in KEEP: missing.add(key)
        return None
    def node(m):
        raw = m.group(1)
        new = tx(raw)
        if new is None: return m.group(0)
        lead = raw[:len(raw) - len(raw.lstrip())]; trail = raw[len(raw.rstrip()):]
        return '>' + lead + new + trail + '<'
    out = []
    # translate text nodes outside <script>/<style>
    parts = re.split(r'(<script.*?</script>|<style.*?</style>)', src, flags=re.S)
    for p in parts:
        if p.startswith('<script') or p.startswith('<style'): out.append(p); continue
        p = re.sub(r'>([^<>]+)<', node, p)
        def attr(m):
            new = tx(m.group(2))
            return m.group(0) if new is None else f'{m.group(1)}="{new.replace("<br>", " ")}"'
        p = re.sub(r'\b(alt|aria-label|content)="([^"]*)"', attr, p)
        out.append(p)
    return ''.join(out), missing

def build(code, idx):
    s = open('index.html').read()
    s, missing = translate(s, idx)
    s = s.replace('<html lang="en">', f'<html lang="{HTML_LANG[code]}">', 1)
    s = s.replace(f'content="{BASE}"', f'content="{BASE}{code}/"', 1)                 # og:url
    s = s.replace('content="en_US"', 'content="zh_CN"' if code == 'zh' else 'content="es_419"', 1)
    title = {'zh': 'HYUCKJIN Energy Plant Engineering | 垃圾发电', 'es': 'HYUCKJIN Energy Plant Engineering | Valorización energética'}[code]
    s = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', s, count=1)
    s = re.sub(r'(<meta property="og:title" content=")[^"]*"', rf'\g<1>{title}"', s, count=1)
    # 3x re-burn stat: "3 stages" reads better in Chinese
    if code == 'zh': s = s.replace('<span class="count" data-to="3">3</span>×</b>', '<span class="count" data-to="3">3</span>级</b>')
    # paths one folder deeper
    s = s.replace('src="assets/', 'src="../assets/').replace('url(assets/', 'url(../assets/')
    s = s.replace('href="style.css', 'href="../style.css').replace('src="main.js', 'src="../main.js')
    if code == 'zh':
        s = s.replace('<link rel="stylesheet" href="../style.css',
                      '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">\n<link rel="stylesheet" href="../style.css', 1)
    s = set_menu(s, code, '../')
    os.makedirs(code, exist_ok=True)
    open(f'{code}/index.html', 'w').write(s)
    return missing

for code, idx in (('zh', 0), ('es', 1)):
    miss = build(code, idx)
    print(code, 'untranslated:', sorted(miss) if miss else 'none')

# refresh menus on EN and KO
for path, cur, root in (('index.html', 'en', ''), ('ko/index.html', 'ko', '../')):
    s = open(path).read(); open(path, 'w').write(set_menu(s, cur, root))
print('menus updated')
