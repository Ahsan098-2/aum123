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

  function toolKey(tool){
    if(!tool) return '';
    var url = normalizeUrl(tool.url);
    var name = normalize(tool.name);
    return url || ('name:' + name);
  }

  // Keep every real homepage tool. If the same tool was added more than once,
  // keep the first copy only. Tool files are never deleted by this script.
  function ensureHomeCatalog(){
    try{
      if(typeof allTools === 'undefined' || !Array.isArray(allTools)) return false;

      var changed = false;
      var seen = new Set();
      var filtered = [];

      allTools.forEach(function(tool){
        var key = toolKey(tool);
        if(!key || seen.has(key)){
          changed = true;
          return;
        }
        seen.add(key);
        filtered.push(tool);
      });

      allTools.length = 0;
      Array.prototype.push.apply(allTools, filtered);

      var atsCount = 0;
      for(var i = allTools.length - 1; i >= 0; i--){
        var t = allTools[i] || {};
        if(normalize(t.name) === normalize(ATS_NAME) || normalizeUrl(t.url) === 'tools/ats-resume-score-checker'){
          atsCount++;
          if(atsCount > 1){
            allTools.splice(i, 1);
            changed = true;
          }
        }
      }

      var hasATS = allTools.some(function(tool){
        return normalize(tool && tool.name) === normalize(ATS_NAME) || normalizeUrl(tool && tool.url) === 'tools/ats-resume-score-checker';
      });

      if(!hasATS){
        allTools.splice(1, 0, {
          name: ATS_NAME,
          desc: 'Compare your resume against a job description to find missing keywords and improve ATS compatibility.',
          icon: 'fas fa-file-alt',
          cat: 'text',
          url: 'tools/ats-resume-score-checker'
        });
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

  // Remove only duplicate rendered cards. All unique tools remain visible.
  function cleanRenderedHomepage(){
    var cards = document.querySelectorAll('.tool-card, .quick-tool');
    var seen = new Set();

    cards.forEach(function(card){
      var title = card.querySelector('.tool-title, .tool-name, h3, h4');
      var name = normalize(title ? title.textContent : '');
      var link = card.getAttribute('href') || (card.querySelector('a') && card.querySelector('a').getAttribute('href')) || '';
      var url = normalizeUrl(link);
      var key = url || ('name:' + name);

      if(!key || seen.has(key)){
        card.remove();
        return;
      }
      seen.add(key);

      if(name === normalize(ATS_NAME) || url === 'tools/ats-resume-score-checker'){
        addATSIcon(card);
      }
    });
  }

  function cleanup(){
    ensureHomeCatalog();
    cleanRenderedHomepage();
  }

  function boot(){
    cleanup();

    var attempts = 0;
    var timer = setInterval(function(){
      cleanup();
      attempts += 1;
      if(attempts >= 20) clearInterval(timer);
    }, 250);

    if(document.body && window.MutationObserver){
      var observer = new MutationObserver(function(){
        cleanRenderedHomepage();
      });
      observer.observe(document.body, {childList:true, subtree:true});
      setTimeout(function(){ observer.disconnect(); }, 6000);
    }
  }

  function load(src){
    var s=document.createElement('script');
    s.src=src;
    s.defer=false;
    document.head.appendChild(s);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot, {once:true});
  }else{
    boot();
  }

  load('/script-optimized.js?v=20260816');
  load('/assets/new-featured-tools.js?v=20260816');
})();