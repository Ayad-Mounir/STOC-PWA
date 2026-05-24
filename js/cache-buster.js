/* ══ CACHE BUSTER v3.0 — يمسح الكاش القديم مرة واحدة عند التحديث ══ */
  (function(){
    var V = "stoc-v3.2";
    if (localStorage.getItem("stoc-build") === V) return; // نفس الإصدار — لا شيء
    localStorage.setItem("stoc-build", V);
    if (!('serviceWorker' in navigator)) { return; }
    // مسح كل SWs + caches ثم إعادة تحميل واحدة
    navigator.serviceWorker.getRegistrations()
      .then(function(regs){
        return Promise.all(regs.map(function(r){ return r.unregister(); }));
      })
      .then(function(){ return caches.keys(); })
      .then(function(keys){
        return Promise.all(keys.map(function(k){ return caches.delete(k); }));
      })
      .then(function(){ window.location.reload(true); })
      .catch(function(){ window.location.reload(true); });
  })();
