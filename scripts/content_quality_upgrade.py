from pathlib import Path
import html
import re

ROOT = Path('.')
TOOLS = ROOT / 'tools'
ARTICLES = ROOT / 'articles'
MARKER = '<!-- DAILY TOOLKIT CONTENT UPGRADE -->'


def title_from_slug(slug):
    special = {'pdf': 'PDF', 'qr': 'QR', 'url': 'URL', 'seo': 'SEO', 'ip': 'IP', 'ats': 'ATS', 'bmi': 'BMI', 'api': 'API'}
    return ' '.join(special.get(p, p.capitalize()) for p in slug.split('-'))


def tool_copy(name):
    return f'''{MARKER}
<section class="tool-content-guide" aria-labelledby="tool-guide-title">
  <div class="tool-content-inner">
    <p class="tool-content-eyebrow">Practical Guide</p>
    <h2 id="tool-guide-title">{html.escape(name)}: How It Works and When to Use It</h2>
    <p><strong>{html.escape(name)}</strong> is designed to turn a common digital task into a simple, repeatable workflow. Instead of switching between several websites or installing software for a small job, you can use this page to complete the task directly in your browser. The tool is intended to be clear for first-time visitors while still being useful for people who perform the same task regularly. The result depends on the information or files you provide, so reviewing your input before starting is always a good habit. For sensitive documents, only upload material you are comfortable processing through an online service and avoid entering private information unless it is necessary for the task.</p>

    <h3>How to Use {html.escape(name)}</h3>
    <ol>
      <li>Open the tool and read the labels or short instructions shown above the controls.</li>
      <li>Enter the required values, select the appropriate options, or choose the file you want to process.</li>
      <li>Check your selections before starting. Correct inputs usually produce a more useful result and reduce the need to repeat the task.</li>
      <li>Click the main action button and wait for the result to appear. Larger files or more complex calculations can take a little longer.</li>
      <li>Review the output and download, copy, save, or reuse it as appropriate. If the result is not what you expected, change one input at a time and run the tool again.</li>
    </ol>

    <h3>Key Features</h3>
    <p>This tool focuses on speed, straightforward controls, and a result that is easy to understand. It is available directly from a modern web browser, so there is no separate desktop installation step. A useful interface should make the required input obvious, keep optional settings understandable, and avoid unnecessary steps. Where the tool works with files, choosing the correct source file and checking the final output are important parts of the workflow. Where it performs calculations or transformations, consistent inputs make results easier to compare. The page is also structured so visitors can learn the purpose of the tool before they use it rather than relying only on the form.</p>

    <h3>Why Use This Tool?</h3>
    <p>{html.escape(name)} can be useful for students, office workers, freelancers, creators, small businesses, developers, and everyday internet users who need a quick result without learning complicated software. It is particularly helpful when a task is occasional and installing a dedicated application would add unnecessary friction. For repeated work, the same page can become part of a simple routine: prepare the input, process it, verify the output, and continue with the next step. The tool is not a substitute for professional advice where a decision has legal, medical, financial, or security consequences, but it can save time on routine digital work.</p>

    <h3>FAQs</h3>
    <div class="tool-faq">
      <details><summary>Is {html.escape(name)} free to use?</summary><p>Yes. The tool is provided as a free online utility. Some advanced third-party services may have their own limits, but the Daily Toolkit interface does not require a paid desktop application.</p></details>
      <details><summary>Do I need to install software?</summary><p>No installation is required for normal use. Open the page in a supported browser, provide the required input, and follow the instructions shown on the tool.</p></details>
      <details><summary>What should I do if the result looks wrong?</summary><p>Check the input first, especially dates, numbers, file selection, units, or formatting options. Correct one setting at a time and run the tool again so you can identify what changed.</p></details>
      <details><summary>Does the tool work on mobile?</summary><p>The page is designed for modern browsers on phones, tablets, and computers. For file-based tasks, your browser and device may still impose practical file-size or storage limits.</p></details>
    </div>
  </div>
</section>
<style>
.tool-content-guide{margin:2rem auto 0;padding:2.2rem 0;border-top:1px solid #EFEFEF}.tool-content-inner{max-width:900px;margin:auto;color:#202020}.tool-content-eyebrow{text-transform:uppercase;letter-spacing:.14em;font-size:.7rem;font-weight:700;color:#A07B22;margin-bottom:.55rem}.tool-content-inner h2{font-family:Georgia,serif;font-size:clamp(1.55rem,3vw,2.25rem);line-height:1.2;margin:0 0 1rem}.tool-content-inner h3{font-family:Georgia,serif;font-size:1.25rem;margin:1.8rem 0 .65rem}.tool-content-inner p,.tool-content-inner li{font-size:.95rem;line-height:1.8;color:#555}.tool-content-inner ol{padding-left:1.25rem}.tool-content-inner li{margin:.45rem 0}.tool-faq{display:grid;gap:.7rem}.tool-faq details{border:1px solid #EFEFEF;border-radius:6px;padding:.85rem 1rem;background:#FAFAFA}.tool-faq summary{cursor:pointer;font-weight:600;color:#222}.tool-faq details p{margin:.65rem 0 0}
</style>
'''


def article_html(title, slug, intro, sections, faq):
    body = [f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)} | Daily Toolkit</title><meta name="description" content="{html.escape(intro[:155])}"><meta name="robots" content="index,follow"><link rel="canonical" href="https://dailytoolkit.xyz/articles/{slug}"><style>body{{font-family:Inter,Arial,sans-serif;line-height:1.8;color:#222;max-width:900px;margin:auto;padding:40px 20px}}h1,h2{{font-family:Georgia,serif;line-height:1.25}}h1{{font-size:2.4rem}}h2{{margin-top:2rem}}.meta{{color:#777}}a{{color:#8a6a20}}li{{margin:.5rem 0}}</style></head><body><p><a href="/">Daily Toolkit</a> · <a href="/blog">Blog</a></p><h1>{html.escape(title)}</h1><p class="meta">Practical guide · Updated August 2026</p><p>{html.escape(intro)}</p>''']
    for heading, paras in sections:
        body.append(f'<h2>{html.escape(heading)}</h2>')
        for p in paras:
            body.append(f'<p>{html.escape(p)}</p>')
    body.append('<h2>Frequently Asked Questions</h2>')
    for q, a in faq:
        body.append(f'<h3>{html.escape(q)}</h3><p>{html.escape(a)}</p>')
    body.append('<p><a href="/blog">Back to Daily Toolkit Blog</a> · <a href="/tools.html">Browse all tools</a></p></body></html>')
    return '\n'.join(body)


def build_articles():
    ARTICLES.mkdir(exist_ok=True)
    data = [
      ('how-to-compress-a-pdf-without-losing-important-quality','How to Compress a PDF Without Losing Important Quality','Large PDFs are inconvenient to upload, email, store, and share. A good compression workflow reduces unnecessary file weight while keeping the information people actually need readable and usable.',[
        ('Start with the right source file',['Compression works best when you understand what makes the document large. A PDF made mostly from text is usually much smaller than a scanned document containing dozens of high-resolution photographs. Before compressing, keep an original copy. That gives you a clean backup if the compressed version becomes too small or if a recipient needs the original quality.','For business and school documents, check whether the PDF contains scans, screenshots, embedded fonts, or large images. If the file was exported from a design application, its export settings may have added more image resolution than the final audience needs. Knowing the source helps you choose a sensible compression level instead of repeatedly compressing the same file.']),
        ('Choose a practical compression level',['There is no single perfect compression setting. A document intended for on-screen reading can often tolerate more image reduction than a file that will be printed. Start with a balanced setting and compare the output with the original. Look at small text, diagrams, signatures, photographs, and page edges rather than judging only the file size.','A useful rule is to optimize for the destination. Email attachments and website uploads often benefit from a smaller file, while professional print work may need higher image resolution. If a form contains tiny scanned text, aggressive compression can make that text difficult to read.']),
        ('A simple browser workflow',['Open Daily Toolkit’s PDF compression tool, select the PDF, choose the available compression option, and start processing. When the result is ready, open it before sharing. Confirm that every page is present, text remains readable, and important images or signatures still look correct.','For repeated work, use a small quality checklist: page count, readability, orientation, links if they matter, and final file size. This takes less time than discovering after delivery that a page is missing or an important detail became blurry.']),
        ('Common mistakes to avoid',['Do not delete the original before checking the compressed copy. Avoid compressing an already compressed PDF multiple times because repeated image processing can gradually reduce visual quality. Also avoid judging success by file size alone. A 90 percent reduction is not useful if the document becomes unreadable.','If the PDF remains unusually large, inspect the source. A few oversized photographs can account for most of the file weight. Resizing those images before creating the PDF can sometimes produce a better result than repeatedly compressing the finished document.'])],
        [('Can compression change the PDF layout?','A sensible compression process should preserve the page layout, but always review the output before sharing it.'),('Is a smaller PDF always better?','No. The best file is small enough for its purpose while retaining the quality required by the reader.'),('Should I keep the original?','Yes. Keep the original until the compressed version has been checked and accepted.')]),
      ('how-to-convert-images-to-pdf-online','How to Convert Images to PDF Online: A Practical Guide','Converting JPG, PNG, or other images into a PDF is useful for forms, receipts, scanned notes, portfolios, and document sharing. The key is arranging images correctly and checking the final document.',[
        ('Prepare your images',['Use clear source images and place them in the order you want them to appear. If you are combining several pages, consistent orientation makes the final PDF easier to read. Rename files with simple numbers when order matters, such as 01, 02, and 03.','Check the image edges before conversion. Cropped signatures, tilted scans, and low-resolution photographs can remain problematic after they become PDF pages. Conversion changes the container format; it does not magically restore missing detail.']),
        ('Convert and review',['Select the images in Daily Toolkit’s image-to-PDF tool and generate the document. If the tool provides page ordering or layout choices, use them before starting. After conversion, open the PDF and move through every page.','For documents that will be printed, pay attention to page size and image scaling. For online sharing, a balanced resolution is often enough. If the PDF becomes unnecessarily large, compress it after confirming that the pages are correct.']),
        ('Useful real-world workflows',['Students can combine photographed notes into one file, freelancers can turn scanned receipts into a single expense document, and small businesses can collect several invoices into a convenient archive. The same workflow works for multi-page applications and signed forms.','For records, use descriptive filenames that include the subject and date. A file such as project-invoice-2026-08.pdf is easier to locate later than image1.pdf.']),
        ('Quality and privacy checks',['Before uploading personal paperwork, consider whether the document contains information that should remain private. Use only services you trust and avoid unnecessary copies. After downloading the result, confirm that the PDF contains the intended images and that no unrelated file was selected.'])],
        [('Can multiple images become one PDF?','Yes. Select the images you want included and arrange them in the required page order before generating the PDF.'),('Will JPG quality improve after conversion?','No. PDF conversion preserves the available image information; it does not recreate detail that is absent from the source.'),('Can I compress the result?','Yes. A PDF created from photographs can often be reduced further with a PDF compression tool.')]),
      ('age-calculator-guide-exact-age-by-date-of-birth','Age Calculator Guide: How to Calculate Exact Age by Date of Birth','An age calculator compares a birth date with a target date and expresses the difference in a form people can understand. This guide explains the practical details behind years, months, and days.',[
        ('Why date-based age calculation is useful',['A simple subtraction of birth years is not enough when the birthday has not happened yet in the current year. A date-based calculation checks the month and day as well, producing a chronological age that is more precise.','People use age calculations for school forms, eligibility checks, birthdays, planning milestones, and general curiosity. The target date does not always have to be today; comparing two dates can be useful when planning an event or checking a historical age.']),
        ('How the calculation works',['The calculator begins with the date of birth and a target date. It determines complete years first, then accounts for remaining months and days. Calendar months have different lengths, so a reliable calculator should handle month boundaries rather than assuming every month has the same number of days.','Leap years are another reason manual shortcuts can be unreliable. A date-aware calculation follows the calendar instead of using a fixed number of days for every year.']),
        ('How to use an age calculator',['Enter the correct birth date, select today or another target date, and start the calculation. Read the result and verify the input before using it in an official context. If the result is for a form with a specific reference date, use that date instead of the current date.','For an age gap, calculate both people separately against the same target date. This avoids comparing ages measured on different days.']),
        ('Practical checks',['Always verify day, month, and year because a single digit error changes the result. For official eligibility decisions, follow the organization’s stated rules because some programs define age using a particular cutoff date rather than simply today.'])],
        [('Can I calculate age on a future date?','Yes. Use the future date as the target date when the tool supports a custom calculation date.'),('Why can age differ by one year from a quick calculation?','A birthday may not have occurred yet in the current year, so subtracting years alone can be off by one.'),('Does a leap year matter?','Yes. A date-aware calculator accounts for calendar differences and leap years when determining the interval.')]),
      ('how-to-use-a-loan-calculator-and-understand-emi','How to Use a Loan Calculator and Understand EMI','A loan calculator helps turn a loan amount, interest rate, and repayment period into an estimated payment schedule. Understanding the inputs is as important as reading the final monthly figure.',[
        ('Know the inputs',['The principal is the amount borrowed. The interest rate describes the cost of borrowing, while the term describes how long repayment continues. Some calculators also ask for fees, a down payment, or payment frequency.','Before entering numbers, confirm whether the quoted rate is annual and whether the calculator assumes monthly payments. Different loan products can use different conventions, so a calculator result is an estimate rather than a contract.']),
        ('Read the result correctly',['A lower monthly payment is not automatically a cheaper loan. Extending the repayment period can reduce the monthly amount while increasing total interest paid. Look at both the periodic payment and the overall repayment cost.','If the tool provides an amortization schedule, use it to see how the balance changes over time. Early payments can contain a larger interest component, while later payments may reduce principal more quickly.']),
        ('Use scenarios instead of one guess',['Run several realistic scenarios. Compare a shorter term with a longer term, or test a slightly higher down payment. This can show how sensitive the payment is to changes in the inputs.','Keep your assumptions written down when comparing lenders. A rate-only comparison can be misleading if one option includes processing fees, insurance, or other charges.']),
        ('Important caution',['Calculator outputs should support planning, not replace the lender’s official offer or a qualified financial adviser. Read the actual loan agreement, confirm fees, and make sure the payment fits your budget under realistic circumstances.'])],
        [('Is EMI the total cost of a loan?','No. EMI is the periodic payment. Total repayment can include interest and other charges.'),('Why does a longer term reduce the monthly payment?','The balance is spread across more payments, but the longer period can increase total interest.'),('Are calculator results exact?','They are estimates based on the assumptions entered. The lender’s final schedule controls the actual obligation.')]),
      ('pdf-merge-vs-pdf-split-which-tool-to-use','PDF Merge vs PDF Split: Which Tool Should You Use?','PDF organization becomes easier when you know whether you need to combine documents or extract only selected pages. The two tasks solve opposite problems and are common in everyday document work.',[
        ('When to merge PDFs',['Merging is useful when related files need to become one document. Examples include combining a cover letter, resume, certificates, or several invoices into one submission. It can also make an archive easier to manage.','Before merging, check the order of files and remove accidental duplicates. Consistent page orientation and descriptive source filenames make the process easier to audit.']),
        ('When to split a PDF',['Splitting is useful when a large document contains pages that belong to different projects or when only a few pages need to be shared. Extracting the required pages can reduce file size and limit unnecessary disclosure.','For a scanned book or report, page ranges are usually easier to manage than manually deleting pages one at a time. Always open the extracted PDF to confirm the first and last pages are correct.']),
        ('A safe document workflow',['Keep an untouched original, perform the merge or split, review the result, and then store the final copy with a clear filename. For confidential paperwork, share only the pages required for the recipient.','If the resulting document is still too large, compress it after organization rather than repeatedly editing the same file.']),
        ('Quality checks',['Check page count, readability, orientation, bookmarks if important, and whether links still work. For applications, verify that signatures and supporting documents are in the expected order before submission.'])],
        [('Can I merge many PDFs?','Yes, provided the tool and browser can process the combined file size.'),('Can I extract selected pages?','Yes. A PDF splitter is designed for extracting ranges or individual pages.'),('Should I keep the original files?','Yes. Keep the originals until you have verified the final combined or extracted document.')]),
      ('password-generator-best-practices','Password Generator Best Practices for Safer Accounts','A password generator can create long, unpredictable strings, but the generated password is only one part of good account security. Safe storage and unique passwords matter just as much.',[
        ('Why random passwords help',['Human-created passwords often contain names, dates, familiar words, or predictable substitutions. Random generation removes much of that pattern and makes guessing harder.','Use a different password for every important account. If one service is breached, unique credentials prevent the same password from opening other accounts.']),
        ('Choose length over cleverness',['Long passwords provide a larger search space. A generator can combine letters, numbers, and symbols when a website requires them, but length and uniqueness are usually more useful than trying to invent complicated patterns yourself.','Avoid adding a predictable personal detail to a generated password. Do not reuse a password simply because a site has not yet shown any sign of compromise.']),
        ('Store credentials carefully',['A reputable password manager can create and store unique passwords, reducing the temptation to reuse them. Enable multi-factor authentication wherever it is available, especially for email, banking, and account recovery services.','Never paste passwords into public posts, shared documents, or screenshots. Treat recovery codes as sensitive credentials as well.']),
        ('What generators cannot solve',['A strong password does not protect an account if the device is infected, a phishing page captures the login, or recovery settings are weak. Check the website address before signing in and consider passkeys or multi-factor authentication when supported.'])],
        [('Should every account have a different password?','Yes, especially for email, financial, cloud, and social accounts.'),('Is a generated password safe to share?','No. Treat it as a private credential and store it securely.'),('Should I use a password manager?','A reputable password manager can make unique-password habits much easier to maintain.')]),
      ('how-to-resize-images-for-web-and-social-media','How to Resize Images for Websites and Social Media','Image dimensions affect loading speed, layout, and presentation quality. Resizing is different from cropping or compressing, and choosing the right workflow helps an image look sharp without being unnecessarily large.',[
        ('Understand dimensions',['Width and height determine the image dimensions, usually measured in pixels. A large camera photo may contain far more pixels than a website needs. Serving a smaller version can reduce download work and improve page performance.','Keep the original image as a master copy. Create resized versions for specific uses so you can return to the source when another platform needs a different dimension.']),
        ('Preserve the important subject',['If the target ratio is different from the source, simply changing both dimensions can make people or objects look stretched. When composition matters, crop to the desired ratio first or use a tool that preserves aspect ratio.','For profile images, thumbnails, and social cards, check the platform’s current recommended dimensions rather than relying on a generic size.']),
        ('Resize then compress',['A useful workflow is to resize to the actual display dimensions first and then compress the result. There is little benefit in compressing a huge image that will later be reduced dramatically.','Open the final file on both a phone and desktop when the image is important. Small text and fine details can look different at different display sizes.']),
        ('Avoid common mistakes',['Do not overwrite the only copy of the original. Avoid enlarging small images when quality matters because interpolation cannot recreate detail that was never captured. Choose a modern format when the destination supports it, but keep compatibility in mind.'])],
        [('Does resizing reduce quality?','Reducing dimensions can discard pixels, but careful resizing usually preserves a useful visual result.'),('Should I resize or compress first?','For web images, resizing to the needed dimensions first and compressing second is often efficient.'),('Can I resize on a phone?','Yes. Modern mobile browsers can handle many image resizing tasks, subject to device and file-size limits.')]),
      ('qr-code-guide-for-business-and-personal-use','QR Code Guide: Practical Uses for Business and Personal Projects','QR codes provide a quick bridge between printed material and digital content. They are useful for links, contact information, event details, menus, forms, and other destinations that are awkward to type manually.',[
        ('Choose the destination first',['Before generating a QR code, decide exactly what it should open. A short, stable URL is easier to manage than a long tracking-heavy address. Test the destination in a normal browser before creating the code.','For printed material, think about the life of the QR code. If the destination may change, consider using a URL you control so the destination can be updated without replacing every printed code.']),
        ('Make the code easy to scan',['Keep enough contrast between the code and its background, leave a clear margin around it, and avoid placing decorative elements over the data pattern. A code that looks attractive but scans poorly is not useful.','Print a test copy at the approximate final size and scan it with more than one phone if possible. This catches problems that are invisible on a large desktop preview.']),
        ('Useful examples',['Businesses can link menus, maps, booking pages, product information, or feedback forms. Teachers can share resources, while event organizers can link schedules and registration pages. Individuals can share a portfolio, contact card, or Wi-Fi details when appropriate.','Use descriptive labels near printed codes so people know what will happen after scanning. This improves trust and accessibility because the user is not asked to scan an unexplained square.']),
        ('Measure and maintain',['If analytics matter, use a controlled redirect or campaign URL rather than changing the QR image every time. Monitor the destination and replace codes when the underlying link is permanently retired.'])],
        [('Can a QR code store a website link?','Yes. Website URLs are one of the most common QR code uses.'),('Why does a QR code sometimes fail to scan?','Low contrast, missing margins, excessive decoration, tiny print size, or a damaged code can cause scanning problems.'),('Should I test a printed QR code?','Yes. Testing at the final print size is strongly recommended.')]),
      ('word-counter-guide-for-writing-and-seo','Word Counter Guide: Why Word Count Matters for Writing and SEO','Word count is a useful measurement, but it should not become the only goal of writing. A good counter helps writers understand length, pacing, and requirements while the actual quality comes from relevance and clarity.',[
        ('Use word count for requirements',['Students, editors, clients, and publishers may specify minimum or maximum lengths. A counter gives you an objective measurement instead of relying on visual judgment.','Check whether the requirement counts headings, citations, or captions. Different platforms can apply different counting rules, so use the official requirement when one exists.']),
        ('Word count and readability',['Longer is not automatically better. If a sentence can be made clearer in fewer words, reducing it often improves the reader experience. Use word count to monitor scope, not to pad an article.','For online guides, headings and short paragraphs help readers scan. A useful article answers the searcher’s question efficiently and then provides enough context to make the answer actionable.']),
        ('Use the tool while editing',['Paste or type the draft into the word counter, review words and characters, then edit for clarity. Repeat after major revisions. For social platforms, character count can be more important than word count because limits are often strict.','If you are preparing metadata, check title and description length separately because search snippets and social previews have their own practical constraints.']),
        ('A better writing workflow',['Start with the reader’s goal, outline the answer, draft naturally, and only then use word count as a quality-control step. Remove repetition and unsupported claims rather than adding filler just to reach a number.'])],
        [('Is a longer article better for SEO?','Not automatically. Relevance, usefulness, originality, clarity, and satisfying the search intent matter more than a fixed word count.'),('Can I count characters too?','Yes. Character counts are useful for forms, social posts, titles, and metadata limits.'),('Should I pad an article to a target length?','No. Add useful detail only when it improves the reader’s understanding.')]),
      ('website-seo-audit-checklist-for-beginners','Website SEO Audit Checklist for Beginners','A basic SEO audit is a structured review of crawlability, content, links, metadata, performance, and user experience. You do not need to fix everything at once; prioritize problems that block discovery or make pages difficult to use.',[
        ('Start with indexing and crawlability',['Check whether important pages can be discovered and whether internal links lead to real destinations. Review robots directives, canonical URLs, sitemap availability, and accidental noindex tags.','Use search-engine tools to inspect important URLs rather than assuming the whole site behaves the same way. Templates and individual pages can have different metadata or technical problems.']),
        ('Review page-level content',['Every important page should have a clear purpose, descriptive title, useful heading structure, and content that genuinely answers the visitor’s question. Tool pages should explain how the tool works instead of presenting only a form.','Look for duplicate introductions, empty pages, placeholder text, and pages that differ only by a parameter or thin variation. Consolidate or improve weak pages when they do not provide a distinct user benefit.']),
        ('Check performance and mobile UX',['Test pages on a real phone or a mobile emulation environment. Large images, blocking scripts, excessive third-party code, layout shifts, and tiny touch targets can make a technically indexed page unpleasant to use.','Measure important templates consistently. A fast homepage does not guarantee that every tool page is fast, especially when individual tools load libraries or advertising scripts.']),
        ('Build a maintenance routine',['An audit is more useful when repeated. Keep a simple list of broken links, missing metadata, slow pages, and content opportunities. Fix high-impact issues first and document what changed so future checks are easier.'])],
        [('How often should a small site be audited?','A light monthly review plus a deeper review after major changes is a practical starting point.'),('Is an SEO audit a guarantee of rankings?','No. An audit finds technical and content opportunities; rankings also depend on competition, relevance, authority, and many other signals.'),('What should I fix first?','Prioritize crawl/indexing blockers, broken important pages, poor mobile usability, and clearly weak or duplicate content.')]),
    ]
    for slug, title, intro, sections, faq in data:
        path = ARTICLES / f'{slug}.html'
        if not path.exists():
            path.write_text(article_html(title, slug, intro, sections, faq), encoding='utf-8')
    return [(slug, title) for slug, title, *_ in data]


def ensure_tool_pages():
    if not TOOLS.exists():
        return 0
    changed = 0
    for path in sorted(TOOLS.glob('*.html')):
        text = path.read_text(encoding='utf-8', errors='ignore')
        if MARKER in text:
            continue
        name = title_from_slug(path.stem)
        block = tool_copy(name)
        if '</main>' in text.lower():
            pos = text.lower().rfind('</main>')
            text = text[:pos] + block + '\n' + text[pos:]
        else:
            pos = text.lower().rfind('</body>')
            if pos == -1:
                continue
            text = text[:pos] + block + '\n' + text[pos:]
        path.write_text(text, encoding='utf-8')
        changed += 1
    return changed


def ensure_legal_navigation():
    links = '''<div class="dt-legal-nav" style="margin-top:1rem;font-size:.82rem;display:flex;gap:1rem;flex-wrap:wrap"><strong>Site information:</strong><a href="/about.html">About Us</a><a href="/contact.html">Contact Us</a><a href="/privacy.html">Privacy Policy</a><a href="/terms.html">Terms of Service</a><a href="/blog.html">Blog</a></div>'''
    changed = 0
    for path in ROOT.rglob('*.html'):
        if '.git' in path.parts or path.name == '404.html':
            continue
        text = path.read_text(encoding='utf-8', errors='ignore')
        if 'dt-legal-nav' in text:
            continue
        pos = text.lower().rfind('</footer>')
        if pos != -1:
            text = text[:pos] + links + '\n' + text[pos:]
            path.write_text(text, encoding='utf-8')
            changed += 1
    return changed


def ensure_404():
    p = ROOT / '404.html'
    if p.exists():
        return False
    p.write_text('''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page Not Found | Daily Toolkit</title><meta name="robots" content="noindex"><style>body{font-family:Arial,sans-serif;max-width:700px;margin:12vh auto;padding:24px;text-align:center;color:#222}a{display:inline-block;margin-top:20px;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:4px}</style></head><body><h1>Page not found</h1><p>The page you requested is unavailable or has moved. Use the links below to continue exploring Daily Toolkit.</p><a href="/">Go to Daily Toolkit</a> <a href="/tools.html">Browse Tools</a> <a href="/blog.html">Read the Blog</a></body></html>''', encoding='utf-8')
    return True


def update_blog(article_links):
    p = ROOT / 'blog.html'
    if not p.exists() or 'dt-article-library' in p.read_text(encoding='utf-8', errors='ignore'):
        return False
    text = p.read_text(encoding='utf-8', errors='ignore')
    cards = ''.join(f'<article style="padding:1.2rem;border:1px solid #EFEFEF;border-radius:6px"><h3><a href="/articles/{slug}.html">{html.escape(title)}</a></h3><p>Practical, reader-focused guidance with steps, examples, common mistakes, and FAQs.</p></article>' for slug, title in article_links)
    section = f'''<!-- dt-article-library --><section id="dt-article-library" style="max-width:1100px;margin:3rem auto;padding:0 4%"><p style="text-transform:uppercase;letter-spacing:.12em;font-size:.7rem;color:#A07B22;font-weight:700">Guides & Tutorials</p><h2 style="font-family:Georgia,serif;font-size:2rem">Practical Technology Guides</h2><p style="color:#666;max-width:720px">Learn how to use everyday digital tools, improve document workflows, protect account security, and audit a website with practical examples.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;margin-top:1.5rem">{cards}</div></section>'''
    pos = text.lower().rfind('</main>')
    if pos == -1:
        pos = text.lower().rfind('</body>')
    if pos == -1:
        return False
    text = text[:pos] + section + '\n' + text[pos:]
    p.write_text(text, encoding='utf-8')
    return True


if __name__ == '__main__':
    articles = build_articles()
    tools_changed = ensure_tool_pages()
    legal_changed = ensure_legal_navigation()
    not_found = ensure_404()
    blog_changed = update_blog(articles)
    print(f'Tool pages upgraded: {tools_changed}')
    print(f'Legal navigation added: {legal_changed}')
    print(f'Articles created: {len(articles)}')
    print(f'Blog updated: {blog_changed}')
    print(f'404 page created: {not_found}')
