document.addEventListener('DOMContentLoaded',function(){
  const grid=document.getElementById('toolsGrid');
  if(!grid)return;
  const tools=[
    ['💰','Salary Take-Home Calculator','Estimate gross-to-net salary with taxes and deductions.','tools/salary-take-home-calculator.html','calculator'],
    ['💳','Debt Payoff Calculator','Estimate payoff time and total interest for a debt.','tools/debt-payoff-calculator.html','calculator'],
    ['📈','Investment Return Calculator','Project future value from starting capital and contributions.','tools/investment-return-calculator.html','calculator'],
    ['🏦','Retirement Calculator','Plan a retirement savings target from your current assumptions.','tools/retirement-calculator.html','calculator'],
    ['🛒','E-commerce Profit Calculator','Calculate product profit after costs, fees, shipping and ads.','tools/ecommerce-profit-calculator.html','business'],
    ['📊','Business Break-Even Calculator','Find the sales volume required to cover fixed and variable costs.','tools/business-break-even-calculator.html','business'],
    ['💼','Freelancer Hourly Rate Calculator','Find a sustainable freelance hourly rate from your income goal.','tools/freelancer-hourly-rate-calculator.html','business'],
    ['👔','Job Offer Comparison Calculator','Compare salary, bonuses, benefits and recurring commute costs.','tools/job-offer-comparison-calculator.html','business'],
    ['📄','ATS Resume Score Checker','Compare resume wording with a target job description.','tools/ats-resume-score-checker.html','text'],
    ['🔎','Website SEO Audit Tool','Check titles, descriptions, headings, canonical, links and more.','tools/website-seo-audit-tool.html','seo']
  ];
  const marker=document.createElement('div');
  marker.style.cssText='grid-column:1/-1;background:#0A0A0A;color:#fff;padding:14px 18px;font-size:.78rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;display:flex;align-items:center;justify-content:space-between';
  marker.innerHTML='<span>✦ New Premium Tools</span><span style="color:#E8D28A">10 new utilities</span>';
  grid.prepend(marker);
  tools.slice().reverse().forEach(function(t){
    const a=document.createElement('a');a.className='tool-card-item';a.href=t[3];a.dataset.category=t[4];a.dataset.newTool='true';
    a.innerHTML='<span class="tc-icon" aria-hidden="true">'+t[0]+'</span><span class="tc-name">'+t[1]+'</span><span class="tc-desc">'+t[2]+'</span><span class="tc-arrow">USE TOOL →</span>';
    grid.prepend(a);
  });
  const style=document.createElement('style');style.textContent='[data-new-tool="true"]{position:relative}[data-new-tool="true"]:before{content:"NEW";position:absolute;top:9px;right:9px;font-size:9px;letter-spacing:.08em;font-weight:800;color:#7A5C18;background:#F5E8B8;padding:3px 5px;border-radius:2px}[data-new-tool="true"] .tc-icon{font-size:1.35rem}';document.head.appendChild(style);
});