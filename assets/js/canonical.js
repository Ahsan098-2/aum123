/* Daily Toolkit: canonical URLs + concise tool SEO metadata + sitewide breadcrumbs */
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

  function titleCase(value) {
    return value
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, function (letter) { return letter.toUpperCase(); });
  }

  function getPageName() {
    var h1 = document.querySelector('main h1, h1');
    if (h1 && h1.textContent.trim()) return h1.textContent.replace(/\s+/g, ' ').trim();

    var title = document.title.replace(/\s*\|\s*Daily Toolkit\s*$/i, '').trim();
    return title || 'Page';
  }

  function removeExistingBreadcrumbSchemas() {
    var scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < scripts.length; i++) {
      try {
        var data = JSON.parse(scripts[i].textContent || '{}');
        var containsBreadcrumb = data && data['@type'] === 'BreadcrumbList';
        if (data && Array.isArray(data['@graph'])) {
          containsBreadcrumb = data['@graph'].some(function (item) {
            return item && item['@type'] === 'BreadcrumbList';
          });
        }
        if (containsBreadcrumb) scripts[i].remove();
      } catch (e) {
        /* Ignore non-JSON-LD scripts or invalid third-party markup. */
      }
    }
  }

  function addBreadcrumbStyles() {
    if (document.getElementById('dt-breadcrumb-styles')) return;

    var style = document.createElement('style');
    style.id = 'dt-breadcrumb-styles';
    style.textContent =
      '.dt-breadcrumb-bar{width:100%;padding:0 4%;margin:0 auto 18px;}' +
      '.dt-breadcrumb{max-width:1100px;margin:0 auto;display:flex;align-items:center;flex-wrap:wrap;gap:.5rem;font-size:.76rem;color:var(--gray-600,#696969);letter-spacing:.02em;}' +
      '.dt-breadcrumb a{color:var(--gray-600,#696969);text-decoration:none;transition:color .3s ease;}' +
      '.dt-breadcrumb a:hover{color:var(--gold,#C9A84C);}' +
      '.dt-breadcrumb .sep{color:var(--gray-400,#A5A5A5);}' +
      '.dt-breadcrumb .current{color:var(--black,#0A0A0A);font-weight:600;}' +
      '@media(max-width:600px){.dt-breadcrumb-bar{padding:0 5%;margin-bottom:14px}.dt-breadcrumb{font-size:.72rem;gap:.4rem}}';
    document.head.appendChild(style);
  }

  function addVisibleBreadcrumbs() {
    if (path === '/') return;
    if (document.querySelector('.dt-breadcrumb')) return;

    var isTool = /^\/tools\//i.test(path);
    var isToolsIndex = path.toLowerCase() === '/tools';
    var pageName = getPageName();

    var bar = document.createElement('div');
    bar.className = 'dt-breadcrumb-bar';

    var nav = document.createElement('nav');
    nav.className = 'dt-breadcrumb';
    nav.setAttribute('aria-label', 'Breadcrumb');

    function addLink(text, href) {
      var a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      nav.appendChild(a);
    }

    function addSeparator() {
      var span = document.createElement('span');
      span.className = 'sep';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = '/';
      nav.appendChild(span);
    }

    addLink('Home', '/');

    if (isTool) {
      addSeparator();
      addLink('Tools', '/tools');
      if (!isToolsIndex) {
        addSeparator();
        var current = document.createElement('span');
        current.className = 'current';
        current.setAttribute('aria-current', 'page');
        current.textContent = pageName;
        nav.appendChild(current);
      }
    } else {
      addSeparator();
      var page = document.createElement('span');
      page.className = 'current';
      page.setAttribute('aria-current', 'page');
      page.textContent = titleCase(path.replace(/^\//, '').split('/').pop() || pageName);
      nav.appendChild(page);
    }

    bar.appendChild(nav);

    var target = document.querySelector('main');
    if (target) {
      target.insertBefore(bar, target.firstElementChild);
      return;
    }

    var hero = document.querySelector('.hero, .breadcrumb-bar');
    if (hero && hero.parentNode) hero.parentNode.insertBefore(bar, hero);
    else if (document.body) document.body.insertBefore(bar, document.body.firstChild);
  }

  function addBreadcrumbSchema() {
    if (path === '/') return;

    var isTool = /^\/tools\//i.test(path);
    var isToolsIndex = path.toLowerCase() === '/tools';
    var pageName = getPageName();
    var items = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: ORIGIN + '/' }
    ];

    if (isTool) {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: ORIGIN + '/tools'
      });
      if (!isToolsIndex) {
        items.push({
          '@type': 'ListItem',
          position: 3,
          name: pageName,
          item: canonicalUrl
        });
      }
    } else {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: titleCase(path.replace(/^\//, '').split('/').pop() || pageName),
        item: canonicalUrl
      });
    }

    removeExistingBreadcrumbSchemas();

    var schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.id = 'dt-breadcrumb-schema';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items
    });
    document.head.appendChild(schema);
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

  function initBreadcrumbs() {
    addBreadcrumbStyles();
    addVisibleBreadcrumbs();
    addBreadcrumbSchema();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBreadcrumbs);
  } else {
    initBreadcrumbs();
  }
})();