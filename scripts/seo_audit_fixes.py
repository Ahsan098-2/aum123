from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

# Legacy URLs configured as permanent redirects in vercel.json.
REDIRECTS = {
    "/age-calculator": "/tools/age-calculator",
    "/background-remover": "/tools/background-remover",
    "/barcode-generator": "/tools/barcode-generator",
    "/bio-ideas-generator": "/tools/bio-ideas-generator",
    "/bmi-calculator": "/tools/bmi-calculator",
    "/color-picker": "/tools/color-picker",
    "/compress-pdf": "/tools/compress-pdf",
    "/crypto-price-checker": "/tools/crypto-price-checker",
    "/emoji-picker": "/tools/emoji-picker",
    "/fuel-price-checker": "/tools/fuel-price-checker",
    "/gold-price-checker": "/tools/gold-price-checker",
    "/gradient-generator": "/tools/gradient-generator",
    "/hashtag-generator": "/tools/hashtag-generator",
    "/image-compressor": "/tools/image-compressor",
    "/image-resizer": "/tools/image-resizer",
    "/image-to-pdf": "/tools/image-to-pdf",
    "/instagram-caption-maker": "/tools/instagram-caption-maker",
    "/ip-finder": "/tools/ip-finder",
    "/loan-calculator": "/tools/loan-calculator",
    "/password-gen": "/tools/password-gen",
    "/pdf-merger": "/tools/pdf-merger",
    "/pdf-splitter": "/tools/pdf-splitter",
    "/pdf-to-image": "/tools/pdf-to-image",
    "/pension-calculator": "/tools/pension-calculator",
    "/qr-generator": "/tools/qr-generator",
    "/stock-price-tracker": "/tools/stock-price-tracker",
    "/text-case-converter": "/tools/text-case-converter",
    "/unit-converter": "/tools/unit-converter",
    "/url-encoder-decoder": "/tools/url-encoder-decoder",
    "/word-counter": "/tools/word-counter",
}

ABS_RE = re.compile(r"https?://(?:www\.)?dailytoolkit\.xyz(?P<path>/[^\"'\s?#]*)", re.I)
META_RE = re.compile(r"<meta\s+[^>]*(?:property|name)\s*=\s*[\"'](?:og:[^\"']+|twitter:[^\"']+)[\"'][^>]*>\s*", re.I)
CANONICAL_RE = re.compile(r"<link\s+[^>]*rel=[\"']canonical[\"'][^>]*>\s*", re.I)
TITLE_RE = re.compile(r"<title>(.*?)</title>", re.I | re.S)
DESC_RE = re.compile(r"<meta\s+name=[\"']description[\"']\s+content=[\"'](.*?)[\"']\s*/?>", re.I | re.S)


def final_path(path: str) -> str:
    path = path or "/"
    path = re.sub(r"/{2,}", "/", path)
    if path in REDIRECTS:
        path = REDIRECTS[path]
    return path


def normalize_internal_links(text: str) -> str:
    # Absolute HTTP/HTTPS Daily Toolkit links: keep them HTTPS and bypass known redirects.
    def abs_repl(m):
        path = final_path(m.group("path"))
        return "https://dailytoolkit.xyz" + path

    text = ABS_RE.sub(abs_repl, text)

    # Root-relative links. Preserve query strings/fragments.
    for old, new in sorted(REDIRECTS.items(), key=lambda x: -len(x[0])):
        pattern = re.compile(r'(?P<prefix>["\'(=]\s*)' + re.escape(old) + r'(?P<suffix>[?#][^"\']*)?(?P<end>["\'])')
        text = pattern.sub(lambda m: m.group("prefix") + new + (m.group("suffix") or "") + m.group("end"), text)
    return text


def page_title(text: str, path: str) -> str:
    m = TITLE_RE.search(text)
    if m:
        title = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m.group(1))).strip()
        if title:
            return title
    slug = Path(path).stem.replace("-", " ").replace("_", " ").title()
    return f"{slug} | Daily Toolkit"


def page_description(text: str, title: str) -> str:
    m = DESC_RE.search(text)
    if m:
        desc = re.sub(r"\s+", " ", m.group(1)).strip()
        if desc:
            return desc[:300]
    return f"Use {title.replace(' | Daily Toolkit', '')} online with Daily Toolkit. Free, fast, simple, and browser-based."


def html_meta(text: str, path: str) -> str:
    title = page_title(text, path)
    description = page_description(text, title)
    url = "https://dailytoolkit.xyz" + final_path(path)
    if url.endswith("/index.html"):
        url = url[:-10] or "https://dailytoolkit.xyz/"
    image = "https://dailytoolkit.xyz/assets/logo.png"

    # Remove all existing OG/X card tags, then insert one complete canonical set.
    text = META_RE.sub("", text)
    text = CANONICAL_RE.sub("", text)

    block = f'''\n  <!-- SEO: canonical + social metadata -->\n  <link rel="canonical" href="{url}">\n\n  <meta property="og:type" content="website">\n  <meta property="og:title" content="{title}">\n  <meta property="og:description" content="{description}">\n  <meta property="og:url" content="{url}">\n  <meta property="og:image" content="{image}">\n  <meta property="og:site_name" content="Daily Toolkit">\n  <meta property="og:locale" content="en_US">\n\n  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:title" content="{title}">\n  <meta name="twitter:description" content="{description}">\n  <meta name="twitter:image" content="{image}">\n'''

    return re.sub(r"</head>", block + "\n</head>", text, count=1, flags=re.I)


def main():
    changed = []
    for path in ROOT.rglob("*.html"):
        if any(part.startswith(".") for part in path.parts):
            continue
        text = path.read_text(encoding="utf-8")
        original = text
        rel = "/" + path.relative_to(ROOT).as_posix()
        if rel == "/index.html":
            rel = "/"
        text = normalize_internal_links(text)
        text = html_meta(text, rel)
        if text != original:
            path.write_text(text, encoding="utf-8")
            changed.append(str(path.relative_to(ROOT)))

    print(f"SEO audit fixes: updated {len(changed)} HTML files")
    for item in changed:
        print(item)


if __name__ == "__main__":
    main()
