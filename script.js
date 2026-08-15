/* Daily Toolkit front-end enhancement loader. */
(function(){
  // Ensure the ATS Resume Score Checker is present in the home-page catalog
  // before the featured-tool integration runs. This preserves the existing
  // allTools card renderer and its CSS/design pattern.
  function ensureATSResumeTool(){
    try{
      if(typeof allTools !== 'undefined' && Array.isArray(allTools)){
        var exists = allTools.some(function(t){
          return t && (t.name === 'ATS Resume Score Checker' || t.url === 'tools/ats-resume-score-checker.html');
        });
        if(!exists){
          allTools.unshift({
            name:'ATS Resume Score Checker',
            desc:'Compare your resume wording with a target job description to find missing keywords and improve ATS compatibility.',
            icon:'fas fa-file-pdf',
            cat:'text',
            url:'tools/ats-resume-score-checker.html'
          });
        }
        if(typeof renderTools === 'function') renderTools();
      }
    }catch(error){
      console.warn('Daily Toolkit ATS tool catalog integration:', error);
    }
  }

  function load(src){
    var s=document.createElement('script');
    s.src=src;
    s.defer=false;
    document.head.appendChild(s);
  }

  ensureATSResumeTool();
  load('/script-optimized.js?v=20260815');
  load('/assets/new-featured-tools.js?v=20260815');
  load('/assets/home-ats-tool.js?v=20260815');
})();
