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
    a.innerHTML='<span class="tc-icon">'+t[0]+'</span><span class="tc-name">'+t[1]+'</span><span class="tc-desc">'+t[2]+'</span><span class="tc-arrow">Use Tool →</span>';
    return a;
  }

  function renderIndependent(grid){
    if(!grid || grid.dataset.premiumRendered==='true') return;
    grid.dataset.premiumRendered='true';

    const fragment=document.createDocumentFragment();
    const marker=document.createElement('div');
    marker.id='premiumToolsMarker';
    marker.style.cssText='grid-column:1/-1;background:#0A0A0A;color:#fff;padding:14px 18px;font-size:.78rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;display:flex;align-items:center;justify-content:space-between;border-radius:10px;margin-bottom:4px';
    marker.innerHTML='<span>✦ New Premium Tools</span><span style="color:#E8D28A">10 high-value utilities</span>';
    fragment.appendChild(marker);

    premiumTools.forEach(function(t){ fragment.appendChild(makeCard(t)); });
    grid.prepend(fragment);
  }

  function integrateWithExistingCatalog(grid){
    try{
      if(typeof allTools!=='undefined' && Array.isArray(allTools) && typeof renderTools==='function'){
        const existing=new Set(allTools.map(function(t){return t.url}));
        premiumTools.forEach(function(t){
          if(!existing.has(t[3])){
            allTools.unshift({name:t[1],desc:t[2],icon:'fas fa-star',cat:t[4],url:t[3]});
          }
        });
        renderTools();
        grid.dataset.premiumRendered='true';
        return true;
      }
    }catch(error){
      console.warn('Daily Toolkit premium catalog integration fallback:',error);
    }
    return false;
  }

  function init(){
    const grid=document.getElementById('toolsGrid');
    if(!grid){
      setTimeout(init,250);
      return;
    }

    if(grid.dataset.premiumRendered==='true') return;

    if(!integrateWithExistingCatalog(grid)){
      renderIndependent(grid);
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();