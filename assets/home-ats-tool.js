/* Daily Toolkit — ATS Resume Score Checker home-page quick tool */
(function(){
  'use strict';

  function addATSQuickTool(){
    var quickTools=document.querySelector('.quick-tools');
    if(!quickTools || quickTools.querySelector('[data-home-tool="ats-resume-score-checker"]')) return;

    var ageTool=quickTools.querySelector('a[href*="/tools/age-calculator"]');
    var card=document.createElement('a');
    card.href='/tools/ats-resume-score-checker.html';
    card.className='quick-tool';
    card.setAttribute('data-home-tool','ats-resume-score-checker');
    card.innerHTML='<div class="tool-icon"><svg class="icon" aria-hidden="true"><use href="#i-file"></use></svg></div><div class="tool-name">ATS Resume Score Checker</div><div class="tool-desc">Check resume compatibility</div>';

    if(ageTool && ageTool.parentNode){
      ageTool.parentNode.insertBefore(card, ageTool.nextSibling);
    }else{
      quickTools.prepend(card);
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',addATSQuickTool,{once:true});
  }else{
    addATSQuickTool();
  }
})();
