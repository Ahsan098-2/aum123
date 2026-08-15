/* Daily Toolkit front-end enhancement loader. */
(function(){
  function load(src){
    var s=document.createElement('script');
    s.src=src;
    s.defer=false;
    document.head.appendChild(s);
  }
  load('/script-optimized.js?v=20260815');
  load('/assets/new-featured-tools.js?v=20260815');
})();