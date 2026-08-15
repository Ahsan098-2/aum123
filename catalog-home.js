(function(){
'use strict';
function start(){
  if(document.getElementById('daily-toolkit-1000-catalog')) return;
  var style=document.createElement('style');
  style.textContent='#daily-toolkit-1000-catalog{padding:70px 4%;background:#fff;position:relative;z-index:2}#daily-toolkit-1000-catalog .dt-wrap{max-width:1400px;margin:auto}#daily-toolkit-1000-catalog h2{font-family:Georgia,serif;font-size:clamp(2rem,4vw,3rem);margin:0 0 8px}#daily-toolkit-1000-catalog .dt-sub{color:#6b6b6b;margin:0 0 22px}.dt-tools-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}.dt-tool-card{display:block!important;text-decoration:none!important;color:#111!important;background:#fff;border:1px solid #e5e5e5;border-radius:14px;padding:18px;min-height:145px;box-shadow:0 3px 14px rgba(0,0,0,.05);transition:transform .18s,box-shadow .18s}.dt-tool-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.1)}.dt-tool-icon{font-size:24px;margin-bottom:10px}.dt-tool-name{font-weight:700;font-size:1rem;margin-bottom:6px}.dt-tool-cat{font-size:.78rem;color:#777}.dt-tool-use{margin-top:14px;font-size:.82rem;font-weight:600}.dt-status{padding:20px;border:1px dashed #bbb;border-radius:12px;color:#666}.dt-tools-more{text-align:center;margin-top:25px}.dt-tools-more a{display:inline-block;padding:11px 18px;background:#111;color:#fff!important;border-radius:9px;text-decoration:none!important}';
  document.head.appendChild(style);
  var section=document.createElement('section'); section.id='daily-toolkit-1000-catalog';
  section.innerHTML='<div class="dt-wrap"><h2>All 1,000+ Tools</h2><p class="dt-sub">Every tool is available directly from Daily Toolkit. Search or browse the complete collection.</p><div id="dt-tools-grid" class="dt-tools-grid"><div class="dt-status">Loading tools...</div></div><div class="dt-tools-more"><a href="/tools.html">Open Tools Directory →</a></div></div>';
  var footer=document.querySelector('footer'); if(footer&&footer.parentNode) footer.parentNode.insertBefore(section,footer); else document.body.appendChild(section);
  var grid=section.querySelector('#dt-tools-grid');
  var base=location.pathname.indexOf('/aum123/')>=0?'/aum123/':'/';
  fetch(base+'generated-tools/manifest.json?v=1001',{cache:'no-store'}).then(function(r){if(!r.ok)throw Error('Manifest HTTP '+r.status);return r.json()}).then(function(rows){
    if(!Array.isArray(rows)||!rows.length)throw Error('Empty tool manifest');
    var frag=document.createDocumentFragment();
    rows.forEach(function(t){
      var a=document.createElement('a'); a.className='dt-tool-card'; a.href=base+(t.path||('generated-tools/'+t.id+'.html')); a.setAttribute('aria-label','Open '+(t.title||'Tool'));
      a.innerHTML='<div class="dt-tool-icon">⚡</div><div class="dt-tool-name"></div><div class="dt-tool-cat"></div><div class="dt-tool-use">Use Tool →</div>';
      a.querySelector('.dt-tool-name').textContent=t.title||('Tool '+t.id); a.querySelector('.dt-tool-cat').textContent=(t.category||'Utility')+' · '+(t.operation||'Online'); frag.appendChild(a);
    });
    grid.replaceChildren(frag);
  }).catch(function(err){grid.innerHTML='<div class="dt-status">The tool catalog could not load right now. Please open the <a href="/tools.html">Tools Directory</a>.</div>';console.error('Daily Toolkit catalog:',err)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
