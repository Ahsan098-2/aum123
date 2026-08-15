/* Daily Toolkit front-end enhancement loader. The homepage owns its main tool catalog; this file loads the optimized interaction layer and the premium-tool catalog extension. */
(function(){
  function load(src){var s=document.createElement('script');s.src=src;s.defer=false;document.head.appendChild(s)}
  load('/script-optimized.js');
  load('/assets/new-featured-tools.js');
})();