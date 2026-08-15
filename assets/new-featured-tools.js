document.addEventListener('DOMContentLoaded',function(){
  const tools=[
    ['💰','Salary Take-Home Calculator','Estimate gross-to-net salary with taxes and deductions.','tools/salary-take-home-calculator.html','calculator'],
    ['💳','Debt Payoff Calculator','Estimate payoff time and total interest for a debt.','tools/debt-payoff-calculator.html','calculator'],
    ['📈','Investment Return Calculator','Project future value from starting capital and contributions.','tools/investment-return-calculator.html','calculator'],
    ['🏦','Retirement Calculator','Plan a retirement savings target from your current assumptions.','tools/retirement-calculator.html','calculator'],
    ['🛒','E-commerce Profit Calculator','Calculate product profit after costs, fees, shipping and ads.','tools/ecommerce-profit-calculator.html','calculator'],
    ['📊','Business Break-Even Calculator','Find the sales volume required to cover fixed and variable costs.','tools/business-break-even-calculator.html','calculator'],
    ['💼','Freelancer Hourly Rate Calculator','Find a sustainable freelance hourly rate from your income goal.','tools/freelancer-hourly-rate-calculator.html','calculator'],
    ['👔','Job Offer Comparison Calculator','Compare salary, bonuses, benefits and recurring commute costs.','tools/job-offer-comparison-calculator.html','calculator'],
    ['📄','ATS Resume Score Checker','Compare resume wording with a target job description.','tools/ats-resume-score-checker.html','text'],
    ['🔎','Website SEO Audit Tool','Check titles, descriptions, headings, canonical, links and more.','tools/website-seo-audit-tool.html','text']
  ];
  // Add the new tools to the homepage's existing catalog so filters and search continue to work.
  if(Array.isArray(window.allTools)){
    const existing=new Set(window.allTools.map(function(t){return t.url}));
    tools.slice().reverse().forEach(function(t){
      const item={name:t[1],desc:t[2],icon:'fas fa-star',cat:t[4],url:t[3]};
      if(!existing.has(item.url)) window.allTools.unshift(item);
    });
    if(typeof window.renderTools==='function') window.renderTools();
    return;
  }
  // Fallback for deployments where the inline catalog is not exposed on window.
  const grid=document.getElementById('toolsGrid'); if(!grid)return;
  const marker=document.createElement('div');marker.style.cssText='grid-column:1/-1;background:#0A0A0A;color:#fff;padding:14px 18px;font-size:.78rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;display:flex;align-items:center;justify-content:space-between';marker.innerHTML='<span>✦ New Premium Tools</span><span style="color:#E8D28A">10 new utilities</span>';grid.prepend(marker);
  tools.slice().reverse().forEach(function(t){const a=document.createElement('a');a.className='tool-card-item';a.href=t[3];a.dataset.newTool='true';a.innerHTML='<span class="tc-icon">'+t[0]+'</span><span class="tc-name">'+t[1]+'</span><span class="tc-desc">'+t[2]+'</span><span class="tc-arrow">Use Tool →</span>';grid.prepend(a)});
  const style=document.createElement('style');style.textContent='[data-new-tool="true"]{position:relative}[data-new-tool="true"]:before{content:"NEW";position:absolute;top:9px;right:9px;font-size:9px;font-weight:800;color:#7A5C18;background:#F5E8B8;padding:3px 5px;border-radius:2px}';document.head.appendChild(style);
});