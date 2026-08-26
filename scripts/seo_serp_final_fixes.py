from pathlib import Path
import re

ROOT = Path('.')

TITLE_FIXES = {
    'index.html': 'Free Online Tools, PDF & Calculators | Daily Toolkit',
    'tools.html': 'Free Online Tools & Calculators | Daily Toolkit',
    'tools/pdf-splitter.html': 'PDF Splitter Online | Split PDF Pages Free | Daily Toolkit',
    'tools/text-case-converter.html': 'Text Case Converter Online | Uppercase & Lowercase',
}

DESCRIPTION_FIXES = {
    'index.html': 'Free online tools for PDF, images, calculators, text and everyday tasks. Fast, simple utilities with no signup required on Daily Toolkit.',
    'tools.html': 'Explore free online tools and calculators for PDF files, images, text, finance and everyday tasks. Find fast, simple utilities in one place.',
}


def replace_first(html, pattern, replacement):
    return re.sub(pattern, replacement, html, count=1, flags=re.I | re.S)


def clean_description(value):
    value = re.sub(r'\s+', ' ', value).strip()
    if len(value) <= 155:
        return value
    return value[:152].rsplit(' ', 1)[0].rstrip(' ,;:-') + '...'


def fallback_title(path):
    name = path.stem.replace('-', ' ').replace('_', ' ').strip()
    if name.lower() == 'index':
        return 'Free Online Tools | Daily Toolkit'
    return ' '.join(word.capitalize() for word in name.split()) + ' Online | Daily Toolkit'


def process(path):
    html = path.read_text(encoding='utf-8')
    original = html

    if str(path) in TITLE_FIXES:
        title = TITLE_FIXES[str(path)]
        html = replace_first(html, r'<title>.*?</title>', f'<title>{title}</title>')
    else:
        match = re.search(r'<title>(.*?)</title>', html, re.I | re.S)
        if match:
            title = re.sub(r'\s+', ' ', match.group(1)).strip()
            if len(title) < 30:
                html = replace_first(html, r'<title>.*?</title>', f'<title>{fallback_title(path)}</title>')
            elif len(title) > 60:
                # Preserve the front-loaded primary keyword while removing the brand tail first.
                base = re.sub(r'\s*\|\s*Daily Toolkit\s*$', '', title, flags=re.I).strip()
                if len(base) > 55:
                    base = base[:55].rsplit(' ', 1)[0].rstrip(' -|:,')
                html = replace_first(html, r'<title>.*?</title>', f'<title>{base} | Daily Toolkit</title>')

    key = str(path)
    if key in DESCRIPTION_FIXES:
        desc = DESCRIPTION_FIXES[key]
        html = replace_first(html, r'<meta\s+name=["\']description["\'][^>]*>', f'<meta name="description" content="{desc}">')
    else:
        match = re.search(r'<meta\s+name=["\']description["\'][^>]*content=["\'](.*?)["\'][^>]*>', html, re.I | re.S)
        if match:
            desc = clean_description(match.group(1))
            html = replace_first(html, r'<meta\s+name=["\']description["\'][^>]*>', f'<meta name="description" content="{desc}">')

    if html != original:
        path.write_text(html, encoding='utf-8')
        return True
    return False


changed = 0
for path in ROOT.rglob('*.html'):
    if any(part in {'.git', 'node_modules'} for part in path.parts):
        continue
    if process(path):
        changed += 1

print(f'Final SERP metadata fixes applied to {changed} HTML files.')
