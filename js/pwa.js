/* ════════════════════════════════════════════════
   PWA — Service Worker + Install Banner
   ════════════════════════════════════════════════ */

// ── 1. Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then(reg => {
        reg.update();
        setInterval(() => reg.update(), 3600000);
        reg.addEventListener("updatefound", () => {
          const newSW = reg.installing;
          if (!newSW) return;
          newSW.addEventListener("statechange", () => {
            if (newSW.state === "installed") { newSW.postMessage({ type: "SKIP_WAITING" }); }
            if (newSW.state === "installed" && navigator.serviceWorker.controller) {
              newSW.postMessage({ action: "skipWaiting" });
            }
          });
        });
      })
      .catch(e => console.warn("SW error", e));

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  });
}

// ── 2. Install Banner Logic
(function() {
  let deferredPrompt = null;

  // هل التطبيق مثبّت مسبقاً؟
  const isInstalled = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  // iOS detection
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  // Android detection
  const isAndroid = () => /android/i.test(navigator.userAgent);

  if (isInstalled()) return; // مثبّت بالفعل — لا شيء

  // ── بناء البانر
  const banner = document.createElement("div");
  banner.id = "pwa-banner";
  banner.dir = "rtl";
  banner.style.cssText = `
    position:fixed; bottom:0; left:0; right:0; z-index:99999;
    background:linear-gradient(135deg,#0c2818,#052e16);
    border-top:2px solid #15803d;
    padding:14px 16px 18px;
    font-family:Cairo,sans-serif;
    display:none;
    animation:slideUp 0.4s ease;
  `;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideUp {
      from { transform:translateY(100%); opacity:0; }
      to   { transform:translateY(0);   opacity:1; }
    }
    #pwa-banner button {
      font-family:Cairo,sans-serif;
      font-weight:700;
      border:none;
      border-radius:8px;
      cursor:pointer;
      transition:opacity 0.2s;
    }
    #pwa-banner button:active { opacity:0.8; }
  `;
  document.head.appendChild(style);

  function buildAndroidBanner() {
    banner.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <img src="./icon-192.png" style="width:40px;height:40px;border-radius:10px;flex-shrink:0;" onerror="this.style.display='none'"/>
        <div>
          <div style="color:#3fb950;font-size:13px;font-weight:800;">📲 ثبّت التطبيق</div>
          <div style="color:#8b949e;font-size:11px;margin-top:2px;">للوصول السريع بدون متصفح</div>
        </div>
        <button id="pwa-close" style="margin-right:auto;background:transparent;color:#6b7280;font-size:18px;padding:4px 8px;">✕</button>
      </div>
      <div style="display:flex;gap:8px;">
        <button id="pwa-install" style="flex:1;padding:11px;background:linear-gradient(135deg,#15803d,#16a34a);color:#fff;font-size:13px;">
          ⬇️ تثبيت الآن
        </button>
        <button id="pwa-later" style="padding:11px 14px;background:#21262d;color:#8b949e;font-size:12px;">
          لاحقاً
        </button>
      </div>
    `;
    banner.querySelector("#pwa-install").onclick = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(c => {
          if (c.outcome === "accepted") banner.style.display = "none";
          deferredPrompt = null;
        });
      }
    };
    banner.querySelector("#pwa-close").onclick = () => banner.style.display = "none";
    banner.querySelector("#pwa-later").onclick  = () => banner.style.display = "none";
  }

  function buildIOSBanner() {
    banner.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <img src="./icon-192.png" style="width:40px;height:40px;border-radius:10px;flex-shrink:0;" onerror="this.style.display='none'"/>
        <div style="flex:1;">
          <div style="color:#3fb950;font-size:13px;font-weight:800;">📲 ثبّت التطبيق على iOS</div>
          <div style="color:#8b949e;font-size:11px;margin-top:2px;">اتبع الخطوات أدناه</div>
        </div>
        <button id="pwa-close" style="background:transparent;color:#6b7280;font-size:18px;padding:4px 8px;border:none;">✕</button>
      </div>
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
        <div style="background:#0d2618;border:1px solid #15803d;border-radius:8px;padding:8px 10px;display:flex;align-items:center;gap:6px;">
          <span style="font-size:18px;">1️⃣</span>
          <span style="color:#e6edf3;font-size:11px;">اضغط زر <strong>المشاركة</strong> <span style="font-size:14px;">⬆️</span></span>
        </div>
        <div style="background:#0d2618;border:1px solid #15803d;border-radius:8px;padding:8px 10px;display:flex;align-items:center;gap:6px;">
          <span style="font-size:18px;">2️⃣</span>
          <span style="color:#e6edf3;font-size:11px;">اختر <strong>"أضف للشاشة الرئيسية"</strong></span>
        </div>
        <div style="background:#0d2618;border:1px solid #15803d;border-radius:8px;padding:8px 10px;display:flex;align-items:center;gap:6px;">
          <span style="font-size:18px;">3️⃣</span>
          <span style="color:#e6edf3;font-size:11px;">اضغط <strong>"إضافة"</strong></span>
        </div>
      </div>
      <div style="margin-top:8px;color:#6b7280;font-size:10px;text-align:center;">
        ⚠️ يشتغل فقط من Safari — إذا فتحت من Chrome، افتح الرابط في Safari أولاً
      </div>
    `;
    banner.querySelector("#pwa-close").onclick = () => banner.style.display = "none";
  }

  function showBanner() {
    if (isInstalled()) return;
    if (isIOS()) {
      buildIOSBanner();
    } else {
      buildAndroidBanner();
    }
    document.body.appendChild(banner);
    banner.style.display = "block";
  }

  // Android: انتظر حدث beforeinstallprompt
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferredPrompt = e;
    // اعرض البانر بعد 2 ثانية من تحميل الصفحة
    setTimeout(showBanner, 2000);
  });

  // iOS: اعرض البانر بعد 3 ثواني إذا كانت Safari
  if (isIOS()) {
    setTimeout(showBanner, 3000);
  }

  // إذا لم يظهر beforeinstallprompt بعد 5 ثواني على Android — اعرض تعليمات يدوية
  if (isAndroid()) {
    setTimeout(() => {
      if (!deferredPrompt && !isInstalled()) {
        // HTTPS غير مفعّل أو المتصفح لا يدعم — اعرض تعليمات يدوية
        banner.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <img src="./icon-192.png" style="width:36px;height:36px;border-radius:8px;flex-shrink:0;" onerror="this.style.display='none'"/>
            <div style="flex:1;">
              <div style="color:#3fb950;font-size:12px;font-weight:800;">📲 أضف التطبيق للشاشة الرئيسية</div>
            </div>
            <button id="pwa-close2" style="background:transparent;color:#6b7280;font-size:18px;padding:4px 8px;border:none;">✕</button>
          </div>
          <div style="display:flex;gap:5px;flex-wrap:wrap;font-size:11px;color:#e6edf3;">
            <div style="background:#0d2618;border:1px solid #15803d;border-radius:7px;padding:7px 9px;">
              <strong>Chrome:</strong> القائمة ⋮ → "أضف إلى الشاشة الرئيسية"
            </div>
            <div style="background:#0d2618;border:1px solid #15803d;border-radius:7px;padding:7px 9px;">
              <strong>Samsung:</strong> القائمة ≡ → "إضافة صفحة إلى"
            </div>
          </div>
        `;
        document.body.appendChild(banner);
        banner.style.display = "block";
        const closeBtn = document.getElementById("pwa-close2");
        if (closeBtn) closeBtn.onclick = () => banner.style.display = "none";
      }
    }, 5000);
  }

})();
