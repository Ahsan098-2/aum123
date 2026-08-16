/* Daily Toolkit front-end enhancement loader. */
(function(){
  'use strict';

  var ATS_NAME = 'ATS Resume Score Checker';
  var HIDDEN_HOME_TOOLS = new Set([
    'salary take-home calculator',
    'debt payoff calculator',
    'investment return calculator',
    'retirement calculator',
    'e-commerce profit calculator',
    'business break-even calculator',
    'freelancer hourly rate calculator',
    'job offer comparison calculator',
    'website seo audit tool',
    'css gradient generator'
  ]);

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

  function isHiddenHomeTool(tool){
    if(!tool) return false;
    var name = normalize(tool.name);
    var url = normalizeUrl(tool.url);
    if(HIDDEN_HOME_TOOLS.has(name)) return true;
    for(var hiddenName of HIDDEN_HOME_TOOLS){
      var slug = hiddenName.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if(url === 'tools/' + slug) return true;
    }
    return false;
  }

  // Keep ATS in the main catalog only once, while removing only the
  // screenshot-requested cards from the homepage. Their actual tool files
  // remain untouched and continue to work at their normal URLs.
  function ensureHomeCatalog(){
    try{
      if(typeof allTools === 'undefined' || !Array.isArray(allTools)) return false;

      var changed = false;
      var seen = new Set();
      var filtered = [];

      allTools.forEach(function(tool){
        if(isHiddenHomeTool(tool)){
          changed = true;
          return;
        }

        var name = normalize(tool && tool.name);
        var url = normalizeUrl(tool && tool.url);
        var key = url || ('name:' + name);

        if(seen.has(key)){
          changed = true;
          return;
        }

        seen.add(key);
        filtered.push(tool);
      });

      allTools.length = 0;
      Array.prototype.push.apply(allTools, filtered);

      var atsIndexes = [];
      allTools.forEach(function(tool, index){
        if(normalize(tool && tool.name) === normalize(ATS_NAME) || normalizeUrl(tool && tool.url) === 'tools/ats-resume-score-checker'){
          atsIndexes.push(index);
        }
      });

      if(atsIndexes.length > 1){
        for(var i = atsIndexes.length - 1; i > 0; i--){
          allTools.splice(atsIndexes[i], 1);
          changed = true;
        }
      }

      // If ATS is missing entirely, add it once directly after the first tool.
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

  function cleanRenderedHomepage(){
    var cards = document.querySelectorAll('.tool-card, .quick-tool');
    var seenATS = false;

    cards.forEach(function(card){
      var text = normalize(card.textContent);
      var title = card.querySelector('.tool-title, .tool-name, h3, h4');
      var name = normalize(title ? title.textContent : text);
      var link = card.getAttribute('href') || (card.querySelector('a') && card.querySelector('a').getAttribute('href')) || '';
      var url = normalizeUrl(link);

      var hidden = HIDDEN_HOME_TOOLS.has(name);
      if(!hidden){
        for(var hiddenName of HIDDEN_HOME_TOOLS){
          var slug = hiddenName.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          if(url === 'tools/' + slug){
            hidden = true;
            break;
          }
        }
      }

      if(hidden){
        card.remove();
        return;
      }

      var isATS = name === normalize(ATS_NAME) || url === 'tools/ats-resume-score-checker';
      if(isATS){
        if(seenATS){
          card.remove();
          return;
        }
        seenATS = true;
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

    // Some homepage catalog scripts render asynchronously. Keep the cleanup
    // active briefly so late-added duplicate cards are removed as well.
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

  load('/script-optimized.js?v=20260815');
  load('/assets/new-featured-tools.js?v=20260815');
})();
