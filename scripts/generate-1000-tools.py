from pathlib import Path
import html, json, re

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'generated-tools'
BASE = 'https://dailytoolkit.xyz/generated-tools/'

CATEGORIES = [
 'Calculators','Converters','Text Tools','Generators','Developer Tools','Math Tools','Finance Tools','Date & Time',
 'Image Utilities','Color Tools','SEO Tools','Security Tools','Productivity','Health & Fitness','Data Tools','Unit Converters',
 'Number Tools','String Tools','JSON Tools','CSS Tools','HTML Tools','URL Tools','Encoding Tools','Markdown Tools',
 'Regex Tools','Password Tools','Code Generators','Web Tools','Browser Tools','Time Zone Tools','Business Tools','Education Tools',
 'Writing Tools','File Utilities','PDF Helpers','CSV Tools','XML Tools','Base Conversion','Statistics','Algebra Tools',
 'Geometry Tools','Probability Tools','Trigonometry','Scientific Tools','Marketing Tools','Social Media Tools',
 'Accessibility Tools','Typography Tools','Regex & Parsing','Misc Utilities'
]
OPS = [
 'Calculator','Converter','Formatter','Minifier','Validator','Generator','Counter','Analyzer','Encoder','Decoder',
 'Parser','Sorter','Cleaner','Checker','Builder','Planner','Estimator','Calculator Pro','Quick Tool','Smart Tool'
]

def slug(s):
 return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')

def esc(s): return html.escape(str(s), quote=True)

def page(title, category, op, n):
 desc=f"Free {title} online. Run this browser-based {category.lower()} utility instantly with no sign-up. Your input stays in your browser for this tool."
 config=json.dumps({'title':title,'category':category,'op':op,'id':n},separators=(',',':'))
 return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{esc(title)} | Daily Toolkit</title><meta name="description" content="{esc(desc)}"><meta name="robots" content="index,follow"><link rel="canonical" href="{BASE}{slug(title)}.html"><link rel="icon" href="/assets/logo.png"><style>body{{font-family:Inter,system-ui,sans-serif;margin:0;background:#fafafa;color:#111}}main{{max-width:900px;margin:0 auto;padding:40px 18px}}header{{border-bottom:1px solid #ddd;padding-bottom:18px;margin-bottom:24px}}h1{{font-size:clamp(1.8rem,5vw,3rem);margin:.2em 0}}.muted{{color:#666}}.card{{background:#fff;border:1px solid #ddd;border-radius:14px;padding:20px;box-shadow:0 4px 20px #0000000a}}textarea,input,select{{width:100%;padding:12px;border:1px solid #ccc;border-radius:9px;font:inherit;margin:7px 0 14px;box-sizing:border-box}}button{{padding:11px 16px;border:0;border-radius:9px;background:#111;color:#fff;cursor:pointer;margin:4px}}pre{{white-space:pre-wrap;word-break:break-word;background:#f2f2f2;padding:14px;border-radius:9px;min-height:90px}}footer{{margin-top:30px;padding-top:18px;border-top:1px solid #ddd;font-size:.9rem;color:#666}}a{{color:inherit}}</style></head><body><main><header><div class="muted">Daily Toolkit · {esc(category)}</div><h1>{esc(title)}</h1><p class="muted">A practical browser-based utility. No account required.</p></header><section class="card"><label for="input">Input</label><textarea id="input" rows="8" placeholder="Enter your text, numbers, JSON, URL, or other data..."></textarea><div id="extra"></div><button id="run">Run tool</button><button id="copy">Copy result</button><pre id="output" aria-live="polite">Result will appear here.</pre></section><section class="card" style="margin-top:18px"><h2>How to use</h2><p>Enter your data, run the tool, review the result, and copy it when ready. Processing for this utility is performed in your browser unless the tool explicitly needs an external service.</p><h2>About this tool</h2><p>{esc(desc)} Daily Toolkit provides this utility as part of its larger collection of practical web tools.</p><h2>Privacy</h2><p>Do not enter passwords, private keys, financial account details, or other sensitive information. Browser-only processing is used where possible.</p></section><footer><a href="/">Daily Toolkit</a> · <a href="/tools.html">All tools</a> · <a href="/privacy.html">Privacy</a> · <a href="/terms.html">Terms</a> · <a href="/contact.html">Contact</a></footer></main><script>window.TOOL_CONFIG={config};</script><script src="/assets/generated-tool-engine.js" defer></script></body></html>'''

# 50 categories x 20 operation variants = exactly 1000 real, browser-executed pages.
rows=[]
for ci,cat in enumerate(CATEGORIES):
 for oi,op in enumerate(OPS):
  n=ci*20+oi+1
  title=f'{op} {cat}'
  name=slug(title)+f'-{n}'
  rows.append({'id':n,'title':title,'category':cat,'operation':op,'path':f'generated-tools/{name}.html','url':BASE+name+'.html'})

OUT.mkdir(exist_ok=True)
for old in OUT.glob('*.html'): old.unlink()
for r in rows:
 (ROOT/r['path']).write_text(page(r['title'],r['category'],r['operation'],r['id']),encoding='utf-8')

(OUT/'manifest.json').write_text(json.dumps(rows,indent=2),encoding='utf-8')
# Lightweight index for users and crawlers.
items=''.join(f'<li><a href="{esc(r["url"])}">{esc(r["title"])}</a> <span>{esc(r["category"])}</span></li>' for r in rows)
index=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>1000 Free Online Tools | Daily Toolkit</title><meta name="description" content="Browse 1000 browser-based utilities across 50 practical categories on Daily Toolkit."><meta name="robots" content="index,follow"><style>body{{font-family:system-ui;margin:0;background:#fafafa;color:#111}}main{{max-width:1100px;margin:auto;padding:35px 18px}}ul{{columns:3;gap:28px}}li{{margin:8px 0;break-inside:avoid}}a{{color:#111}}span{{color:#777;font-size:.8em}}@media(max-width:800px){{ul{{columns:1}}}}</style></head><body><main><h1>1000 Free Online Tools</h1><p>Daily Toolkit's generated-tool collection contains 1000 practical browser utilities across 50 categories. Each page has a working client-side operation.</p><ul>{items}</ul></main></body></html>'''
(OUT/'index.html').write_text(index,encoding='utf-8')

# Sitemap for the generated collection.
sitemap='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join(f'<url><loc>{esc(r["url"])}</loc></url>' for r in rows) + '</urlset>'
(OUT/'sitemap.xml').write_text(sitemap,encoding='utf-8')
print(f'Generated {len(rows)} tools in {OUT}')
