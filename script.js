/* Daily Toolkit front-end enhancement loader. */
(function(){
  'use strict';

  var ATS_URL = 'tools/ats-resume-score-checker.html';
  var ATS_NAME = 'ATS Resume Score Checker';

  function ensureATSInCatalog(){
    try{
      if(typeof allTools !== 'undefined' && Array.isArray(allTools)){
        var exists = allTools.some(function(t){
          return t && (t.name === ATS_NAME || t.url === ATS_URL || t.url === '/tools/ats-resume-score-checker.html');
        });
        if(!exists){
          allTools.splice(1, 0, {
            name: ATS_NAME,
            desc: 'Compare your resume against a job description to find missing keywords and improve ATS compatibility.',
            icon: 'fas fa-file-alt',
            cat: 'text',
            url: ATS_URL
          });
        }
        if(typeof renderTools === 'function') renderTools();
      }
    }catch(error){
      console.warn('Daily Toolkit ATS catalog integration:', error);
    }
  }

  function makeATSCard(){
    var card = document.createElement('a');
    card.href = '/tools/ats-resume-score-checker.html';
    card.className = 'tool-card-item ats-resume-home-card';
    card.setAttribute('data-ats-home-card','true');
    card.setAttribute('aria-label','ATS Resume Score Checker - Compare your resume against a job description to find missing keywords and improve ATS compatibility.');
    card.innerHTML = '<div class="tc-icon"><svg class="icon" aria-hidden="true"><use href="#i-file"></use></svg></div>' +
      '<div class="tc-name">ATS Resume Score Checker</div>' +
      '<div class="tc-desc">Compare your resume against a job description to find missing keywords and improve ATS compatibility.</div>' +
      '<div class="tc-arrow" aria-hidden="true">Use Tool →</div>';
    return card;
  }

  function ensureATSVisible(){
    var grid = document.getElementById('toolsGrid');
    if(!grid) return false;

    if(grid.querySelector('[data-ats-home-card="true"]')) return true;

    var existing = Array.prototype.find.call(grid.querySelectorAll('.tool-card-item'), function(card){
      var href = card.getAttribute('href') || '';
      return href.indexOf('ats-resume-score-checker') !== -1;
    });
    if(existing){
      existing.setAttribute('data-ats-home-card','true');
      return true;
    }

    var card = makeATSCard();
    var age = Array.prototype.find.call(grid.querySelectorAll('.tool-card-item'), function(item){
      var href = item.getAttribute('href') || '';
      return href.indexOf('age-calculator') !== -1;
    });

    if(age && age.parentNode === grid){
      grid.insertBefore(card, age.nextSibling);
    }else{
      grid.insertBefore(card, grid.firstChild);
    }
    return true;
  }

  function boot(){
    ensureATSInCatalog();
    ensureATSVisible();

    var grid = document.getElementById('toolsGrid');
    if(grid && !grid.__atsVisibilityObserver){
      var observer = new MutationObserver(function(){
        if(!grid.querySelector('[data-ats-home-card="true"]')){
          setTimeout(ensureATSVisible, 0);
        }
      });
      observer.observe(grid, {childList:true});
      grid.__atsVisibilityObserver = observer;
    }

    setTimeout(ensureATSInCatalog, 100);
    setTimeout(ensureATSVisible, 150);
    setTimeout(ensureATSVisible, 500);
    setTimeout(ensureATSVisible, 1500);
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
