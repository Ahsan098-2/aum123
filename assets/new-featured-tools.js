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
    ['📄','ATS Resume Score Checker','Compare resume wording with a target job description using local keyword analysis.','tools/ats-resume-score-checker.html','text'],
    ['🔎','Website SEO Audit Tool','Review titles, descriptions, headings, canonical tags, links and basic on-page SEO.','tools/website-seo-audit.html','text']
  ];

  function makeCard(t){
    const a=document.createElement('a');
    a.className='tool-card-item premium-featured-tool';
    a.href='/' + t[3].replace(/^\//,'');
    a.setAttribute('data-premium-tool','true');
    a.setAttribute('aria-label',t[1]+' - '+t[2]);
    a.innerHTML='<div class="tc-icon">'+t[0]+'</div><div class="tc-name">'+t[1]+'</div><div class="tc-desc">'+t[2]+'</div><div class="tc-arrow" aria-hidden="true">Use Tool →</div>';
    return a;
  }

  function ensureATSCard(grid){
    if(!grid || typeof currentFilter!=='undefined' && currentFilter!=='all') return;
    if(grid.querySelector('[data-ats-resume-tool="true"]')) return;

    const ats=makeCard(['📄','ATS Resume Score Checker','Compare your resume against a job description to find missing keywords and improve ATS compatibility.','tools/ats-resume-score-checker.html','text']);
    ats.setAttribute('data-ats-resume-tool','true');

    // Put ATS directly after Age Calculator so it is visible beside it on the home page.
    const cards=Array.from(grid.querySelectorAll('.tool-card-item'));
    const age=cards.find(function(card){
      const href=card.getAttribute('href')||'';
      return href.includes('age-calculator');
    });
    if(age){
      age.insertAdjacentElement('afterend',ats);
    }else{
      grid.appendChild(ats);
    }
  }

  function integrateWithExistingCatalog(grid){
    try{
      if(typeof allTools!=='undefined' && Array.isArray(allTools) && typeof renderTools==='function'){
        const existing=new Set(allTools.map(function(t){return t.url}));
        premiumTools.forEach(function(t){
          if(!existing.has(t[3])){
            allTools.push({name:t[1],desc:t[2],icon:'fas fa-star',cat:t[4],url:t[3]});
          }
        });
        renderTools();
        // renderTools can rebuild the grid, so enforce the requested ATS placement afterwards.
        ensureATSCard(grid);
        return true;
      }
    }catch(error){
      console.warn('Daily Toolkit premium catalog integration fallback:',error);
    }
    return false;
  }

  function patchRenderTools(grid){
    if(typeof renderTools!=='function' || renderTools.__atsPatched) return;
    const original=renderTools;
    function patchedRenderTools(){
      original.apply(this,arguments);
      setTimeout(function(){ ensureATSCard(grid); },0);
    }
    patchedRenderTools.__atsPatched=true;
    window.renderTools=patchedRenderTools;
  }

  function init(){
    const grid=document.getElementById('toolsGrid');
    if(!grid){
      setTimeout(init,250);
      return;
    }

    patchRenderTools(grid);
    integrateWithExistingCatalog(grid);
    setTimeout(function(){ ensureATSCard(grid); },50);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();