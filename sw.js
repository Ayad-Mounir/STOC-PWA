/* ════════════════════════════════════════════════════════
   sw.js — Service Worker لـ مدير المخزون PWA
   الإصدار: 3.0.0 — المكتبات منفصلة في مجلد libs/
   ════════════════════════════════════════════════════════ */

// [M2.4] رُفِّعت الإصدارات بعد إصلاح M1+M2
// → يُجبر جميع العملاء على تحميل الكود الجديد تلقائياً
const CACHE_NAME    = "stock-manager-v12"; // [AUTO-REFRESH]
const RUNTIME_CACHE = "stock-runtime-v10";

/* ── الأصول المُخزَّنة فور التثبيت (App Shell) ── */
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  /* المكتبات — تُخزَّن offline */
  "./libs/qrcode.min.js",
  "./libs/jsqr.min.js",
  "./libs/react.min.js",
  "./libs/react-dom.min.js",
  "./libs/html2canvas.min.js",
  "./libs/jspdf.min.js",
  "./libs/supabase.min.js",
  /* CSS */
  "./css/base.css",
  "./css/reports.css",
  "./css/components.css",
  /* JS core */
  "./js/loader.js",
  "./js/cache-buster.js",
  "./js/i18n.js",
  "./js/error-handler.js",
  "./js/sync.js",
  "./js/auth.js",
  "./js/config.js",
  "./js/db.js",
  "./js/ui.js",
  "./js/pdf.js",
  "./js/qr.js",
  "./js/pwa.js",
  /* JS page components (Phase 6) */
  "./js/pages/dashboard.js",
  "./js/pages/inventory.js",
  "./js/pages/settings.js",
  "./js/pages/orders.js",
  "./js/pages/reports.js",
  "./js/pages/app.js",
];

/* ══ INSTALL ══════════════════════════════════════════════ */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

/* ══ ACTIVATE — مسح الكاشات القديمة ════════════════════ */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME && k !== RUNTIME_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* ══ FETCH — Cache-First للأصول المحلية ════════════════ */
self.addEventListener("fetch", event => {
  const url = event.request.url;
  if (url.includes("supabase.co") || url.includes("googleapis.com")) {
    return;
  }

  // تجاهل query parameters عند البحث في الكاش (يحل مشكلة ?source=pwa وغيرها)
  const cleanRequest = new Request(url.split("?")[0], event.request);

  event.respondWith(
    caches.match(cleanRequest).then(cached => {
      if (cached) return cached;
      // جرب أيضاً بالرابط الأصلي
      return caches.match(event.request).then(cached2 => {
        if (cached2) return cached2;
        return fetch(event.request).then(response => {
          if (response && response.status === 200 && response.type === "basic") {
            const clone = response.clone();
            caches.open(RUNTIME_CACHE).then(c => c.put(cleanRequest, clone));
          }
          return response;
        }).catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
          return caches.match("./index.html");
        });
      });
    })
  );
});

/* ══ MESSAGE ════════════════════════════════════════════ */
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
