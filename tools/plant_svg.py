# Generates the animated SVG layer for the Technology section and injects it into index.html / ko/index.html.
# Coordinates are in the original illustration's pixels (1672 x 941); the site image is cropped to y 170..800.
import re
FLOWS = [  # step, kind, points
  (1, 'waste', [(150, 706), (262, 706)]),
  (1, 'waste', [(338, 700), (338, 585)]),
  (1, 'waste', [(424, 616), (492, 655)]),
  (2, 'air',   [(478, 676), (640, 676)]),
  (3, 'heat',  [(613, 535), (613, 458), (660, 458)]),
  (4, 'gas',   [(986, 622), (1041, 602), (1051, 595), (1051, 477), (1126, 477), (1126, 505)]),
  (4, 'gas',   [(1161, 612), (1168, 612), (1168, 560), (1200, 558)]),
  (4, 'gas',   [(1353, 555), (1386, 560), (1396, 610), (1411, 615)]),
  (4, 'clean', [(1436, 600), (1436, 338)]),
  (5, 'steam', [(822, 458), (876, 458), (876, 614)]),
  (5, 'power', [(1006, 702), (1006, 752), (1580, 752), (1580, 735)]),
]
GLOWS = [  # step, gradient, cx, cy, r
  (3, 'gOrange', 565, 610, 95), (3, 'gOrange', 738, 550, 80),
  (5, 'gYellow', 900, 660, 60), (5, 'gYellow', 1006, 665, 55), (5, 'gYellow', 1578, 520, 95),
]
def d(pts): return 'M' + ' L'.join(f'{x},{y}' for x, y in pts)
out = ['<div class="plant reveal" id="plant">',
       '  <img src="{A}plant-illustration.jpg" alt="{ALT}" width="1672" height="630">',
       '  <svg class="plant__fx" viewBox="0 170 1672 630" aria-hidden="true">',
       '    <defs>',
       '      <radialGradient id="gOrange"><stop offset="0" stop-color="#ff7a1a" stop-opacity=".75"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient>',
       '      <radialGradient id="gYellow"><stop offset="0" stop-color="#f5b400" stop-opacity=".8"/><stop offset="1" stop-color="#f5b400" stop-opacity="0"/></radialGradient>',
       '    </defs>']
for i, (st, g, cx, cy, r) in enumerate(GLOWS):
    out.append(f'    <circle class="fx-glow" data-step="{st}" cx="{cx}" cy="{cy}" r="{r}" fill="url(#{g})" style="animation-delay:{i*0.3:.1f}s"/>')
for i, (st, kind, pts) in enumerate(FLOWS):
    out.append(f'    <path id="fp{i}" class="fx-under" data-step="{st}" d="{d(pts)}"/>')
    out.append(f'    <path class="fx-path fx-{kind}" data-step="{st}" d="{d(pts)}"/>')
for i, (st, kind, pts) in enumerate(FLOWS):
    L = sum(((b[0]-a[0])**2 + (b[1]-a[1])**2) ** .5 for a, b in zip(pts, pts[1:]))
    n = max(1, int(L // 140)); dur = max(1.4, L / 120)
    for j in range(n):
        out.append(f'    <circle class="fx-dot fx-{kind}" data-step="{st}" r="5"><animateMotion dur="{dur:.1f}s" begin="{-j*dur/n:.2f}s" repeatCount="indefinite"><mpath href="#fp{i}"/></animateMotion></circle>')
for j in range(3):  # vapor puffs at the stack top
    out.append(f'    <circle class="fx-puff" data-step="4" cx="1436" cy="335" r="10"><animate attributeName="cy" values="335;250" dur="3s" begin="{j}s" repeatCount="indefinite"/><animate attributeName="r" values="8;26" dur="3s" begin="{j}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="3s" begin="{j}s" repeatCount="indefinite"/></circle>')
out += ['  </svg>', '</div>']
snippet = '\n'.join('    ' + l for l in out) + '\n'

for path, A, ALT in (('index.html', 'assets/', 'HJE waste-to-energy plant: receiving, combustion, heat recovery, flue gas cleaning and power generation'),
                     ('ko/index.html', '../assets/', 'HJE 폐기물 발전 플랜트: 반입, 연소, 열 회수, 배출가스 정화, 전기 생산')):
    s = open(path).read()
    s = re.sub(r'    <div class="plant reveal" id="plant">.*?\n    </div>\n', '', s, flags=re.S)  # replace old copy
    block = snippet.replace('{A}', A).replace('{ALT}', ALT)
    s = s.replace('    <ol class="flow reveal">', block + '\n    <ol class="flow reveal">', 1)
    open(path, 'w').write(s)
print('ok', len(snippet))
