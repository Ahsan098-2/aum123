/*
 * Daily Toolkit — Canonical URL normalizer + on-page content enhancer
 *
 * Canonical URLs always use the production origin and clean paths.
 * The content enhancer adds the long-form guide required on tool pages and
 * a discoverable article library on the blog page. It runs after the document
 * is ready so it does not interfere with tool functionality.
 */
(function () {
  'use strict';

  var CANONICAL_ORIGIN = 'https://dailytoolkit.xyz';
  var pathname = window.location.pathname || '/';
  var cleanPath = pathname;

  if (/^\/index(?:\.html)?\/?$/i.test(cleanPath)) {
    cleanPath = '/';
  } else {
    cleanPath = cleanPath.replace(/\.html$/i, '');
    cleanPath = cleanPath.replace(/\/+$/, '');
    if (!cleanPath) cleanPath = '/';
  }

  var canonicalUrl = CANONICAL_ORIGIN + cleanPath;
  var canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);

  function titleFromSlug(slug) {
    var special = {pdf:'PDF', qr:'QR', url:'URL', seo:'SEO', ip:'IP', ats:'ATS', bmi:'BMI', api:'API'};
    return slug.split('-').map(function (part) { return special[part] || part.charAt(0).toUpperCase() + part.slice(1); }).join(' ');
  }

  function categoryText(slug) {
    if (/pdf|document/.test(slug)) return 'For document work, accuracy matters as much as speed. Keep an original copy, confirm page order and readability, and check the final file before sending it to another person. PDF workflows are especially useful for applications, reports, receipts, forms, study notes and business records.';
    if (/image|photo|background|barcode|qr|color|gradient/.test(slug)) return 'For visual work, start with a good source and decide where the result will be used. Web pages, social posts, print documents and messaging apps can have different size and quality needs. Always preview the finished result at a realistic size before publishing it.';
    if (/calculator|loan|debt|salary|investment|retirement|pension|profit|rate|bmi|age/.test(slug)) return 'For calculation tools, the quality of the answer depends on the inputs. Enter values carefully, confirm units and dates, and treat the result as an estimate when real-world rules, fees, taxes or professional requirements apply. Comparing a few realistic scenarios is often more useful than relying on one number.';
    if (/password|security|ip|url|seo|ats/.test(slug)) return 'For technical and security-related tasks, review the output before acting on it. Avoid exposing private credentials or confidential information, verify URLs and settings, and use the result as one part of a wider workflow rather than assuming that an automated check can replace expert review.';
    return 'For everyday productivity tasks, a simple repeatable workflow is usually the fastest approach: prepare the input, run the tool, inspect the result, and then save or reuse it. Keeping the original input when appropriate makes it easier to correct mistakes without starting from scratch.';
  }

  function injectToolGuide() {
    if (!/^\/tools\//i.test(pathname) || document.getElementById('dt-tool-guide')) return;
    var slug = pathname.split('/').filter(Boolean).pop().replace(/\.html$/i, '');
    var name = titleFromSlug(slug);
    var guide = document.createElement('section');
    guide.id = 'dt-tool-guide';
    guide.setAttribute('aria-labelledby', 'dt-tool-guide-title');
    guide.innerHTML = '<div class="dt-guide-inner">' +
      '<p class="dt-guide-eyebrow">Complete Tool Guide</p>' +
      '<h2 id="dt-tool-guide-title">' + name + ': How to Use It, Features, Benefits and FAQs</h2>' +
      '<p><strong>' + name + '</strong> is a free online utility designed to make a common digital task easier to complete in a browser. Instead of installing specialist software for an occasional job, you can use this page as a focused workspace: provide the required information, choose the relevant options, run the tool, and review the result. It is intended for students, office workers, freelancers, creators, developers, small businesses and everyday internet users who want a straightforward solution. ' + categoryText(slug) + '</p>' +
      '<p>The most reliable way to use any online tool is to understand what goes in and what comes out. Before starting, read the labels around the controls and make sure you have selected the correct file, date, number, unit or setting. If the task involves an important document or decision, keep an original copy and verify the result independently. Online tools are excellent for routine processing, but they should not be treated as professional advice for medical, legal, financial or other high-stakes decisions.</p>' +
      '<h3>How to Use ' + name + '</h3>' +
      '<ol><li>Open the tool and read the short instructions so you know what information or file is required.</li><li>Enter the values or select the source file carefully. Check spelling, dates, units, page ranges and other details that affect the result.</li><li>Choose optional settings only when you understand their effect. If you are unsure, start with the default or balanced option.</li><li>Run the tool and wait for the result. Processing time can vary with file size, browser resources and the complexity of the task.</li><li>Review the output before downloading, sharing, publishing or using it elsewhere. If something is incorrect, change one input at a time and run the tool again.</li></ol>' +
      '<h3>Key Features</h3>' +
      '<p>The page is designed around a focused task rather than a complicated software workflow. Clear inputs help reduce mistakes, the browser-based interface keeps access simple, and the result can normally be reviewed immediately. Depending on the tool, the workflow may include calculations, conversion, text processing, image handling, document processing, generation or an automated check. A useful result is one that is understandable and ready for the next step in your workflow. For file-based tools, practical limits such as file size, browser memory and device storage can affect processing, so smaller or optimized source files may work better.</p>' +
      '<h3>Why Use This Tool?</h3>' +
      '<p>' + name + ' can save time when you need a quick result without learning a large application. It can be useful for homework, office administration, content creation, website maintenance, small-business tasks and personal projects. The biggest benefit is repeatability: once you understand the inputs, the same process can be used again with different information. This makes the tool useful for routine work while still keeping the user in control of the final result.</p>' +
      '<h3>Best Practices</h3>' +
      '<p>Use accurate inputs, keep important originals, and review outputs before relying on them. Avoid uploading confidential material unless you are comfortable with the service and understand its handling requirements. On mobile devices, use a stable browser connection and allow enough storage for downloads. When a result is important, compare it with the original data or an independent reference. These simple checks reduce avoidable errors and make an online tool much more useful as part of a larger workflow.</p>' +
      '<h3>FAQs</h3>' +
      '<div class="dt-faq"><details><summary>Is ' + name + ' free to use?</summary><p>Yes. Daily Toolkit provides the tool as a free online utility. Normal use does not require installing a paid desktop application.</p></details><details><summary>Do I need to install software?</summary><p>No. Open the page in a modern browser and follow the controls shown on the tool.</p></details><details><summary>What if the result is not correct?</summary><p>Check the input first, especially dates, numbers, file selection, units and options. Correct one item at a time and run the tool again.</p></details><details><summary>Does it work on mobile?</summary><p>The pages are designed for modern phones, tablets and computers. Browser and device limits can still affect very large files or complex processing.</p></details></div>' +
      '</div>';
    var style = document.createElement('style');
    style.textContent = '#dt-tool-guide{margin:2.5rem auto 0;padding:2.5rem 4%;border-top:1px solid #eee;background:#fff}.dt-guide-inner{max-width:900px;margin:auto;color:#222}.dt-guide-eyebrow{text-transform:uppercase;letter-spacing:.14em;font-size:.7rem;font-weight:700;color:#8a6a20;margin:0 0 .6rem}.dt-guide-inner h2{font-family:Georgia,serif;font-size:clamp(1.6rem,3vw,2.3rem);line-height:1.2;margin:0 0 1rem}.dt-guide-inner h3{font-family:Georgia,serif;font-size:1.25rem;margin:1.8rem 0 .65rem}.dt-guide-inner p,.dt-guide-inner li{font-size:.95rem;line-height:1.8;color:#555}.dt-guide-inner ol{padding-left:1.3rem}.dt-guide-inner li{margin:.45rem 0}.dt-faq{display:grid;gap:.7rem}.dt-faq details{border:1px solid #eee;border-radius:6px;padding:.85rem 1rem;background:#fafafa}.dt-faq summary{cursor:pointer;font-weight:600;color:#222}.dt-faq details p{margin:.6rem 0 0}';
    document.head.appendChild(style);
    var main = document.querySelector('main') || document.body;
    main.appendChild(guide);
  }

  function injectBlogLibrary() {
    if (!/^\/blog(?:\.html)?\/?$/i.test(pathname) || document.getElementById('dt-blog-library')) return;
    var items = [
      ['how-to-compress-a-pdf-without-losing-important-quality','How to Compress a PDF Without Losing Important Quality'],
      ['how-to-convert-images-to-pdf-online','How to Convert Images to PDF Online'],
      ['age-calculator-guide-exact-age-by-date-of-birth','Age Calculator Guide: Exact Age by Date of Birth'],
      ['how-to-use-a-loan-calculator-and-understand-emi','How to Use a Loan Calculator and Understand EMI'],
      ['pdf-merge-vs-pdf-split-which-tool-to-use','PDF Merge vs PDF Split: Which Tool Should You Use?'],
      ['password-generator-best-practices','Password Generator Best Practices for Safer Accounts'],
      ['how-to-resize-images-for-web-and-social-media','How to Resize Images for Web and Social Media'],
      ['qr-code-guide-for-business-and-personal-use','QR Code Guide for Business and Personal Use'],
      ['word-counter-guide-for-writing-and-seo','Word Counter Guide for Writing and SEO'],
      ['website-seo-audit-checklist-for-beginners','Website SEO Audit Checklist for Beginners']
    ];
    var section = document.createElement('section');
    section.id = 'dt-blog-library';
    section.innerHTML = '<div class="dt-blog-inner"><p class="dt-guide-eyebrow">Guides & Tutorials</p><h2>Practical Technology Guides</h2><p>Step-by-step articles covering PDF, image, calculator, security, writing and website workflows.</p><div class="dt-article-grid">' + items.map(function (item) { return '<article><h3><a href="/articles/' + item[0] + '.html">' + item[1] + '</a></h3><p>Practical guidance, common mistakes, examples and FAQs.</p></article>'; }).join('') + '</div></div>';
    var style = document.createElement('style');
    style.textContent = '#dt-blog-library{margin:2rem 0;padding:2.5rem 4%;background:#fafafa;border-top:1px solid #eee}.dt-blog-inner{max-width:1100px;margin:auto}.dt-blog-inner h2{font-family:Georgia,serif;font-size:2rem;margin:.2rem 0 .5rem}.dt-blog-inner>p{color:#666;max-width:700px}.dt-article-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;margin-top:1.4rem}.dt-article-grid article{background:#fff;border:1px solid #eee;border-radius:6px;padding:1.2rem}.dt-article-grid h3{font-size:1.05rem;line-height:1.35;margin:0 0 .5rem}.dt-article-grid h3 a{color:#222}.dt-article-grid h3 a:hover{color:#8a6a20}.dt-article-grid p{font-size:.86rem;color:#666;margin:0}';
    document.head.appendChild(style);
    (document.querySelector('main') || document.body).appendChild(section);
  }

  function runEnhancements() {
    injectToolGuide();
    injectBlogLibrary();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runEnhancements);
  else runEnhancements();
})();
