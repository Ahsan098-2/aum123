// Daily Toolkit homepage behavior + 1000-tool catalog
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    const openButtons = document.querySelectorAll('.open-tool-btn');
    const backdrop = document.getElementById('toolModalBackdrop');
    const content = document.getElementById('toolModalContent');
    const closeBtn = document.getElementById('closeToolModal');

    if (backdrop && content) {
      openButtons.forEach(btn => btn.addEventListener('click', () => {
        const toolId = btn.getAttribute('data-tool');
        const fullTool = document.getElementById(`tool-full-${toolId}`);
        if (fullTool) {
          content.innerHTML = fullTool.innerHTML;
          backdrop.style.display = 'flex';
        }
      }));
      if (closeBtn) closeBtn.addEventListener('click', () => {
        backdrop.style.display = 'none';
        content.innerHTML = '';
      });
      backdrop.addEventListener('click', e => {
        if (e.target === backdrop) {
          backdrop.style.display = 'none';
          content.innerHTML = '';
        }
      });
    }

    load1000Tools();
  });

  async function load1000Tools() {
    const grid = document.getElementById('toolsGrid');
    if (!grid) return;

    // Prevent the homepage reveal animation from keeping dynamically inserted cards invisible.
    grid.classList.remove('reveal');
    grid.classList.add('visible');
    grid.style.opacity = '1';
    grid.style.transform = 'none';

    const candidates = [
      '/generated-tools/manifest.json',
      './generated-tools/manifest.json',
      'generated-tools/manifest.json'
    ];

    let rows = null;
    let lastError = '';
    for (const url of candidates) {
      try {
        const response = await fetch(url + (url.includes('?') ? '&' : '?') + 'v=20260815', { cache: 'no-store' });
        if (!response.ok) {
          lastError = `HTTP ${response.status}`;
          continue;
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length) {
          rows = data;
          break;
        }
        lastError = 'Manifest is empty or invalid';
      } catch (error) {
        lastError = error.message || 'Network error';
      }
    }

    if (!Array.isArray(rows) || !rows.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;padding:2rem;text-align:center;color:#6B6B6B"><strong>Tool catalog could not load.</strong><br><small>${lastError || 'Unknown error'}</small><br><a href="/tools.html" style="text-decoration:underline">Open All Tools</a></div>`;
      return;
    }

    window.allTools = rows.map((r, i) => ({
      id: r.id || i + 1,
      name: r.title || `Tool ${i + 1}`,
      desc: `${r.operation || 'Online'} tool for ${r.category || 'Daily Toolkit'}`,
      category: r.category || 'Other',
      cat: String(r.category || 'Other').toLowerCase(),
      url: r.path || r.url
    }));

    const escape = value => String(value ?? '').replace(/[&<>\"']/g, c => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#39;'
    }[c]));

    function renderTools(filter = 'all', query = '') {
      const q = String(query).trim().toLowerCase();
      const filtered = window.allTools.filter(t => {
        const catOK = filter === 'all' || t.cat === filter;
        const text = `${t.name} ${t.desc} ${t.category}`.toLowerCase();
        return catOK && (!q || text.includes(q));
      });

      const noResult = document.getElementById('noSearchResult');
      if (noResult) noResult.style.display = filtered.length ? 'none' : 'block';

      grid.innerHTML = filtered.map(t => `
        <a class="tool-card-item" href="${escape(t.url)}" title="${escape(t.name)}" aria-label="Open ${escape(t.name)}">
          <div class="tc-icon" aria-hidden="true">⚡</div>
          <div class="tc-name">${escape(t.name)}</div>
          <div class="tc-desc">${escape(t.desc)}</div>
          <div class="tc-arrow">Use Tool →</div>
        </a>
      `).join('');

      // Explicitly keep the dynamically-created grid visible.
      grid.style.display = 'grid';
      grid.style.visibility = 'visible';
      grid.style.opacity = '1';
      grid.style.transform = 'none';
    }

    window.render1000Tools = renderTools;
    window.catalogFilter = 'all';
    window.catalogSearch = '';

    const tabs = document.querySelector('.filter-tabs');
    if (tabs) {
      const categories = [...new Set(window.allTools.map(t => t.category))];
      tabs.innerHTML = '';

      const addTab = (label, value, active) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `filter-tab${active ? ' active' : ''}`;
        button.textContent = label;
        button.addEventListener('click', () => {
          window.catalogFilter = value;
          tabs.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
          button.classList.add('active');
          renderTools(window.catalogFilter, window.catalogSearch);
        });
        tabs.appendChild(button);
      };

      addTab(`All Tools (${window.allTools.length})`, 'all', true);
      categories.forEach(category => addTab(category, category.toLowerCase(), false));
    }

    document.querySelectorAll('#searchInput, .nav-search input, .mobile-search input, input[type="search"]').forEach(input => {
      input.addEventListener('input', () => {
        window.catalogSearch = input.value;
        renderTools(window.catalogFilter, window.catalogSearch);
      });
    });

    document.querySelectorAll('.stat-number').forEach(el => {
      if (/tool/i.test(el.parentElement?.textContent || '') || /\+?\s*tools?/i.test(el.textContent)) el.textContent = `${window.allTools.length}+`;
    });

    renderTools('all', '');
  }
})();
