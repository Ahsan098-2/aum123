/* Daily Toolkit multilingual helper.
   * Uses Google's client-side translation widget for visitor convenience.
   * English remains the original page language; this does not create SEO-localized URLs.
   */
(function () {
  'use strict';
  if (document.getElementById('dt-language-switcher')) return;

  var labels = {
    en: 'English',
    ur: 'اردو',
    hi: 'हिन्दी',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch'
  };
  var supported = Object.keys(labels);
  var host = document.createElement('div');
  host.id = 'dt-language-switcher';
  host.setAttribute('aria-label', 'Choose website language');
  host.innerHTML =
    '<label for="dt-language-select" class="dt-language-label">Language</label>' +
    '<select id="dt-language-select" aria-label="Choose language">' +
    supported.map(function (code) {
      return '<option value="' + code + '">' + labels[code] + '</option>';
    }).join('') +
    '</select><div id="dt-google-translate" aria-hidden="true"></div>';

  var style = document.createElement('style');
  style.textContent =
    '#dt-language-switcher{position:relative;display:inline-flex;align-items:center;gap:6px;z-index:1001;font:500 12px/1.3 Inter,system-ui,sans-serif;color:inherit}' +
    '#dt-language-switcher .dt-language-label{font-size:11px;opacity:.8}' +
    '#dt-language-select{max-width:116px;padding:6px 8px;border:1px solid #c9a84c;border-radius:4px;background:#fff;color:#111;font:inherit;cursor:pointer}' +
    '#dt-google-translate{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}' +
    'body{top:0!important}.goog-te-banner-frame{display:none!important}#goog-gt-tt,.goog-te-balloon-frame{display:none!important}' +
    '.goog-text-highlight{background:transparent!important;box-shadow:none!important}' +
    '@media(max-width:700px){#dt-language-switcher{gap:4px}#dt-language-switcher .dt-language-label{display:none}#dt-language-select{max-width:100px;padding:6px;font-size:11px}}';
  document.head.appendChild(style);

  function mount() {
    var nav = document.querySelector('nav');
    var mobileMenu = document.querySelector('.mobile-menu');
    if (nav) {
      nav.appendChild(host);
    } else if (mobileMenu) {
      mobileMenu.insertBefore(host, mobileMenu.firstChild);
    } else {
      host.style.position = 'fixed';
      host.style.top = '10px';
      host.style.right = '12px';
      document.body.appendChild(host);
    }
  }

  function applyLanguage(code) {
    var custom = document.getElementById('dt-language-select');
    var native = document.querySelector('#dt-google-translate select.goog-te-combo');
    if (!custom || !native || !supported.includes(code)) return false;
    custom.value = code;
    native.value = code;
    native.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  var browserLanguage = (navigator.language || 'en').toLowerCase().split('-')[0];
  var initialLanguage = supported.includes(browserLanguage) ? browserLanguage : 'en';

  window.googleTranslateElementInit = function () {
    if (!window.google || !google.translate || !google.translate.TranslateElement) return;
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: supported.join(','),
      autoDisplay: false
    }, 'dt-google-translate');

    var custom = document.getElementById('dt-language-select');
    if (custom) {
      custom.value = initialLanguage;
      custom.addEventListener('change', function () {
        var chosen = custom.value;
        try { localStorage.setItem('dt-language', chosen); } catch (e) {}
        var attempts = 0;
        if (applyLanguage(chosen)) return;
        var observer = new MutationObserver(function () {
          attempts++;
          if (applyLanguage(chosen) || attempts > 30) observer.disconnect();
        });
        observer.observe(document.getElementById('dt-google-translate'), {
          childList: true, subtree: true
        });
      });
    }

    try {
      var saved = localStorage.getItem('dt-language');
      if (saved && supported.includes(saved)) initialLanguage = saved;
    } catch (e) {}
    if (initialLanguage !== 'en') {
      var attempts = 0;
      var observer = new MutationObserver(function () {
        attempts++;
        if (applyLanguage(initialLanguage) || attempts > 30) observer.disconnect();
      });
      observer.observe(document.getElementById('dt-google-translate'), {
        childList: true, subtree: true
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }

  var translateScript = document.createElement('script');
  translateScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  translateScript.async = true;
  translateScript.onerror = function () {
    var select = document.getElementById('dt-language-select');
    if (select) select.title = 'Translation service could not load. English remains available.';
  };
  document.head.appendChild(translateScript);
})();