from pathlib import Path
import html
import re

ROOT = Path('.')

# Vercel currently redirects these legacy root URLs to /tools/*. Internal links should skip that hop.
REDIRECT_ALIASES = {
    'age-calculator': 'tools/age-calculator',
    'background-remover': 'tools/background-remover',
    'barcode-generator': 'tools/barcode-generator',
    'bio-ideas-generator': 'tools/bio-ideas-generator',
    'bmi-calculator': 'tools/bmi-calculator',
    'color-picker': 'tools/color-picker',
    'compress-pdf': 'tools/compress-pdf',
    'crypto-price-checker': 'tools/crypto-price-checker',
    'emoji-picker': 'tools/emoji-picker',
    'fuel-price-checker': 'tools/fuel-price-checker',
    'gold-price-checker': 'tools/gold-price-checker',
    'gradient-generator': 'tools/gradient-generator',
    'hashtag-generator': 'tools/hashtag-generator',
    'image-compressor': 'tools/image-compressor',
    'image-resizer': 'tools/image-resizer',
    'image-to-pdf': 'tools/image-to-pdf',
    'instagram-caption-maker': 'tools/instagram-caption-maker',
    'ip-finder': 'tools/ip-finder',
    'loan-calculator': 'tools/loan-calculator',
    'password-gen': 'tools/password-gen',
    'pdf-merger': 'tools/pdf-merger',
    'pdf-splitter': 'tools/pdf-splitter',
    'pdf-to-image': 'tools/pdf-to-image',
    'pension-calculator': 'tools/pension-calculator',
    'qr-generator': 'tools/qr-generator',
    'stock-price-tracker': 'tools/stock-price-tracker',
    'text-case-converter': 'tools/text-case-converter',
    'unit-converter': 'tools/unit-converter',
    'url-encoder-decoder': 'tools/url-encoder-decoder',
    'word-counter': 'tools/word-counter',
}

STOP = {'online', 'free', 'daily', 'toolkit', 'calculator', 'generator', 'checker', 'converter', 'tool'}

def clean_text(value):
    value = re.sub(r'<[^>]+>', ' ', value)
    value = html.unescape(value)
    return re.sub(r'\s+', ' ', value).strip()

def pretty_name(path):
    slug = Path(path).stem
    words = slug.replace('_', ' ').replace('-', ' ').split()
    return ' '.join(w.capitalize() for w in words)

def make_title(path, h1=''):
    base = clean_text(h1) or pretty_name(path)
    base = re.sub(r'\s+', ' ', base).strip(' -|')
    # Keep titles comfortably below the common 60-character SERP guideline.
    candidates = [f'{base} Online | Daily Toolkit', f'{base} | Daily Toolkit', f'{pretty_name(path)} | Daily Toolkit']
    for candidate in candidates:
        if len(candidate) <= 60:
            return candidate
    short = base
    # Remove generic trailing words before truncation.
    parts = [p for p in short.split() if p.lower() not in STOP]
    short = ' '.join(parts) or pretty_name(path)
    candidate = f'{short} | Daily Toolkit'
    if len(candidate) <= 60:
        return candidate
    return candidate[:57].rstrip(' -|') + '...'

def make_description(path, title, h1='', first_p=''):
    subject = clean_text(h1) or pretty_name(path)
    useful = clean_text(first_p)
    if useful:
        desc = useful
        if len(desc) < 110:
            desc = f'{desc} Use the free {subject.lower()} online with Daily Toolkit.'
    else:
        desc = f'Use the free {subject.lower()} online with Daily Toolkit. Fast, simple and easy to use for everyday tasks.'
    desc = re.sub(r'\s+', ' ', desc).strip()
    if len(desc) > 160:
        desc = desc[:157].rsplit(' ', 1)[0] + '...'
    return desc

def ensure_meta(text, tag_regex, new_tag):
    if re.search(tag_regex, text, re.I):
        return re.sub(tag_regex, new_tag, text, count=1, flags=re.I)
    return re.sub(r'</head>', '  ' + new_tag + '\n</head>', text, count=1, flags=re.I)

def fix_links(text):
    changed = 0
    # Replace root legacy aliases used by internal href links.
    for old, new in REDIRECT_ALIASES.items():
        pattern = rf'(?P<q>["\'])/{re.escape(old)}(?P<suffix>[/#?][^"\']*)?(?P=q)'
        def repl(m):
            nonlocal changed
            changed += 1
            suffix = m.group('suffix') or ''
            return f'{m.group("q")}/{new}{suffix}{m.group("q")}'
        text = re.sub(pattern, repl, text)

    # Vercel has trailingSlash=false, so local trailing-slash links create a redirect.
    def strip_slash(m):
        nonlocal changed
        url = m.group(2)
        if url == '/' or url.startswith('//') or re.match(r'https?://', url, re.I):
            return m.group(0)
        new_url = re.sub(r'/$', '', url)
        if new_url != url:
            changed += 1
            return m.group(1) + new_url + m.group(3)
        return m.group(0)
    text = re.sub(r'(["\'])(/[^"\']*/)(["\'])', strip_slash, text)
    return text, changed

changed_files = 0
title_fixed = 0
description_fixed = 0
redirects_fixed = 0

for path in ROOT.rglob('*.html'):
    if '.git' in path.parts or 'node_modules' in path.parts:
        continue
    text = path.read_text(encoding='utf-8')
    original = text

    h1_match = re.search(r'<h1\b[^>]*>(.*?)</h1>', text, re.I | re.S)
    h1 = clean_text(h1_match.group(1)) if h1_match else ''
    p_match = re.search(r'<p\b[^>]*>(.*?)</p>', text, re.I | re.S)
    first_p = clean_text(p_match.group(1)) if p_match else ''

    title_match = re.search(r'<title\b[^>]*>(.*?)</title>', text, re.I | re.S)
    current_title = clean_text(title_match.group(1)) if title_match else ''
    # Missing or clearly overlong titles are replaced with concise page-specific titles.
    if not current_title or len(current_title) > 60:
        new_title = make_title(path, h1)
        if title_match:
            text = re.sub(r'<title\b[^>]*>.*?</title>', f'<title>{new_title}</title>', text, count=1, flags=re.I | re.S)
        else:
            text = re.sub(r'</head>', f'  <title>{new_title}</title>\n</head>', text, count=1, flags=re.I)
        title_fixed += 1
        current_title = new_title

    desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'][^"\']*["\']\s*/?>', text, re.I)
    if not desc_match:
        desc = make_description(path, current_title, h1, first_p)
        text = ensure_meta(text, r'\A(?!)', f'<meta name="description" content="{html.escape(desc, quote=True)}">')
        description_fixed += 1
    else:
        desc_content = re.search(r'content=["\']([^"\']*)["\']', desc_match.group(0), re.I)
        if desc_content and not desc_content.group(1).strip():
            desc = make_description(path, current_title, h1, first_p)
            text = text[:desc_match.start()] + f'<meta name="description" content="{html.escape(desc, quote=True)}">' + text[desc_match.end():]
            description_fixed += 1

    text, link_count = fix_links(text)
    redirects_fixed += link_count

    if text != original:
        path.write_text(text, encoding='utf-8')
        changed_files += 1

print(f'Screaming Frog SEO fix: {changed_files} files changed; {title_fixed} titles fixed; {description_fixed} descriptions fixed; {redirects_fixed} internal redirects removed.')
