(function(){
  'use strict';

  const premiumTools = [
    ['💰','Salary Take-Home Calculator','Estimate gross-to-net salary with taxes and deductions.','tools/salary-take-home-calculator.html','calculator'],
    ['💳','Debt Payoff Calculator','Estimate payoff time, payment schedule and total interest.','tools/debt-payoff-calculator.html','calculator'],
    ['📈','Investment Return Calculator','Project future value from starting capital, contributions and return assumptions.','tools/investment-return-calculator.html','calculator'],
    ['🏦','Retirement Calculator','Estimate retirement savings growth and target outcomes.','tools/retirement-calculator.html','calculator'],
    ['🛒','E-commerce Profit Calculator','Calculate product profit after costs, fees, shipping and advertising.','tools/ecommerce-profit-calculator.html','calculator'],
    ['📊','Business Break-Even Calculator','Find the sales volume required to cover fixed and variable costs.','tools/business-break-even-calculator.html','calculator'],
    ['💼','Freelancer Hourly Rate Calculator','Find a sustainable freelance rate from income goals, expenses and billable time.','tools/freelancer-hourly-rate-calculator.html','calculator'],
    ['👔','Job Offer Comparison Calculator','Compare compensation, bonuses, benefits and recurring work costs.','tools/job-offer-comparison-calculator.html','calculator'],
    ['📄','ATS Resume Score Checker','Compare your resume against a job description to find missing keywords and improve ATS compatibility.','tools/ats-resume-score-checker.html','text'],
    ['🔎','Website SEO Audit Tool','Review titles, descriptions, headings, canonical tags, links and basic on-page SEO.','tools/website-seo-audit-tool.html','text']
  ];

  function normalizeUrl(value){
    return String(value || '')
      .trim()
      .replace(/^\/+/, '')
      .replace(/\.html$/i, '')
      .replace(/\/$/, '')
      .toLowerCase();
  }

  function normalizeName(value){
    return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
  }

  function removeDuplicateCatalogEntries(){
    if(typeof allTools === 'undefined' || !Array.isArray(allTools)) return false;

    const seen = new Set();
    let changed = false;

    for(let i = allTools.length - 1; i >= 0; i--){
      const tool = allTools[i] || {};
      const urlKey = normalizeUrl(tool.url);
      const nameKey = normalizeName(tool.name);
      const key = urlKey || ('name:' + nameKey);

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
        let changed = removeDuplicateCatalogEntries();
        const existing = new Set(allTools.map(function(t){ return normalizeUrl(t && t.url); }));

        premiumTools.forEach(function(t){
          const normalized = normalizeUrl(t[3]);
          if(!existing.has(normalized)){
            allTools.push({
              name: t[1],
              desc: t[2],
              icon: 'fas fa-star',
              cat: t[4],
              url: normalized
            });
            existing.add(normalized);
            changed = true;
          }
        });

        if(changed) renderTools();
      }
    }catch(error){
      console.warn('Daily Toolkit premium catalog integration:', error);
    }
  }

  function init(){
    integrateWithExistingCatalog();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, {once:true});
  }else{
    init();
  }
})();
