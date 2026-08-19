from pathlib import Path
import re
from html import escape

BASE = "https://dailytoolkit.xyz"
BRAND = "Daily Toolkit"

SEO = {
    "age-calculator": ("Age Calculator Online – Calculate Your Exact Age | Daily Toolkit", "Calculate your exact age from your date of birth in years, months and days. Free online age calculator with an accurate age breakdown and age difference support.", "age calculator, age calculator online, age calculator by date of birth, calculate age, chronological age calculator, age difference calculator"),
    "ats-resume-score-checker": ("ATS Resume Checker – Check Your Resume Score Free | Daily Toolkit", "Check your resume for ATS compatibility, keywords, formatting and job-match issues. Get a practical resume score online for free before applying.", "ATS resume checker, ATS resume score, resume checker, resume scanner, ATS compatibility checker, resume keyword checker"),
    "background-remover": ("Background Remover Online – Remove Image Background Free | Daily Toolkit", "Remove backgrounds from images online with a simple free background remover. Create clean transparent PNG images quickly without installing software.", "background remover, remove background from image, image background remover, transparent background, background eraser online"),
    "barcode-generator": ("Barcode Generator Online – Create Free Barcodes | Daily Toolkit", "Create barcodes online for products, inventory and labels. Generate a downloadable barcode quickly with this free browser-based barcode generator.", "barcode generator, barcode generator online, create barcode, free barcode maker, product barcode generator, barcode maker"),
    "bio-ideas-generator": ("Instagram Bio Ideas Generator – Create Bio Ideas Free | Daily Toolkit", "Generate Instagram bio ideas for personal brands, creators and businesses. Get short, creative and searchable bio ideas online for free.", "instagram bio ideas, bio generator, instagram bio generator, creative bio ideas, social media bio generator"),
    "bmi-calculator": ("BMI Calculator Online – Calculate Body Mass Index | Daily Toolkit", "Calculate your Body Mass Index (BMI) online using height and weight. Get your BMI value, category and a simple explanation with this free calculator.", "BMI calculator, BMI calculator online, body mass index calculator, calculate BMI, BMI by height and weight"),
    "business-break-even-calculator": ("Break-Even Calculator – Calculate Business Break-Even Point | Daily Toolkit", "Calculate your business break-even point, required sales and profit margin using fixed costs, variable costs and selling price. Free online calculator.", "break even calculator, break even point calculator, business break even calculator, break even analysis, sales break even calculator"),
    "color-picker": ("Color Picker Online – Pick HEX, RGB & HSL Colors | Daily Toolkit", "Pick colors online and get HEX, RGB and HSL values instantly. Use this free color picker for web design, UI, graphics and CSS color selection.", "color picker, color picker online, HEX color picker, RGB color picker, HSL color picker, color selector"),
    "compress-pdf": ("Compress PDF Online – Reduce PDF File Size Free | Daily Toolkit", "Compress PDF files online to reduce file size while keeping documents readable. Free PDF compressor for sharing, email, uploads and web use.", "compress PDF, PDF compressor, compress PDF online, reduce PDF size, reduce PDF file size, free PDF compressor"),
    "crypto-price-checker": ("Crypto Price Checker – Check Cryptocurrency Prices | Daily Toolkit", "Check cryptocurrency prices and market information online with a fast crypto price checker. Track popular coins and view current market data.", "crypto price checker, cryptocurrency prices, crypto prices, coin price checker, Bitcoin price checker, crypto market prices"),
    "debt-payoff-calculator": ("Debt Payoff Calculator – Plan Your Debt Repayment | Daily Toolkit", "Calculate how long it may take to pay off debt and estimate interest and monthly payments. Compare repayment plans with this free debt payoff calculator.", "debt payoff calculator, debt repayment calculator, debt snowball calculator, debt avalanche calculator, payoff calculator"),
    "ecommerce-profit-calculator": ("Ecommerce Profit Calculator – Calculate Online Store Profit | Daily Toolkit", "Calculate ecommerce profit, margin and return using product cost, selling price, fees, shipping and other expenses. Free online ecommerce profit calculator.", "ecommerce profit calculator, ecommerce margin calculator, online store profit calculator, Shopify profit calculator, product profit calculator"),
    "emoji-picker": ("Emoji Picker Online – Copy & Paste Emojis Free | Daily Toolkit", "Find, search and copy emojis online for messages, social media, websites and documents. Free emoji picker with quick copy and paste support.", "emoji picker, emoji picker online, copy emojis, emoji copy paste, emoji keyboard online, emoji list"),
    "freelancer-hourly-rate-calculator": ("Freelance Hourly Rate Calculator – Set Your Freelance Rate | Daily Toolkit", "Calculate a freelance hourly rate from your income goal, working hours, expenses, taxes and unpaid time. Find a practical rate for your freelance work.", "freelance hourly rate calculator, freelancer rate calculator, freelance pricing calculator, hourly rate calculator, freelance income calculator"),
    "fuel-price-checker": ("Fuel Price Checker – Check Petrol & Diesel Prices | Daily Toolkit", "Check current fuel price information with a simple online fuel price checker. Compare petrol and diesel prices and plan your travel or vehicle costs.", "fuel price checker, petrol price, diesel price, fuel prices, petrol price checker, diesel price checker"),
    "gold-price-checker": ("Gold Price Checker – Check Gold Prices Online | Daily Toolkit", "Check gold price information online and compare common gold purity levels. Use this free gold price checker to estimate current gold value and rates.", "gold price checker, gold price today, gold rate, gold price online, 24k gold price, 22k gold price"),
    "gradient-generator": ("CSS Gradient Generator – Create Linear & Radial Gradients | Daily Toolkit", "Create beautiful CSS gradients online with a live preview. Generate linear or radial gradient CSS code for websites, apps and UI designs for free.", "CSS gradient generator, gradient generator, CSS gradient, linear gradient generator, radial gradient generator, gradient maker"),
    "hashtag-generator": ("Hashtag Generator – Create Relevant Social Media Hashtags | Daily Toolkit", "Generate relevant hashtag ideas for social media posts, videos and campaigns. Create topic-based hashtags quickly with this free online hashtag generator.", "hashtag generator, hashtag generator online, Instagram hashtag generator, TikTok hashtag generator, social media hashtags"),
    "image-compressor": ("Image Compressor Online – Compress JPG, PNG & WebP | Daily Toolkit", "Compress JPG, PNG and WebP images online to reduce file size while keeping good quality. Fast browser-based image compression for websites and sharing.", "image compressor, image compressor online, compress image, JPG compressor, PNG compressor, WebP compressor, reduce image size"),
    "image-resizer": ("Image Resizer Online – Resize JPG, PNG & WebP Images | Daily Toolkit", "Resize JPG, PNG and WebP images online by width, height or dimensions. Free image resizer for websites, social media, forms and documents.", "image resizer, image resizer online, resize image, resize JPG, resize PNG, image size changer"),
    "image-to-pdf": ("Image to PDF Converter – Convert JPG & PNG to PDF | Daily Toolkit", "Convert JPG, PNG and other images to PDF online. Combine images into a PDF, adjust page settings and download your document with this free converter.", "image to PDF, JPG to PDF, PNG to PDF, image to PDF converter, convert image to PDF, photos to PDF"),
    "instagram-caption-maker": ("Instagram Caption Generator – Create Captions Free | Daily Toolkit", "Create engaging Instagram caption ideas for photos, reels, brands and creators. Generate short, creative captions with this free online caption maker.", "Instagram caption generator, Instagram caption maker, caption ideas, social media caption generator, Reel caption generator"),
    "investment-return-calculator": ("Investment Return Calculator – Calculate ROI & Returns | Daily Toolkit", "Estimate investment growth, profit, total return and ROI from your initial amount, contributions and expected return. Free online investment calculator.", "investment return calculator, ROI calculator, investment calculator, return on investment calculator, investment growth calculator"),
    "ip-finder": ("IP Address Finder – Find Your Public IP Address | Daily Toolkit", "Find your public IP address and basic connection information online. Use this free IP finder to quickly check the IP address visible to websites.", "IP address finder, what is my IP, my IP address, public IP checker, IP lookup, find IP address"),
    "job-offer-comparison-calculator": ("Job Offer Comparison Calculator – Compare Salary & Benefits | Daily Toolkit", "Compare job offers by salary, bonuses, benefits, commute and other costs. Estimate which job offer provides better overall value with this free calculator.", "job offer comparison calculator, compare job offers, salary comparison calculator, job offer calculator, compensation comparison"),
    "loan-calculator": ("Loan Calculator – Calculate Monthly Payment & Interest | Daily Toolkit", "Calculate loan payments, total interest and repayment cost from loan amount, interest rate and term. Free online loan payment calculator with clear results.", "loan calculator, loan payment calculator, monthly payment calculator, interest calculator, EMI calculator, loan interest calculator"),
    "password-gen": ("Password Generator – Create Strong Random Passwords | Daily Toolkit", "Generate strong random passwords online with customizable length, numbers, symbols and letter options. Free password generator for safer accounts.", "password generator, strong password generator, random password generator, secure password generator, password maker"),
    "pdf-merger": ("PDF Merger – Merge Multiple PDF Files Online Free | Daily Toolkit", "Merge multiple PDF files into one document online. Reorder files and create a single PDF quickly with this free browser-based PDF merger.", "PDF merger, merge PDF, merge PDF online, combine PDF files, PDF combiner, free PDF merger"),
    "pdf-splitter": ("PDF Splitter – Split PDF Pages Online Free | Daily Toolkit", "Split a PDF into separate files or extract selected pages online. Free PDF splitter for organizing, sharing and managing PDF documents.", "PDF splitter, split PDF, split PDF online, extract PDF pages, PDF page extractor, separate PDF pages"),
    "pdf-to-image": ("PDF to Image Converter – Convert PDF Pages to JPG & PNG | Daily Toolkit", "Convert PDF pages to JPG or PNG images online. Turn document pages into shareable image files quickly with this free PDF to image converter.", "PDF to image, PDF to JPG, PDF to PNG, PDF converter, convert PDF to image, PDF page to image"),
    "pension-calculator": ("Pension Calculator – Estimate Retirement Pension & Income | Daily Toolkit", "Estimate retirement pension and income using age, contributions, savings and expected returns. Free pension calculator for planning your future finances.", "pension calculator, retirement pension calculator, pension estimate, retirement income calculator, pension planning calculator"),
    "qr-generator": ("QR Code Generator – Create Free QR Codes Online | Daily Toolkit", "Create free QR codes for URLs, text, Wi-Fi, contact details and more. Customize and download QR codes quickly with this browser-based generator.", "QR code generator, QR generator, QR code maker, create QR code, free QR code generator, WiFi QR code, URL QR code"),
    "retirement-calculator": ("Retirement Calculator – Plan Your Retirement Savings | Daily Toolkit", "Estimate how much you may need for retirement and project future savings from your current age, contributions, return and retirement goal.", "retirement calculator, retirement savings calculator, retirement planning calculator, how much to retire, retirement income calculator"),
    "salary-take-home-calculator": ("Salary Take-Home Calculator – Estimate Net Pay | Daily Toolkit", "Estimate take-home pay and net salary from gross income, deductions, taxes and contributions. Free salary calculator for comparing your expected paycheck.", "salary take home calculator, take home pay calculator, net salary calculator, paycheck calculator, salary calculator"),
    "stock-price-tracker": ("Stock Price Tracker – Track Stock Prices & Market Data | Daily Toolkit", "Track stock prices and market information online with a simple stock price tracker. Check symbols and current market data in one place.", "stock price tracker, stock price checker, stock market tracker, share price tracker, stock price today"),
    "text-case-converter": ("Text Case Converter – Convert Uppercase, Lowercase & More | Daily Toolkit", "Convert text to uppercase, lowercase, title case, sentence case and other formats instantly. Free online text case converter for writing and editing.", "text case converter, uppercase converter, lowercase converter, title case converter, sentence case converter, text formatter"),
    "unit-converter": ("Unit Converter – Convert Length, Weight, Temperature & More | Daily Toolkit", "Convert common units for length, weight, temperature, area, volume and more. Fast free online unit converter with clear conversion results.", "unit converter, unit conversion, length converter, weight converter, temperature converter, measurement converter"),
    "url-encoder-decoder": ("URL Encoder & Decoder – Encode or Decode URLs Online | Daily Toolkit", "Encode and decode URLs online using percent encoding. Convert special characters safely for web addresses, query strings and developers.", "URL encoder, URL decoder, URL encode, URL decode, percent encoding, encode URL online"),
    "website-seo-audit": ("SEO Audit Tool – Check Website SEO Issues Free | Daily Toolkit", "Run a practical website SEO audit and check titles, meta descriptions, headings, links and other on-page SEO signals. Free online SEO checker.", "SEO audit tool, website SEO audit, SEO checker, on page SEO checker, website SEO checker, SEO analysis tool"),
    "website-seo-audit-tool": ("Website SEO Checker – Analyze On-Page SEO & Metadata | Daily Toolkit", "Analyze a website's on-page SEO signals including title, description, headings, links and metadata. Free website SEO checker for quick audits.", "website SEO checker, SEO checker online, on page SEO analyzer, website SEO analyzer, SEO analysis tool, meta tag checker"),
    "word-counter": ("Word Counter – Count Words, Characters & Sentences Online | Daily Toolkit", "Count words, characters, sentences, paragraphs and reading time instantly. Free online word counter for writers, students, SEO and content creators.", "word counter, word count tool, character counter, sentence counter, word counter online, reading time calculator"),
}


def replace_meta(html, pattern, replacement):
    return re.sub(pattern, replacement, html, count=1, flags=re.I | re.S)


def optimize(path, slug):
    html = path.read_text(encoding="utf-8")
    title, desc, keywords = SEO[slug]
    url = f"{BASE}/tools/{slug}"

    html = replace_meta(html, r"<title>.*?</title>", f"<title>{escape(title)}</title>")
    html = replace_meta(html, r'<meta\s+name=["\']description["\'][^>]*>', f'<meta name="description" content="{escape(desc)}">')
    html = replace_meta(html, r'<meta\s+name=["\']keywords["\'][^>]*>', f'<meta name="keywords" content="{escape(keywords)}">')
    html = replace_meta(html, r'<meta\s+name=["\']robots["\'][^>]*>', '<meta name="robots" content="index, follow, max-image-preview:large">')
    html = replace_meta(html, r'<meta\s+name=["\']author["\'][^>]*>', '<meta name="author" content="Daily Toolkit">')

    canonical = f'  <link rel="canonical" href="{url}">\n'
    if re.search(r'<link\s+rel=["\']canonical["\']', html, re.I):
        html = replace_meta(html, r'<link\s+rel=["\']canonical["\'][^>]*>', canonical.strip())
    else:
        html = re.sub(r'(</head>)', canonical + r'\1', html, count=1, flags=re.I)

    html = replace_meta(html, r'<meta\s+property=["\']og:title["\'][^>]*>', f'<meta property="og:title" content="{escape(title)}">')
    html = replace_meta(html, r'<meta\s+property=["\']og:description["\'][^>]*>', f'<meta property="og:description" content="{escape(desc)}">')
    html = replace_meta(html, r'<meta\s+property=["\']og:url["\'][^>]*>', f'<meta property="og:url" content="{url}">')
    html = replace_meta(html, r'<meta\s+name=["\']twitter:title["\'][^>]*>', f'<meta name="twitter:title" content="{escape(title)}">')
    html = replace_meta(html, r'<meta\s+name=["\']twitter:description["\'][^>]*>', f'<meta name="twitter:description" content="{escape(desc)}">')

    path.write_text(html, encoding="utf-8")


if __name__ == "__main__":
    tools = Path("tools")
    changed = 0
    for path in sorted(tools.glob("*.html")):
        slug = path.stem
        if slug in SEO:
            optimize(path, slug)
            changed += 1
    print(f"Optimized {changed} tool pages.")
    missing = sorted(set(p.stem for p in tools.glob("*.html")) - set(SEO))
    if missing:
        print("Unmapped tool pages:", ", ".join(missing))
        raise SystemExit(1)
