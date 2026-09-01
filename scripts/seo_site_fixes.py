from pathlib import Path
import json
import re

ROOT = Path('.')

TITLE_FIXES = {
    'index.html': 'Free Online Web Tools | Daily Toolkit',
    'tools.html': 'Daily Toolkit Tools | Free Online Calculators & Utilities',
    'contact.html': 'Contact Daily Toolkit | Free Online Tools',
    'tools/pdf-splitter.html': 'PDF Splitter Online | Daily Toolkit',
    'tools/text-case-converter.html': 'Text Case Converter Online | Daily Toolkit',
}


def replace_title(path: Path, title: str) -> None:
    html = path.read_text(encoding='utf-8')
    updated = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', html, count=1, flags=re.I | re.S)
    if updated != html:
        path.write_text(updated, encoding='utf-8')


def normalize_heading_sequence(path: Path) -> bool:
    html = path.read_text(encoding='utf-8')
    changed = False
    previous = None

    pattern = re.compile(r'<(h[1-6])\b([^>]*)>(.*?)</\1>', re.I | re.S)

    def repl(match):
        nonlocal previous, changed
        tag = match.group(1).lower()
        level = int(tag[1])
        new_level = level
        if previous is not None and level > previous + 1:
            new_level = previous + 1
        previous = new_level
        if new_level != level:
            changed = True
            return f'<h{new_level}{match.group(2)}>{match.group(3)}</h{new_level}>'
        return match.group(0)

    updated = pattern.sub(repl, html)
    if changed:
        path.write_text(updated, encoding='utf-8')
    return changed


def add_tools_overview() -> None:
    path = ROOT / 'tools.html'
    if not path.exists():
        return
    html = path.read_text(encoding='utf-8')
    if 'id="tools-seo-overview"' in html:
        return

    section = '''\n<section id="tools-seo-overview" aria-labelledby="tools-seo-overview-heading" style="max-width:1000px;margin:0 auto 70px;padding:28px 4%;">\n  <h2 id="tools-seo-overview-heading">Free Online Tools for Everyday Tasks</h2>\n  <p>Daily Toolkit brings useful online utilities into one simple place. Explore free calculators for common financial and everyday calculations, PDF tools for merging, splitting, compressing and converting documents, image tools for resizing and compression, and text utilities for counting, formatting and converting text.</p>\n  <p>You can also find generators and practical web utilities for QR codes, passwords, colors, URLs and other routine tasks. The tools are designed to be straightforward and fast, with browser-based features where possible so you can finish a task without installing desktop software or creating an account.</p>\n  <p>Choose a category or search for a specific tool, then follow the instructions on the individual tool page. Daily Toolkit is continuously updated with new utilities and improvements so the collection stays useful for students, creators, developers, small businesses and everyday users.</p>\n</section>\n'''

    marker = re.search(r'</main>', html, re.I)
    if marker:
        html = html[:marker.start()] + section + html[marker.start():]
        path.write_text(html, encoding='utf-8')


def fix_vercel_headers() -> None:
    path = ROOT / 'vercel.json'
    data = json.loads(path.read_text(encoding='utf-8'))
    security = None
    for rule in data.get('headers', []):
        if rule.get('source') == '/(.*)':
            security = rule
            break
    if security is None:
        security = {'source': '/(.*)', 'headers': []}
        data.setdefault('headers', []).append(security)

    headers = {item['key']: item['value'] for item in security.get('headers', [])}
    headers['X-Frame-Options'] = 'SAMEORIGIN'
    headers['X-Content-Type-Options'] = 'nosniff'
    headers['Referrer-Policy'] = headers.get('Referrer-Policy', 'strict-origin-when-cross-origin')
    security['headers'] = [{'key': k, 'value': v} for k, v in headers.items()]
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')


if __name__ == '__main__':
    for relative, title in TITLE_FIXES.items():
        path = ROOT / relative
        if path.exists():
            replace_title(path, title)

    add_tools_overview()
    fix_vercel_headers()

    normalized = 0
    for path in ROOT.rglob('*.html'):
        if '.git' in path.parts or 'node_modules' in path.parts:
            continue
        if normalize_heading_sequence(path):
            normalized += 1

    print(f'Applied Screaming Frog fixes. Heading hierarchy normalized on {normalized} HTML files.')

# Trigger the SEO fixer after the workflow configuration is installed.
