/* Daily Toolkit front-end enhancement loader. */
(function(){
  'use strict';

  var ATS_NAME = 'ATS Resume Score Checker';

  // Keep ATS in the catalog only once. The catalog renderer creates the card.
  // Do not inject a second standalone ATS card here.
  function ensureATSInCatalog(){
    try{
      if(typeof allTools !== 'undefined' && Array.isArray(allTools)){
        var exists = allTools.some(function(t){
          if(!t) return false;
          var name = String(t.name || '').trim().toLowerCase();
          var url = String(t.url || '').trim().replace(/^\//,'').replace(/\.html$/,'').toLowerCase();
          return name === ATS_NAME.toLowerCase() || url === 'tools/ats-resume-score-checker';
        });

        if(!exists){
          allTools.splice(1, 0, {
            name: ATS_NAME,
            desc: 'Compare your resume against a job description to find missing keywords and improve ATS compatibility.',
            icon: 'fas fa-file-alt',
            cat: 'text',
            url: 'tools/ats-resume-score-checker'
          });
        }

        if(typeof renderTools === 'function') renderTools();
      }
    }catch(error){
      console.warn('Daily Toolkit ATS catalog integration:', error);
    }
  }

  function boot(){
    ensureATSInCatalog();
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
