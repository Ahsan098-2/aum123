/* Daily Toolkit: canonical URLs + concise tool SEO metadata */
(function () {
  'use strict';

  var ORIGIN = 'https://dailytoolkit.xyz';
  var path = (window.location.pathname || '/').replace(/\.html$/i, '').replace(/\/+$/, '') || '/';
  var canonicalUrl = ORIGIN + path;

  function setMeta(name, content) {
    var el = document.head.querySelector('meta[name="' + name + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.name = name;
      document.head.appendChild(el);
    }
    el.content = content;
  }

  function setProperty(property, content) {
    var el = document.head.querySelector('meta[property="' + property + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', property);
      document.head.appendChild(el);
    }
    el.content = content;
  }

  function setCanonical(url) {
    var links = document.head.querySelectorAll('link[rel="canonical"]');
    var link = links[0];
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
    for (var i = 1; i < links.length; i++) links[i].remove();
  }

  // Age Calculator only: remove unrelated/generated SEO-guide content if a
  // client-side script or stale cached asset injects it into the rendered DOM.
  // The legitimate Age Calculator guide is kept untouched.
  function removeUnrelatedAgeContent() {
    if (!/^\/tools\/age-calculator$/i.test(path)) return;

    var unwanted = {
      '1. Keyword Research': true,
      '2. On-Page SEO': true,
      '3. High-Quality Content': true,
      '4. Internal and External Links': true,
      '5. Image Optimization': true,
      '6. Mobile Optimization': true,
      '7. User Experience (UX)': true,
      '8. Social Media Integration': true,
      '9. Monitor Performance': true,
      '10. Local SEO (if applicable)': true,
      'Python Code for Age Calculator': true,
      'Code Ka Istemal Karne Ka Tariqa:': true,
      'Example:': true,
      'Vision': true,
      'Upload File': true,
      'Invite & Earn': true
    };

    function clean(root) {
      var headings = root.querySelectorAll('h1,h2,h3,h4,h5,h6');
      var matches = [];
      for (var i = 0; i < headings.length; i++) {
        var text = (headings[i].textContent || '').replace(/\s+/g, ' ').trim();
        if (unwanted[text]) matches.push(headings[i]);
      }

      // If several unrelated headings were injected into one section, remove
      // that whole generated section rather than leaving its paragraphs behind.
      if (matches.length >= 3) {
        var ancestors = [];
        var node = matches[0].parentElement;
        while (node && node !== document.body) {
          var count = 0;
          for (var j = 0; j < matches.length; j++) {
            if (node.contains(matches[j])) count++;
          }
          if (count >= 3) ancestors.push(node);
          node = node.parentElement;
        }
        if (ancestors.length) {
          ancestors.sort(function (a, b) {
            return b.querySelectorAll('h1,h2,h3,h4,h5,h6').length - a.querySelectorAll('h1,h2,h3,h4,h5,h6').length;
          });
          var container = ancestors[0];
          if (container && !container.classList.contains('seo-grid')) {
            container.remove();
            return;
          }
        }
      }

      // Fallback for isolated injected blocks. Remove the smallest section/article
      // wrapper when available; otherwise remove only the offending heading.
      for (var k = 0; k < matches.length; k++) {
        var h = matches[k];
        if (!h.isConnected) continue;
        var wrapper = h.closest('section, article');
        if (wrapper && wrapper !== document.querySelector('.seo-grid')) {
          wrapper.remove();
        } else {
          h.remove();
        }
      }
    }

    clean(document);

    // Catch content inserted after the initial page render.
    if (window.MutationObserver) {
      var observer = new MutationObserver(function () {
        clean(document);
      });
      observer.observe(document.body, { childList: true, subtree: true });
      window.setTimeout(function () { observer.disconnect(); }, 10000);
    }
  }

  setCanonical(canonicalUrl);

  if (/^\/tools\/age-calculator$/i.test(path)) {
    var title = 'Age Calculator Online: Calculate Exact Age | Daily Toolkit';
    var description = 'Calculate your exact age from your date of birth in years, months and days. Free age calculator with accurate age breakdown and age difference support.';
    var keywords = 'age calculator, age calculator online, age calculator by date of birth, calculate age, chronological age calculator, age difference calculator';

    document.title = title;
    setMeta('description', description);
    setMeta('keywords', keywords);
    setMeta('robots', 'index, follow, max-image-preview:large');
    setMeta('author', 'Daily Toolkit');
    setProperty('og:title', title);
    setProperty('og:description', description);
    setProperty('og:url', canonicalUrl);
    setProperty('og:type', 'website');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:card', 'summary_large_image');

    var schema = document.getElementById('dt-seo-schema');
    if (!schema) {
      schema = document.createElement('script');
      schema.type = 'application/ld+json';
      schema.id = 'dt-seo-schema';
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Age Calculator Online',
      url: canonicalUrl,
      description: description,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    });

    removeUnrelatedAgeContent();
  }
})();
