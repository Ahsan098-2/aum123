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
  }
})();
