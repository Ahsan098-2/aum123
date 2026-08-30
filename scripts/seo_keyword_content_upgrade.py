from pathlib import Path
import re
from html import escape

BASE = "https://dailytoolkit.xyz"

# High-value keyword families requested for DailyToolkit.
# Existing pages receive a relevant primary/secondary cluster automatically.
KEYWORD_OVERRIDES = {
    "age-calculator": ("age calculator", ["age calculator online", "calculate age", "age calculator by date of birth", "exact age calculator", "age difference calculator"]),
    "bmi-calculator": ("BMI calculator", ["BMI calculator online", "body mass index calculator", "calculate BMI", "BMI by height and weight"]),
    "loan-calculator": ("loan calculator", ["loan payment calculator", "monthly payment calculator", "loan interest calculator", "EMI calculator"]),
    "retirement-calculator": ("retirement calculator", ["retirement savings calculator", "retirement planning calculator", "retirement income calculator"]),
    "pension-calculator": ("pension calculator", ["retirement pension calculator", "pension estimate", "retirement income calculator"]),
    "investment-return-calculator": ("investment return calculator", ["ROI calculator", "investment calculator", "return on investment calculator", "investment growth calculator"]),
    "salary-take-home-calculator": ("salary take home calculator", ["take home pay calculator", "net salary calculator", "paycheck calculator", "salary calculator"]),
    "debt-payoff-calculator": ("debt payoff calculator", ["debt repayment calculator", "debt snowball calculator", "debt avalanche calculator"]),
    "business-break-even-calculator": ("break even calculator", ["break even point calculator", "business break even calculator", "break even analysis"]),
    "ecommerce-profit-calculator": ("ecommerce profit calculator", ["ecommerce margin calculator", "online store profit calculator", "product profit calculator"]),
    "freelancer-hourly-rate-calculator": ("freelance hourly rate calculator", ["freelancer rate calculator", "freelance pricing calculator", "hourly rate calculator"]),
    "job-offer-comparison-calculator": ("job offer comparison calculator", ["compare job offers", "salary comparison calculator", "compensation comparison"]),
    "compress-pdf": ("compress PDF", ["PDF compressor", "compress PDF online", "reduce PDF size", "reduce PDF file size"]),
    "pdf-merger": ("merge PDF", ["PDF merger", "merge PDF online", "combine PDF files", "PDF combiner"]),
    "pdf-splitter": ("split PDF", ["PDF splitter", "split PDF online", "extract PDF pages", "PDF page extractor"]),
    "pdf-to-image": ("PDF to image", ["PDF to JPG", "PDF to PNG", "convert PDF to image", "PDF page to image"]),
    "image-to-pdf": ("image to PDF", ["JPG to PDF", "PNG to PDF", "image to PDF converter", "convert image to PDF"]),
    "image-compressor": ("image compressor", ["compress image", "JPG compressor", "PNG compressor", "WebP compressor", "reduce image size"]),
    "image-resizer": ("image resizer", ["resize image", "resize JPG", "resize PNG", "image size changer"]),
    "background-remover": ("background remover", ["remove background from image", "image background remover", "transparent background"]),
    "unit-converter": ("unit converter", ["unit conversion", "length converter", "weight converter", "temperature converter", "measurement converter"]),
    "url-encoder-decoder": ("URL encoder", ["URL decoder", "URL encode", "URL decode", "percent encoding"]),
    "website-seo-audit": ("SEO audit tool", ["website SEO audit", "SEO checker", "on page SEO checker", "website SEO checker"]),
    "website-seo-audit-tool": ("website SEO checker", ["SEO checker online", "on page SEO analyzer", "website SEO analyzer", "meta tag checker"]),
    "word-counter": ("word counter", ["word count tool", "character counter", "sentence counter", "reading time calculator"]),
    "password-gen": ("password generator", ["strong password generator", "random password generator", "secure password generator", "password maker"]),
    "qr-generator": ("QR code generator", ["QR generator", "QR code maker", "create QR code", "free QR code generator", "WiFi QR code"]),
    "color-picker": ("color picker", ["color picker online", "HEX color picker", "RGB color picker", "HSL color picker"]),
    "gradient-generator": ("CSS gradient generator", ["gradient generator", "linear gradient generator", "radial gradient generator", "gradient maker"]),
    "crypto-price-checker": ("crypto price checker", ["cryptocurrency prices", "crypto prices", "Bitcoin price checker", "crypto market prices"]),
    "stock-price-tracker": ("stock price tracker", ["stock price checker", "stock market tracker", "share price tracker"]),
    "fuel-price-checker": ("fuel price checker", ["petrol price", "diesel price", "fuel prices", "petrol price checker"]),
    "gold-price-checker": ("gold price checker", ["gold price today", "gold rate", "gold price online", "24k gold price", "22k gold price"]),
    "ats-resume-score-checker": ("ATS resume checker", ["ATS resume score", "resume checker", "resume scanner", "ATS compatibility checker"]),
    "bio-ideas-generator": ("Instagram bio ideas", ["Instagram bio generator", "bio generator", "creative bio ideas", "social media bio generator"]),
    "hashtag-generator": ("hashtag generator", ["Instagram hashtag generator", "TikTok hashtag generator", "social media hashtags"]),
    "instagram-caption-maker": ("Instagram caption generator", ["Instagram caption maker", "caption ideas", "Reel caption generator"]),
    "emoji-picker": ("emoji picker", ["emoji picker online", "copy emojis", "emoji copy paste", "emoji keyboard online"]),
    "barcode-generator": ("barcode generator", ["barcode generator online", "create barcode", "free barcode maker", "product barcode generator"]),
    "ip-finder": ("IP address finder", ["what is my IP", "my IP address", "public IP checker", "IP lookup"]),
}

CATEGORY_RULES = [
    (("pdf", "document", "word", "excel", "powerpoint"), "Document and PDF Utility"),
    (("image", "photo", "background", "color", "gradient"), "Image and Design Utility"),
    (("calculator", "loan", "salary", "pension", "retirement", "debt", "profit", "investment"), "Calculator"),
    (("converter", "encode", "decode", "timestamp", "unit"), "Converter and Developer Utility"),
    (("seo", "sitemap", "robots", "meta", "canonical"), "SEO and Webmaster Utility"),
    (("password", "hash", "uuid", "security"), "Security Utility"),
    (("qr", "barcode"), "QR and Barcode Utility"),
    (("word", "text", "case", "character"), "Text Utility"),
]


def title_from_slug(slug):
    special = {
        "pdf": "PDF", "seo": "SEO", "qr": "QR", "url": "URL", "ip": "IP", "ats": "ATS", "bmi": "BMI", "jpg": "JPG", "png": "PNG", "webp": "WebP", "css": "CSS", "html": "HTML", "json": "JSON", "xml": "XML", "api": "API"
    }
    words = []
    for word in slug.split("-"):
        words.append(special.get(word.lower(), word.capitalize()))
    return " ".join(words)


def cluster_for(slug):
    if slug in KEYWORD_OVERRIDES:
        return KEYWORD_OVERRIDES[slug]
    title = title_from_slug(slug)
    primary = title.lower()
    if not primary.endswith(("calculator", "converter", "generator", "checker", "tracker", "finder", "counter", "picker", "remover", "resizer", "merger", "splitter")):
        primary += " online"
    related = [f"{primary} online", f"free {primary}", f"{primary} tool", f"how to use {primary}"]
    return primary, related


def category_for(slug):
    low = slug.lower()
    for needles, category in CATEGORY_RULES:
        if any(n in low for n in needles):
            return category
    return "Online Utility"


def content_block(slug):
    primary, related = cluster_for(slug)
    title = title_from_slug(slug)
    category = category_for(slug)
    related_html = "".join(f"<li>{escape(k)}</li>" for k in related[:5])
    return f'''\n<section class="seo-content-section" aria-labelledby="seo-content-title">\n  <div class="seo-content-inner">\n    <h2 id="seo-content-title">{escape(title)} Online</h2>\n    <p>Use this free <strong>{escape(primary)}</strong> from Daily Toolkit to complete your task quickly in your browser. This {escape(category.lower())} is designed to be simple, fast and easy to use on desktop and mobile devices.</p>\n    <h3>How to Use This Tool</h3>\n    <ol>\n      <li>Enter or upload the information required by the tool.</li>\n      <li>Choose the available options that match your task.</li>\n      <li>Run the tool and review the result before downloading or copying it.</li>\n    </ol>\n    <h3>Popular Related Searches</h3>\n    <ul>{related_html}</ul>\n    <h3>Frequently Asked Questions</h3>\n    <h4>Is this {escape(primary)} free?</h4>\n    <p>Yes. Daily Toolkit provides this online utility for free, with no software installation required.</p>\n    <h4>Can I use it on a phone?</h4>\n    <p>Yes. The tool is designed to work in a modern mobile or desktop browser.</p>\n  </div>\n</section>\n'''


def inject(html, slug):
    marker = 'class="seo-content-section"'
    if marker in html:
        return html
    block = content_block(slug)
    if re.search(r"</body>", html, re.I):
        return re.sub(r"</body>", block + "</body>", html, count=1, flags=re.I)
    return html + block


def add_meta_keywords(html, slug):
    primary, related = cluster_for(slug)
    keywords = ", ".join([primary] + related)
    tag = f'<meta name="keywords" content="{escape(keywords)}">'
    pattern = r'<meta\s+name=["\']keywords["\'][^>]*>'
    if re.search(pattern, html, re.I):
        return re.sub(pattern, tag, html, count=1, flags=re.I)
    return re.sub(r"</head>", "  " + tag + "\n</head>", html, count=1, flags=re.I)


def main():
    tools = Path("tools")
    changed = 0
    for path in sorted(tools.glob("*.html")):
        slug = path.stem
        html = path.read_text(encoding="utf-8")
        updated = add_meta_keywords(html, slug)
        updated = inject(updated, slug)
        if updated != html:
            path.write_text(updated, encoding="utf-8")
            changed += 1
    print(f"Added keyword/content SEO sections to {changed} tool pages.")


if __name__ == "__main__":
    main()
