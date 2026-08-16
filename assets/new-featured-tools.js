(function(){
  'use strict';

  const HIDDEN_FROM_HOME = new Set([
    'tools/salary-take-home-calculator.html',
    'tools/debt-payoff-calculator.html',
    'tools/investment-return-calculator.html',
    'tools/retirement-calculator.html',
    'tools/ecommerce-profit-calculator.html',
    'tools/business-break-even-calculator.html',
    'tools/freelancer-hourly-rate-calculator.html',
    'tools/job-offer-comparison-calculator.html',
    'tools/website-seo-audit-tool.html',
    'tools/css-gradient-generator.html'
  ]);

  const HIDDEN_NAMES = new Set([
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

  const premiumTools = [
    ['📄','ATS Resume Score Checker','Compare your resume against a job description to find missing keywords and improve ATS compatibility.','tools/ats-resume-score-checker.html','text']
  ];

  function normalizeUrl(value){
    return String(value || '').trim().replace(/^\/+/, '').replace(/\.html$/i, '').replace(/\/$/, '').toLowerCase();
  }

  function normalizeName(value){
    return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
  }

  function isHiddenFromHome(tool){
    if(!tool) return false;
    const url = normalizeUrl(tool.url);
    const name = normalizeName(tool.name);
    if(HIDDEN_NAMES.has(name)) return true;
    for(const hiddenUrl of HIDDEN_FROM_HOME){
      if(url === normalizeUrl(hiddenUrl)) return true;
    }
    return false;
  }

  function removeDuplicateAndHiddenCatalogEntries(){
    if(typeof allTools === 'undefined' || !Array.isArray(allTools)) return false;
    const seen = new Set();
    let changed = false;

    for(let i = allTools.length - 1; i >= 0; i--){
      const tool = allTools[i] || {};
      if(isHiddenFromHome(tool)){
        allTools.splice(i, 1);
        changed = true;
        continue;
      }
      const key = normalizeUrl(tool.url) || ('name:' + normalizeName(tool.name));
      if(seen.has(key)){
        allTools.splice(i, 1);
        changed = true;
      }else{
        seen.add(key);
      }
    }
    return changed;
  }

  function integrateWithExistingCatalog(){
    try{
      if(typeof allTools !== 'undefined' && Array.isArray(allTools) && typeof renderTools === 'function'){
        let changed = removeDuplicateAndHiddenCatalogEntries();
        const existing = new Set(allTools.map(function(t){ return normalizeUrl(t && t.url); }));

        premiumTools.forEach(function(t){
          const normalized = normalizeUrl(t[3]);
          if(!existing.has(normalized)){
            allTools.push({name:t[1],desc:t[2],icon:'fas fa-file-alt',cat:t[4],url:normalized});
            existing.add(normalized);
            changed = true;
          }
        });
        if(changed) renderTools();
      }
    }catch(error){
      console.warn('Daily Toolkit homepage catalog integration:', error);
    }
  }

  function removeRenderedHiddenCards(){
    document.querySelectorAll('.tool-card, .quick-tool').forEach(function(card){
      const title = card.querySelector('.tool-title, .tool-name, h3, h4');
      const name = normalizeName(title ? title.textContent : card.textContent);
      const link = card.getAttribute('href') || (card.querySelector('a') && card.querySelector('a').getAttribute('href')) || '';
      const url = normalizeUrl(link);
      if(HIDDEN_NAMES.has(name)){
        card.remove();
        return;
      }
      for(const hiddenUrl of HIDDEN_FROM_HOME){
        if(url === normalizeUrl(hiddenUrl)){
          card.remove();
          return;
        }
      }
    });
  }

  function init(){
    integrateWithExistingCatalog();
    removeRenderedHiddenCards();
    setTimeout(removeRenderedHiddenCards, 100);
    setTimeout(removeRenderedHiddenCards, 500);
    setTimeout(removeRenderedHiddenCards, 1500);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, {once:true});
  }else{
    init();
  }
})();
