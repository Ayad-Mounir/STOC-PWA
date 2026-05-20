/* ══ STOC FAST LOADER ══
     - React + ReactDOM + Babel تُحمَّل معاً بشكل متوازٍ
     - html2canvas + jsPDF + Supabase تُحمَّل متوازية بعد Babel
     - Babel.transformScriptTags() يُستدعى يدوياً (ضروري عند التحميل الديناميكي)
     - التشغيل الثاني: كل شيء من SW cache = فوري
  ══ */
  (function(){
    /* ══ كل المكتبات inline و JSX محوّل مسبقاً ══ */
    function hideLoader() {
      var el = document.getElementById("stoc-splash");
      if (!el || el._hidden) return;
      el._hidden = true;
      var f = document.getElementById("stoc-bar-fill");
      var t = document.getElementById("stoc-bar-pct");
      var m = document.getElementById("stoc-msg");
      if (f) f.style.width = "100%";
      if (t) t.textContent = "100%";
      if (m) m.textContent = "✅ جاهز";
      el.style.transition = "opacity 0.4s";
      el.style.opacity = "0";
      setTimeout(function(){ el.style.display = "none"; }, 420);
    }
    window.__STOC_HIDE_LOADER__ = hideLoader;
    /* تنظيف كاش SW القديم */
    if ('serviceWorker' in navigator) {
      caches.keys().then(function(keys) {
        keys.forEach(function(k) {
          if (k !== 'stock-manager-v6' && k !== 'stock-runtime-v4') caches.delete(k);
        });
      }).catch(function(){});
    }
    window.addEventListener("DOMContentLoaded", function(){
      var m = document.getElementById("stoc-msg");
      if (m) m.textContent = "✅ جاهز";
      var f = document.getElementById("stoc-bar-fill");
      if (f) f.style.width = "100%";
    });
  })();
