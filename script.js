/* Daily Toolkit front-end enhancement loader. */
(function(){
  'use strict';

  var ATS_NAME = 'ATS Resume Score Checker';

  function normalize(value){
    return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
  }

  function normalizeUrl(value){
    return String(value || '')
      .trim()
      .replace(/^\/+/, '')
      .replace(/\.html$/i, '')
      .replace(/\/$/, '')
      .toLowerCase();
  }

  function ensureCanonical(){
    try{
      var path = window.location.pathname || '/';
      path = path.replace(/\/+/g, '/').replace(/\.html$/i, '');
      if(path !== '/') path = path.replace(/\/$/, '');
      var canonicalUrl = 'https://dailytoolkit.xyz' + (path || '/');

      var canonical = document.querySelector('link[rel="canonical"]');
      if(!canonical){
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;

      var ogUrl = document.querySelector('meta[property="og:url"]');
      if(ogUrl) ogUrl.setAttribute('content', canonicalUrl);
    }catch(error){
      console.warn('Daily Toolkit canonical normalization:', error);
    }
  }

  function toolKey(tool){
    if(!tool) return '';
    var url = normalizeUrl(tool.url);
    var name = normalize(tool.name);
    return url || ('name:' + name);
  }

  function ensureHomeCatalog(){
    try{
      if(typeof allTools === 'undefined' || !Array.isArray(allTools)) return false;
      var changed = false;
      var seen = new Set();
      var filtered = [];
      allTools.forEach(function(tool){
        var key = toolKey(tool);
        if(!key || seen.has(key)){ changed = true; return; }
        seen.add(key); filtered.push(tool);
      });
      allTools.length = 0;
      Array.prototype.push.apply(allTools, filtered);

      var atsCount = 0;
      for(var i = allTools.length - 1; i >= 0; i--){
        var t = allTools[i] || {};
        if(normalize(t.name) === normalize(ATS_NAME) || normalizeUrl(t.url) === 'tools/ats-resume-score-checker'){
          atsCount++;
          if(atsCount > 1){ allTools.splice(i, 1); changed = true; }
        }
      }

      var hasATS = allTools.some(function(tool){
        return normalize(tool && tool.name) === normalize(ATS_NAME) || normalizeUrl(tool && tool.url) === 'tools/ats-resume-score-checker';
      });
      if(!hasATS){
        allTools.splice(1, 0, {name:ATS_NAME,desc:'Compare your resume against a job description to find missing keywords and improve ATS compatibility.',icon:'fas fa-file-alt',cat:'text',url:'tools/ats-resume-score-checker'});
        changed = true;
      }
      if(changed && typeof renderTools === 'function') renderTools();
      return changed;
    }catch(error){
      console.warn('Daily Toolkit homepage catalog cleanup:', error);
      return false;
    }
  }

  function addATSIcon(card){
    var icon = card.querySelector('.tool-icon');
    if(!icon) return;
    icon.innerHTML = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
  }

  function cleanRenderedHomepage(){
    var cards = document.querySelectorAll('.tool-card, .quick-tool');
    var seen = new Set();
    cards.forEach(function(card){
      var title = card.querySelector('.tool-title, .tool-name, h3, h4');
      var name = normalize(title ? title.textContent : '');
      var link = card.getAttribute('href') || (card.querySelector('a') && card.querySelector('a').getAttribute('href')) || '';
      var url = normalizeUrl(link);
      var key = url || ('name:' + name);
      if(!key || seen.has(key)){ card.remove(); return; }
      seen.add(key);
      if(name === normalize(ATS_NAME) || url === 'tools/ats-resume-score-checker') addATSIcon(card);
    });
  }

  function injectHomeYouTubePromo(){
    try{
      var path = window.location.pathname || '/';
      if(path !== '/' && path !== '/index.html') return;
      var container = document.querySelector('.ad-banner-container');
      if(!container || container.dataset.youtubePromoApplied === 'true') return;

      container.dataset.youtubePromoApplied = 'true';
      container.className = 'ad-banner-container daily-youtube-promo';
      container.innerHTML = '\
        <div class="daily-youtube-promo__header">\
          <span class="daily-youtube-promo__label">Ad</span>\
          <span class="daily-youtube-promo__choices">AdChoices <span aria-hidden="true">ⓘ</span></span>\
        </div>\
        <div class="daily-youtube-promo__body">\
          <a class="daily-youtube-promo__thumb" href="https://youtube.com/shorts/qUaq2sfu1Kw" target="_blank" rel="noopener noreferrer" aria-label="Watch Our Latest Short Guide on YouTube">\
            <img src="https://i.ytimg.com/vi/qUaq2sfu1Kw/maxresdefault.jpg" alt="YouTube Shorts preview for Watch Our Latest Short Guide" loading="lazy">\
            <span class="daily-youtube-promo__play" aria-hidden="true">▶</span>\
            <span class="daily-youtube-promo__shorts">SHORTS</span>\
          </a>\
          <div class="daily-youtube-promo__content">\
            <div class="daily-youtube-promo__eyebrow">Daily Toolkit on YouTube</div>\
            <h3>Watch Our Latest Short Guide</h3>\
            <p>Learn quick web utility tips</p>\
            <a class="daily-youtube-promo__button" href="https://youtube.com/shorts/qUaq2sfu1Kw" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>\
          </div>\
        </div>';

      if(!document.getElementById('daily-youtube-promo-style')){
        var style = document.createElement('style');
        style.id = 'daily-youtube-promo-style';
        style.textContent = '\
          .daily-youtube-promo{display:block!important;width:min(728px,calc(100% - 32px));max-width:728px!important;margin:28px auto!important;overflow:hidden!important;background:#fff;border:1px solid #d9d9d9;box-shadow:0 2px 10px rgba(0,0,0,.035);font-family:Inter,system-ui,sans-serif}\
          .daily-youtube-promo__header{height:34px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;border-bottom:1px solid #e7e7e7;background:#fafafa;color:#666;font-size:11px;letter-spacing:.02em}\
          .daily-youtube-promo__label{font-weight:600;color:#666}\
          .daily-youtube-promo__choices{font-size:10px;color:#777}\
          .daily-youtube-promo__body{display:flex;align-items:center;gap:18px;padding:16px;background:#fff;min-height:190px}\
          .daily-youtube-promo__thumb{position:relative;display:block;width:120px;height:170px;flex:0 0 120px;overflow:hidden;background:#eee}\
          .daily-youtube-promo__thumb img{width:100%;height:100%;object-fit:cover;object-position:center;display:block}\
          .daily-youtube-promo__play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.72);color:#fff;font-size:15px;padding-left:2px;box-shadow:0 2px 8px rgba(0,0,0,.22)}\
          .daily-youtube-promo__shorts{position:absolute;left:8px;bottom:8px;padding:3px 6px;border-radius:3px;background:rgba(0,0,0,.72);color:#fff;font-size:8px;font-weight:700;letter-spacing:.08em}\
          .daily-youtube-promo__content{min-width:0;flex:1}\
          .daily-youtube-promo__eyebrow{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#777;margin-bottom:7px}\
          .daily-youtube-promo__content h3{margin:0 0 6px;font-size:19px;line-height:1.25;color:#111;font-weight:700}\
          .daily-youtube-promo__content p{margin:0 0 15px;font-size:13px;line-height:1.5;color:#666}\
          .daily-youtube-promo__button{display:inline-flex;align-items:center;justify-content:center;padding:9px 15px;border-radius:4px;background:#1769e0;color:#fff!important;font-size:12px;font-weight:600;text-decoration:none!important;transition:background .2s ease}\
          .daily-youtube-promo__button:hover{background:#0f56be}\
          @media(max-width:560px){.daily-youtube-promo{width:calc(100% - 24px);margin:20px auto!important}.daily-youtube-promo__body{gap:12px;padding:12px;min-height:155px}.daily-youtube-promo__thumb{width:88px;height:132px;flex-basis:88px}.daily-youtube-promo__content h3{font-size:16px}.daily-youtube-promo__content p{font-size:12px;margin-bottom:11px}.daily-youtube-promo__button{width:100%;padding:8px 10px}.daily-youtube-promo__eyebrow{font-size:8px}}';
        document.head.appendChild(style);
      }
    }catch(error){
      console.warn('Daily Toolkit YouTube promo:', error);
    }
  }

  function load(src){
    var s=document.createElement('script');
    s.src=src;
    s.defer=false;
    document.head.appendChild(s);
  }

  function loadMobileUX(){
    if(document.querySelector('link[data-daily-toolkit-mobile-ux]')) return;
    var link=document.createElement('link');
    link.rel='stylesheet';
    link.href='/css/mobile-ux.css?v=20260817';
    link.dataset.dailyToolkitMobileUx='true';
    document.head.appendChild(link);
  }

  function cleanup(){
    ensureCanonical();
    ensureHomeCatalog();
    cleanRenderedHomepage();
    injectHomeYouTubePromo();
  }

  function boot(){
    ensureCanonical();
    loadMobileUX();
    cleanup();
    var attempts=0;
    var timer=setInterval(function(){
      cleanup();
      attempts+=1;
      if(attempts>=20) clearInterval(timer);
    },250);
    if(document.body && window.MutationObserver){
      var observer=new MutationObserver(function(){ cleanRenderedHomepage(); injectHomeYouTubePromo(); });
      observer.observe(document.body,{childList:true,subtree:true});
      setTimeout(function(){observer.disconnect();},6000);
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot, {once:true});
  }else{
    boot();
  }

  load('/script-optimized.js?v=20260816');
  load('/assets/new-featured-tools.js?v=20260816');
})();
