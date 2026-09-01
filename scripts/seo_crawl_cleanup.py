from pathlib import Path
import re

ROOT = Path('.')

# Replace legacy URLs that Vercel redirects internally with their final URLs.
# Includes both clean legacy URLs and .html variants so internal links go
# directly to the final 200-status destination and do not pass through 308s.
REDIRECTS = {
    '/age-calculator': '/tools/age-calculator',
    '/age-calculator.html': '/tools/age-calculator',
    '/background-remover': '/tools/background-remover',
    '/background-remover.html': '/tools/background-remover',
    '/barcode-generator': '/tools/barcode-generator',
    '/barcode-generator.html': '/tools/barcode-generator',
    '/bio-ideas-generator': '/tools/bio-ideas-generator',
    '/bio-ideas-generator.html': '/tools/bio-ideas-generator',
    '/bmi-calculator': '/tools/bmi-calculator',
    '/bmi-calculator.html': '/tools/bmi-calculator',
    '/color-picker': '/tools/color-picker',
    '/color-picker.html': '/tools/color-picker',
    '/compress-pdf': '/tools/compress-pdf',
    '/compress-pdf.html': '/tools/compress-pdf',
    '/crypto-price-checker': '/tools/crypto-price-checker',
    '/crypto-price-checker.html': '/tools/crypto-price-checker',
    '/emoji-picker': '/tools/emoji-picker',
    '/emoji-picker.html': '/tools/emoji-picker',
    '/fuel-price-checker': '/tools/fuel-price-checker',
    '/fuel-price-checker.html': '/tools/fuel-price-checker',
    '/gold-price-checker': '/tools/gold-price-checker',
    '/gold-price-checker.html': '/tools/gold-price-checker',
    '/gradient-generator': '/tools/gradient-generator',
    '/gradient-generator.html': '/tools/gradient-generator',
    '/hashtag-generator': '/tools/hashtag-generator',
    '/hashtag-generator.html': '/tools/hashtag-generator',
    '/image-compressor': '/tools/image-compressor',
    '/image-compressor.html': '/tools/image-compressor',
    '/image-resizer': '/tools/image-resizer',
    '/image-resizer.html': '/tools/image-resizer',
    '/image-to-pdf': '/tools/image-to-pdf',
    '/image-to-pdf.html': '/tools/image-to-pdf',
    '/instagram-caption-maker': '/tools/instagram-caption-maker',
    '/instagram-caption-maker.html': '/tools/instagram-caption-maker',
    '/ip-finder': '/tools/ip-finder',
    '/ip-finder.html': '/tools/ip-finder',
    '/loan-calculator': '/tools/loan-calculator',
    '/loan-calculator.html': '/tools/loan-calculator',
    '/password-gen': '/tools/password-gen',
    '/password-gen.html': '/tools/password-gen',
    '/pdf-merger': '/tools/pdf-merger',
    '/pdf-merger.html': '/tools/pdf-merger',
    '/pdf-splitter': '/tools/pdf-splitter',
    '/pdf-splitter.html': '/tools/pdf-splitter',
    '/pdf-to-image': '/tools/pdf-to-image',
    '/pdf-to-image.html': '/tools/pdf-to-image',
    '/pension-calculator': '/tools/pension-calculator',
    '/pension-calculator.html': '/tools/pension-calculator',
    '/qr-generator': '/tools/qr-generator',
    '/qr-generator.html': '/tools/qr-generator',
    '/stock-price-tracker': '/tools/stock-price-tracker',
    '/stock-price-tracker.html': '/tools/stock-price-tracker',
    '/text-case-converter': '/tools/text-case-converter',
    '/text-case-converter.html': '/tools/text-case-converter',
    '/unit-converter': '/tools/unit-converter',
    '/unit-converter.html': '/tools/unit-converter',
    '/url-encoder-decoder': '/tools/url-encoder-decoder',
    '/url-encoder-decoder.html': '/tools/url-encoder-decoder',
    '/word-counter': '/tools/word-counter',
    '/word-counter.html': '/tools/word-counter',
    '/privacy.html': '/privacy',
}


def clean_internal_redirects(text):
    original = text
    for old, new in REDIRECTS.items():
        # Only replace internal root-relative URL values, not external domains.
        text = re.sub(rf'(["\'(=:\s]){re.escape(old)}(?=(["\'?#\s)]|$))', rf'\1{new}', text)
        text = text.replace(f'https://dailytoolkit.xyz{old}', f'https://dailytoolkit.xyz{new}')
        text = text.replace(f'https://www.dailytoolkit.xyz{old}', f'https://dailytoolkit.xyz{new}')
    return text != original, text


def fix_duplicate_h2(text):
    # Keep the first occurrence as H2. If the exact same H2 is repeated on a page,
    # make subsequent copies H3 so the heading hierarchy remains meaningful.
    seen = set()
    changed = False

    pattern = re.compile(r'<h2\b([^>]*)>(.*?)</h2>', re.I | re.S)

    def repl(match):
        nonlocal changed
        inner = re.sub(r'<[^>]+>', ' ', match.group(2))
        key = re.sub(r'\s+', ' ', inner).strip().lower()
        if not key:
            return match.group(0)
        if key in seen:
            changed = True
            return f'<h3{match.group(1)}>{match.group(2)}</h3>'
        seen.add(key)
        return match.group(0)

    return (pattern.sub(repl, text) if pattern.search(text) else text), changed


def fix_long_meta_description(text):
    # Search engines commonly truncate long snippets. Keep descriptions concise.
    pattern = re.compile(r'(<meta\s+[^>]*name=["\']description["\'][^>]*content=["\'])(.*?)(["\'][^>]*>)', re.I | re.S)

    def repl(match):
        desc = re.sub(r'\s+', ' ', match.group(2)).strip()
        if len(desc) <= 160:
            return match.group(0)
        # Cut at a word boundary and preserve a complete sentence where possible.
        short = desc[:157].rsplit(' ', 1)[0].rstrip(' ,;:-') + '...'
        return match.group(1) + short + match.group(3)

    return pattern.sub(repl, text)


changed_files = []
for path in ROOT.rglob('*.html'):
    if any(part in {'.git', 'node_modules'} for part in path.parts):
        continue
    text = path.read_text(encoding='utf-8')
    original = text

    redirected, text = clean_internal_redirects(text)
    text, duplicate_changed = fix_duplicate_h2(text)
    text = fix_long_meta_description(text)

    if text != original:
        path.write_text(text, encoding='utf-8')
        changed_files.append(str(path))

print(f'SEO crawl cleanup changed {len(changed_files)} HTML files.')
for item in changed_files:
    print(item)
