// AOS (Animate On Scroll) minimal loader for Angular standalone
// https://michalsnik.github.io/aos/
(function(){
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css';
  document.head.appendChild(link);
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js';
  script.onload = function() { if(window.AOS) window.AOS.init({ once: true, duration: 700, offset: 80 }); };
  document.body.appendChild(script);
})();
