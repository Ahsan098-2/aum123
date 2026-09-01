from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
REDIRECTS = {
    "/age-calculator":"/tools/age-calculator","/age-calculator.html":"/tools/age-calculator",
    "/background-remover":"/tools/background-remover","/background-remover.html":"/tools/background-remover",
    "/barcode-generator":"/tools/barcode-generator","/barcode-generator.html":"/tools/barcode-generator",
    "/bio-ideas-generator":"/tools/bio-ideas-generator","/bio-ideas-generator.html":"/tools/bio-ideas-generator",
    "/bmi-calculator":"/tools/bmi-calculator","/bmi-calculator.html":"/tools/bmi-calculator",
    "/color-picker":"/tools/color-picker","/color-picker.html":"/tools/color-picker",
    "/compress-pdf":"/tools/compress-pdf","/compress-pdf.html":"/tools/compress-pdf",
    "/crypto-price-checker":"/tools/crypto-price-checker","/crypto-price-checker.html":"/tools/crypto-price-checker",
    "/emoji-picker":"/tools/emoji-picker","/emoji-picker.html":"/tools/emoji-picker",
    "/fuel-price-checker":"/tools/fuel-price-checker","/fuel-price-checker.html":"/tools/fuel-price-checker",
    "/gold-price-checker":"/tools/gold-price-checker","/gold-price-checker.html":"/tools/gold-price-checker",
    "/gradient-generator":"/tools/gradient-generator","/gradient-generator.html":"/tools/gradient-generator",
    "/hashtag-generator":"/tools/hashtag-generator","/hashtag-generator.html":"/tools/hashtag-generator",
    "/image-compressor":"/tools/image-compressor","/image-compressor.html":"/tools/image-compressor",
    "/image-resizer":"/tools/image-resizer","/image-resizer.html":"/tools/image-resizer",
    "/image-to-pdf":"/tools/image-to-pdf","/image-to-pdf.html":"/tools/image-to-pdf",
    "/instagram-caption-maker":"/tools/instagram-caption-maker","/instagram-caption-maker.html":"/tools/instagram-caption-maker",
    "/ip-finder":"/tools/ip-finder","/ip-finder.html":"/tools/ip-finder",
    "/loan-calculator":"/tools/loan-calculator","/loan-calculator.html":"/tools/loan-calculator",
    "/password-gen":"/tools/password-gen","/password-gen.html":"/tools/password-gen",
    "/pdf-merger":"/tools/pdf-merger","/pdf-merger.html":"/tools/pdf-merger",
    "/pdf-splitter":"/tools/pdf-splitter","/pdf-splitter.html":"/tools/pdf-splitter",
    "/pdf-to-image":"/tools/pdf-to-image","/pdf-to-image.html":"/tools/pdf-to-image",
    "/pension-calculator":"/tools/pension-calculator","/pension-calculator.html":"/tools/pension-calculator",
    "/qr-generator":"/tools/qr-generator","/qr-generator.html":"/tools/qr-generator",
    "/stock-price-tracker":"/tools/stock-price-tracker","/stock-price-tracker.html":"/tools/stock-price-tracker",
    "/text-case-converter":"/tools/text-case-converter","/text-case-converter.html":"/tools/text-case-converter",
    "/unit-converter":"/tools/unit-converter","/unit-converter.html":"/tools/unit-converter",
    "/url-encoder-decoder":"/tools/url-encoder-decoder","/url-encoder-decoder.html":"/tools/url-encoder-decoder",
    "/word-counter":"/tools/word-counter","/word-counter.html":"/tools/word-counter",
    "/privacy.html":"/privacy",
}
ABS_RE = re.compile(r"https?://(?:www\.)?dailytoolkit\.xyz(?P<path>/[^\"'\s?#]*)", re.I)
SOCIAL_RE = re.compile(r"<meta\s+[^>]*(?:property|name)\s*=\s*[\"'](?:og:[^\"']+|twitter:[^\"']+)[\"'][^>]*>\s*", re.I)
CANONICAL_RE = re.compile(r"<link\s+[^>]*rel=[\"']canonical[\"'][^>]*>\s*", re.I)
TITLE_RE = re.compile(r"<title>(.*?)</title>", re.I|re.S)
DESC_TAG_RE = re.compile(r"<meta\b(?=[^>]*\bname\s*=\s*[\"']description[\"'])[^>]*>", re.I)


def final_path(path):
    path = re.sub(r"/{2,}", "/", path or "/")
    seen=set()
    while path in REDIRECTS and path not in seen:
        seen.add(path); path=REDIRECTS[path]
    return path


def normalize_internal_links(text):
    def abs_repl(m): return "https://dailytoolkit.xyz" + final_path(m.group("path"))
    text = ABS_RE.sub(abs_repl, text)
    for old,new in sorted(REDIRECTS.items(), key=lambda x:-len(x[0])):
        text = text.replace("https://dailytoolkit.xyz"+old, "https://dailytoolkit.xyz"+new)
        text = text.replace("https://www.dailytoolkit.xyz"+old, "https://dailytoolkit.xyz"+new)
        text = re.sub(r'(["\'(=:\s])'+re.escape(old)+r'(?=(["\'?#\s)]|$))', r'\1'+new, text)
    return text


def dedupe_descriptions(text):
    matches=list(DESC_TAG_RE.finditer(text))
    if len(matches)<=1: return text
    for m in reversed(matches[1:]):
        text=text[:m.start()]+text[m.end():]
    return text


def page_title(text,path):
    m=TITLE_RE.search(text)
    if m:
        value=re.sub(r"\s+"," ",re.sub(r"<[^>]+>","",m.group(1))).strip()
        if value:return value
    return Path(path).stem.replace("-"," ").title()+" | Daily Toolkit"


def description(text,title):
    m=DESC_TAG_RE.search(text)
    if m:
        c=re.search(r"\bcontent\s*=\s*[\"'](.*?)[\"']",m.group(0),re.I|re.S)
        if c and c.group(1).strip(): return re.sub(r"\s+"," ",c.group(1)).strip()[:300]
    return f"Use {title.replace(' | Daily Toolkit','')} online with Daily Toolkit. Free, fast, simple, and browser-based."


def repair_metadata(text,path):
    text=dedupe_descriptions(text)
    title=page_title(text,path); desc=description(text,title)
    url="https://dailytoolkit.xyz"+final_path(path)
    image="https://dailytoolkit.xyz/assets/logo.png"
    text=SOCIAL_RE.sub("",text)
    text=CANONICAL_RE.sub("",text)
    block=f'''\n  <link rel="canonical" href="{url}">\n  <meta property="og:type" content="website">\n  <meta property="og:title" content="{title}">\n  <meta property="og:description" content="{desc}">\n  <meta property="og:url" content="{url}">\n  <meta property="og:image" content="{image}">\n  <meta property="og:site_name" content="Daily Toolkit">\n  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:title" content="{title}">\n  <meta name="twitter:description" content="{desc}">\n  <meta name="twitter:image" content="{image}">\n'''
    return re.sub(r"</head>",block+"\n</head>",text,count=1,flags=re.I)


def main():
    changed=[]
    for p in ROOT.rglob("*.html"):
        if any(x in {".git","node_modules"} for x in p.parts): continue
        old=p.read_text(encoding="utf-8"); rel="/"+p.relative_to(ROOT).as_posix()
        if rel=="/index.html": rel="/"
        new=repair_metadata(normalize_internal_links(old),rel)
        if new!=old: p.write_text(new,encoding="utf-8"); changed.append(str(p.relative_to(ROOT)))
    sitemap=ROOT/"sitemap.xml"
    if sitemap.exists():
        s=sitemap.read_text(encoding="utf-8"); original=s
        for old,new in REDIRECTS.items():
            s=s.replace("https://dailytoolkit.xyz"+old,"https://dailytoolkit.xyz"+new)
        if s!=original: sitemap.write_text(s,encoding="utf-8")
    print(f"Ahrefs zero-fix pass updated {len(changed)} HTML files and normalized sitemap redirects.")

if __name__=="__main__": main()
