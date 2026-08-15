(function(){'use strict';
const D=document;
window.DailyToolkit={
 money:function(value,currency){return new Intl.NumberFormat(undefined,{style:'currency',currency:currency||'USD',maximumFractionDigits:2}).format(Number(value)||0)},
 number:function(value){return new Intl.NumberFormat(undefined,{maximumFractionDigits:2}).format(Number(value)||0)},
 value:function(id){const e=D.getElementById(id);return e?Number(e.value)||0:0},
 text:function(id){const e=D.getElementById(id);return e?e.value.trim():''},
 set:function(id,value){const e=D.getElementById(id);if(e)e.textContent=value},
 status:function(message,type){const e=D.getElementById('toolStatus');if(e){e.textContent=message;e.className='pt-status '+(type||'')}},
 copy:function(text){if(!text)return Promise.reject(new Error('Nothing to copy'));if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text);const t=D.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';D.body.appendChild(t);t.select();const ok=D.execCommand('copy');t.remove();return ok?Promise.resolve():Promise.reject(new Error('Copy unavailable'))},
 download:function(name,text,type){const b=new Blob([text],{type:type||'text/plain'}),u=URL.createObjectURL(b),a=D.createElement('a');a.href=u;a.download=name;D.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),500)},
 theme:function(){const root=D.documentElement,current=root.getAttribute('data-theme');const next=current==='dark'?'light':'dark';root.setAttribute('data-theme',next);localStorage.setItem('dt-theme',next);const b=D.getElementById('themeButton');if(b)b.textContent=next==='dark'?'☀️':'🌙'},
 reset:function(){D.querySelectorAll('input,textarea,select').forEach(e=>{if(e.dataset.default!==undefined)e.value=e.dataset.default;else if(e.type!=='button')e.value=''});const out=D.getElementById('resultText');if(out)out.textContent='Enter values and run the calculator.';this.status('Form reset. Ready for a new calculation.','')}
};
function boot(){const saved=localStorage.getItem('dt-theme');if(saved)D.documentElement.setAttribute('data-theme',saved);const b=D.getElementById('themeButton');if(b)b.addEventListener('click',()=>DailyToolkit.theme());const r=D.getElementById('resetButton');if(r)r.addEventListener('click',()=>DailyToolkit.reset());const c=D.getElementById('copyButton');if(c)c.addEventListener('click',()=>{const e=D.getElementById('resultText');DailyToolkit.copy(e?e.textContent:'').then(()=>DailyToolkit.status('Result copied to your clipboard.','success')).catch(()=>DailyToolkit.status('Copy is unavailable in this browser.','error'))});const dl=D.getElementById('downloadButton');if(dl)dl.addEventListener('click',()=>{const e=D.getElementById('resultText');DailyToolkit.download('daily-toolkit-result.txt',e?e.textContent:'','text/plain');DailyToolkit.status('Result downloaded.','success')});}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot);else boot();
})();
