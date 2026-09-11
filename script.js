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
          
        </div>';

     
  }

  function injectThirdPartyAd(src, key, width, height){
    try{
      if(document.querySelector('[data-daily-ad="' + key + '"]')) return;
      var host = document.querySelector('[data-daily-ad-slot="' + key + '"]');
      if(!host) return;
      host.setAttribute('data-daily-ad', key);
      host.style.width = '100%';
      host.style.minHeight = height + 'px';
      host.style.display = 'flex';
      host.style.justifyContent = 'center';
      host.style.alignItems = 'center';
      host.style.overflow = 'hidden';
      host.style.margin = '24px auto';

      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-daily-ad-script', key);
      host.appendChild(script);
    }catch(error){
      console.warn('Daily Toolkit ad injection:', error);
    }
  }

  function injectMonetizationAds(){
    try{
      var path = (window.location.pathname || '/').replace(/\.html$/i, '').replace(/\/$/, '') || '/';
      var configs = {
        '/': {key:'home-728', src:'https://www.highrevenueformat.com/be20f5359d0c789bb4b8d8a84edd7803/invoke.js', width:728, height:90, type:'atoptions', atKey:'be20f5359d0c789bb4b8d8a84edd7803'},
        '/tools': {key:'tools-300', src:'https://www.highrevenueformat.com/247221e0e0d706700a90a6d1bf887d85/invoke.js', width:300, height:250, type:'atoptions', atKey:'247221e0e0d706700a90a6d1bf887d85'},
        '/blog': {key:'blog-pop', src:'https://pl31162667.profitableratecpmnetwork.com/23/19/0f/23190f1f5c9258a887e04a548b170747.js', width:728, height:90, type:'script'},
        '/about': {key:'about-pop', src:'https://pl31162668.profitableratecpmnetwork.com/58/5c/96/585c966b974cd0c1ee29f1c2f4c5b945.js', width:728, height:90, type:'script'},
        '/contact': {key:'contact-300', src:'https://www.highrevenueformat.com/247221e0e0d706700a90a6d1bf887d85/invoke.js', width:300, height:250, type:'atoptions', atKey:'247221e0e0d706700a90a6d1bf887d85'}
      };
      var config = configs[path];
      if(!config) return;

      var existing = document.querySelector('[data-daily-ad-slot="' + config.key + '"]');
      if(existing) return;

      var anchor = document.querySelector('main') || document.querySelector('.main-content') || document.querySelector('.content') || document.body;
      if(!anchor) return;

      var slot = document.createElement('div');
      slot.setAttribute('data-daily-ad-slot', config.key);
      slot.setAttribute('role', 'complementary');
      slot.setAttribute('aria-label', 'Advertisement');
      slot.innerHTML = '<span style="position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important;">Advertisement</span>';

      if(path === '/'){
        var homeAnchor = document.querySelector('.ad-banner-container') || document.querySelector('.hero') || anchor.firstElementChild;
        if(homeAnchor && homeAnchor.parentNode){
          homeAnchor.parentNode.insertBefore(slot, homeAnchor.nextSibling);
        }else anchor.insertBefore(slot, anchor.firstChild);
      }else{
        var heading = anchor.querySelector('h1');
        if(heading && heading.parentNode){
          heading.parentNode.insertBefore(slot, heading.nextSibling);
        }else anchor.insertBefore(slot, anchor.firstChild);
      }

      if(config.type === 'atoptions'){
        window.atOptions = {key:config.atKey, format:'iframe', height:config.height, width:config.width, params:{}};
      }
      injectThirdPartyAd(config.src, config.key, config.width, config.height);
    }catch(error){
      console.warn('Daily Toolkit monetization ads:', error);
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
    injectMonetizationAds();
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
