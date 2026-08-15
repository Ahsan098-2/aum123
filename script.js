// Tool modal open/close logic
document.addEventListener('DOMContentLoaded', () => {
  const openButtons = document.querySelectorAll('.open-tool-btn');
  const backdrop = document.getElementById('toolModalBackdrop');
  const content = document.getElementById('toolModalContent');
  const closeBtn = document.getElementById('closeToolModal');

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const toolId = btn.getAttribute('data-tool');
      const fullTool = document.getElementById(`tool-full-${toolId}`);
      if (fullTool) {
        content.innerHTML = fullTool.innerHTML;
        backdrop.style.display = 'flex';
      }
    });
  });

  closeBtn.addEventListener('click', () => {
    backdrop.style.display = 'none';
    content.innerHTML = '';
  });

  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) {
      backdrop.style.display = 'none';
      content.innerHTML = '';
    }
  });
});

/* Visual enhancements */
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (isFinePointer && !prefersReducedMotion) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot'; ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    let mouseX=0,mouseY=0,ringX=0,ringY=0;
    document.addEventListener('mousemove',e=>{mouseX=e.clientX;mouseY=e.clientY;dot.style.transform=`translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;});
    function loop(){ringX+=(mouseX-ringX)*.18;ringY+=(mouseY-ringY)*.18;ring.style.transform=`translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;requestAnimationFrame(loop)}
    loop();
  }

  const observer = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
});

/* ================================================================
   DAILY TOOLKIT — 1000 TOOL HOMEPAGE CONNECTOR
   Loads the generated-tools manifest and connects every generated
   page to the existing #toolsGrid on index.html. The homepage remains
   static/SEO friendly while the browser renders the full live catalog.
================================================================ */
(function init1000ToolCatalog(){
  const manifestUrl = 'generated-tools/manifest.json';

  function escapeHtml(value){
    return String(value ?? '').replace(/[&<>\"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[ch]));
  }

  function iconForCategory(category){
    const c = category.toLowerCase();
    if(c.includes('pdf') || c.includes('file')) return 'file-pdf';
    if(c.includes('image') || c.includes('color') || c.includes('typography')) return 'image';
    if(c.includes('security') || c.includes('password')) return 'shield-heart';
    if(c.includes('math') || c.includes('calculator') || c.includes('algebra') || c.includes('statistics')) return 'calculator';
    if(c.includes('date') || c.includes('time')) return 'birthday-cake';
    if(c.includes('finance') || c.includes('business')) return 'coins';
    if(c.includes('seo') || c.includes('marketing') || c.includes('social')) return 'hashtag';
    if(c.includes('developer') || c.includes('code') || c.includes('json') || c.includes('css') || c.includes('html')) return 'tools';
    if(c.includes('url') || c.includes('encoding') || c.includes('regex')) return 'link';
    if(c.includes('health')) return 'weight';
    return 'tools';
  }

  function installCatalog(rows){
    if(!Array.isArray(rows) || !rows.length) return;

    // Replace the old small homepage catalog with all generated tools.
    window.allTools = rows.map(r => ({
      id: r.id,
      name: r.title,
      desc: `${r.operation} utility in ${r.category}`,
      category: r.category,
      cat: r.category.toLowerCase(),
      iconName: iconForCategory(r.category),
      url: r.path
    }));

    // Keep the existing inline homepage functions compatible.
    window.currentFilter = 'all';
    window.currentSearch = '';

    const grid = document.getElementById('toolsGrid');
    const noResult = document.getElementById('noSearchResult');
    if(!grid) return;

    // Build a compact category navigation above the 1000-card grid.
    const tabWrap = document.querySelector('.filter-tabs');
    if(tabWrap){
      const categories = [...new Set(rows.map(r=>r.category))];
      tabWrap.innerHTML = '';
      const allBtn = document.createElement('button');
      allBtn.className='filter-tab active';
      allBtn.type='button';
      allBtn.textContent=`All 1000 Tools`;
      allBtn.addEventListener('click',()=>setCatalogFilter('all',allBtn));
      tabWrap.appendChild(allBtn);
      categories.forEach(category=>{
        const btn=document.createElement('button');
        btn.className='filter-tab'; btn.type='button'; btn.textContent=category;
        btn.addEventListener('click',()=>setCatalogFilter(category.toLowerCase(),btn));
        tabWrap.appendChild(btn);
      });
    }

    // Update homepage stats to reflect the actual connected catalog.
    document.querySelectorAll('.stat-number').forEach(el=>{
      if(el.textContent.trim().match(/\d/)) el.textContent='1,000+';
    });
    document.querySelectorAll('.stat-label').forEach(el=>{
      if(el.textContent.toLowerCase().includes('free tools')) el.textContent='Connected Tools';
    });

    function render(){
      const filter = window.catalogFilter || 'all';
      const query = (window.catalogSearch || '').trim().toLowerCase();
      const filtered = window.allTools.filter(t=>{
        const catOk = filter==='all' || t.cat===filter;
        const text = `${t.name} ${t.desc} ${t.category}`.toLowerCase();
        return catOk && (!query || text.includes(query));
      });
      noResult.style.display=filtered.length?'none':'block';
      grid.innerHTML=filtered.map(t=>`
        <a href="${escapeHtml(t.url)}" class="tool-card-item" data-tool="${escapeHtml(t.name.toLowerCase())}" aria-label="${escapeHtml(t.name)} - ${escapeHtml(t.desc)}">
          <div class="tc-icon"><svg class="icon" aria-hidden="true"><use href="#i-${escapeHtml(t.iconName)}"></use></svg></div>
          <div class="tc-name">${escapeHtml(t.name)}</div>
          <div class="tc-desc">${escapeHtml(t.desc)}</div>
          <div class="tc-arrow" aria-hidden="true">Use Tool →</div>
        </a>`).join('');
    }

    window.render1000Tools=render;
    window.setCatalogFilter=function(category,btn){
      window.catalogFilter=category;
      document.querySelectorAll('.filter-tab').forEach(b=>b.classList.remove('active'));
      if(btn) btn.classList.add('active');
      render();
      const tools=document.getElementById('tools');
      if(tools) tools.scrollIntoView({behavior:'smooth'});
    };

    // Hook all existing search fields into the 1000-tool catalog.
    document.querySelectorAll('#searchInput, .search-box input, .mobile-search input').forEach(input=>{
      input.addEventListener('input',()=>{window.catalogSearch=input.value.toLowerCase();render();});
    });

    render();
  }

  fetch(manifestUrl,{cache:'no-cache'})
    .then(response=>{
      if(!response.ok) throw new Error(`Manifest HTTP ${response.status}`);
      return response.json();
    })
    .then(rows=>{
      if(rows.length !== 1000) console.warn(`Daily Toolkit catalog contains ${rows.length} generated tools; expected 1000.`);
      installCatalog(rows);
    })
    .catch(error=>{
      console.error('Daily Toolkit 1000-tool catalog could not load:',error);
      const grid=document.getElementById('toolsGrid');
      if(grid && !grid.children.length){
        const msg=document.createElement('p');
        msg.textContent='Tool catalog is temporarily loading. Please refresh the page.';
        grid.replaceWith(msg);
      }
    });
})();

// Broken/empty link guard
window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('a').forEach(link=>{
    const href=link.getAttribute('href');
    if(!href || href==='undefined') link.setAttribute('aria-disabled','true');
  });
});
