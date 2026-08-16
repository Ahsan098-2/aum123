(function(){
  'use strict';

  // New tools that should be visible on the homepage.
  // Existing entries are preserved; only duplicate catalog entries are removed.
  const NEW_TOOLS = [
    ['ATS Resume Score Checker','Compare your resume against a job description to find missing keywords and improve ATS compatibility.','tools/ats-resume-score-checker.html','fas fa-file-alt','Career'],
    ['Salary Take-Home Calculator','Estimate your take-home salary after taxes and common deductions.','tools/salary-take-home-calculator.html','fas fa-money-bill-wave','Finance'],
    ['Debt Payoff Calculator','Calculate payoff time, interest, and a practical debt repayment plan.','tools/debt-payoff-calculator.html','fas fa-credit-card','Finance'],
    ['Investment Return Calculator','Estimate investment growth, returns, and future value using your inputs.','tools/investment-return-calculator.html','fas fa-chart-line','Finance'],
    ['Retirement Calculator','Estimate retirement savings needs and projected retirement growth.','tools/retirement-calculator.html','fas fa-umbrella-beach','Finance'],
    ['E-commerce Profit Calculator','Calculate product revenue, costs, fees, and estimated e-commerce profit.','tools/ecommerce-profit-calculator.html','fas fa-shopping-cart','Business'],
    ['Business Break-Even Calculator','Find the sales volume and revenue needed to reach your business break-even point.','tools/business-break-even-calculator.html','fas fa-chart-pie','Business'],
    ['Freelancer Hourly Rate Calculator','Calculate a sustainable freelance hourly rate from income goals, expenses, and working hours.','tools/freelancer-hourly-rate-calculator.html','fas fa-user-clock','Business'],
    ['Job Offer Comparison Calculator','Compare multiple job offers by salary, benefits, deductions, and total value.','tools/job-offer-comparison-calculator.html','fas fa-balance-scale','Career'],
    ['Website SEO Audit Tool','Check important on-page SEO factors and identify areas to improve your website.','tools/website-seo-audit-tool.html','fas fa-search','SEO'],
    ['CSS Gradient Generator','Create custom CSS gradients and copy the ready-to-use CSS code.','tools/css-gradient-generator.html','fas fa-palette','Design']
  ];

  function normalizeUrl(value){
    return String(value || '').trim()
      .replace(/^\/+/, '')
      .replace(/\.html$/i, '')
      .replace(/\/$/, '')
      .toLowerCase();
  }

  function normalizeName(value){
    return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
  }

  // Keep one copy of every tool. This intentionally does NOT hide any of the new tools.
  function removeDuplicateCatalogEntries(){
    if(typeof allTools === 'undefined' || !Array.isArray(allTools)) return false;

    const seenUrls = new Set();
    const seenNames = new Set();
    let changed = false;

    const cleaned = [];
    allTools.forEach(function(tool){
      tool = tool || {};
      const url = normalizeUrl(tool.url);
      const name = normalizeName(tool.name);
      const key = url || ('name:' + name);

      if((url && seenUrls.has(url)) || (!url && seenNames.has(name))){
        changed = true;
        return;
      }

      if(url) seenUrls.add(url);
      if(name) seenNames.add(name);
      if(key) cleaned.push(tool);
    });

    if(changed){
      allTools.length = 0;
      cleaned.forEach(function(tool){ allTools.push(tool); });
    }
    return changed;
  }

  function addMissingNewTools(){
    if(typeof allTools === 'undefined' || !Array.isArray(allTools)) return false;

    const existingUrls = new Set(allTools.map(function(tool){
      return normalizeUrl(tool && tool.url);
    }));
    const existingNames = new Set(allTools.map(function(tool){
      return normalizeName(tool && tool.name);
    }));
    let changed = false;

    NEW_TOOLS.forEach(function(tool){
      const name = normalizeName(tool[0]);
      const url = normalizeUrl(tool[2]);

      if(existingUrls.has(url) || existingNames.has(name)) return;

      allTools.push({
        name: tool[0],
        desc: tool[1],
        url: url,
        icon: tool[3],
        cat: tool[4]
      });
      existingUrls.add(url);
      existingNames.add(name);
      changed = true;
    });

    return changed;
  }

  function removeDuplicateRenderedCards(){
    const seenUrls = new Set();
    const seenNames = new Set();

    document.querySelectorAll('.tool-card, .quick-tool').forEach(function(card){
      const title = card.querySelector('.tool-title, .tool-name, h3, h4');
      const linkElement = card.querySelector('a[href]');
      const name = normalizeName(title ? title.textContent : '');
      const url = normalizeUrl(linkElement ? linkElement.getAttribute('href') : card.getAttribute('href'));

      if((url && seenUrls.has(url)) || (!url && name && seenNames.has(name))){
        card.remove();
        return;
      }

      if(url) seenUrls.add(url);
      if(name) seenNames.add(name);
    });
  }

  function integrate(){
    try{
      if(typeof allTools !== 'undefined' && Array.isArray(allTools)){
        const deduped = removeDuplicateCatalogEntries();
        const added = addMissingNewTools();

        if((deduped || added) && typeof renderTools === 'function'){
          renderTools();
        }
      }

      // Safety net for homepage markup that may already contain duplicate cards.
      removeDuplicateRenderedCards();
      setTimeout(removeDuplicateRenderedCards, 100);
      setTimeout(removeDuplicateRenderedCards, 500);
      setTimeout(removeDuplicateRenderedCards, 1500);
    }catch(error){
      console.warn('Daily Toolkit homepage catalog integration:', error);
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', integrate, {once:true});
  }else{
    integrate();
  }
})();
