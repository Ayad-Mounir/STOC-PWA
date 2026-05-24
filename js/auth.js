/* ══ STOC LICENSE SYSTEM ══
   المفتاح السري: Mounir2026
   يتحقق من QR التفعيل ويحفظ بيانات الشركة
   + تحقق أونلاين عبر Supabase
══ */
(function(){
  const LIC_KEY    = "stoc-license-v1";
  const SECRET     = "Mounir2026";
  const SB_CFG_KEY = "stk-supabase-cfg-v1";
  const FACTORY_KEY= "stk-factory-v1";

  // ── بيانات stoc-admin للتحقق من التراخيص ──
  const ADMIN_SB_URL = "https://pcjbkickwdpouphkygeq.supabase.co";
  const ADMIN_SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjamJraWNrd2Rwb3VwaGt5Z2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTYyNTYsImV4cCI6MjA5NDU5MjI1Nn0.VXuWBvg4YvbWO1FWWqjoKkUevU6Gg-zparnpIrjsvRk";

  // ── التحقق من حالة الترخيص في Supabase ──
  async function checkOnlineLicense(code) {
    try {
      const res = await fetch(
        `${ADMIN_SB_URL}/rest/v1/stoc_licenses?code=eq.${encodeURIComponent(code)}&select=frozen,expires`,
        { headers: { "apikey": ADMIN_SB_KEY, "Authorization": "Bearer " + ADMIN_SB_KEY } }
      );
      if (!res.ok) return { ok: true }; // فشل الاتصال → نسمح (offline-friendly)
      const rows = await res.json();
      if (!rows || !rows.length) return { ok: false, reason: "الترخيص غير موجود في السيرفر" };
      const row = rows[0];
      if (row.frozen) return { ok: false, frozen: true, reason: "تم تجميد هذا الترخيص من المدير" };
      if (row.expires && new Date(row.expires) < new Date()) return { ok: false, reason: "انتهت صلاحية هذا الترخيص" };
      return { ok: true };
    } catch(e) {
      return { ok: true }; // خطأ شبكة → نسمح
    }
  }
  async function verify(payload) {
    const { sig, ...data } = payload;
    const msg = JSON.stringify(data) + SECRET;
    const buf = await crypto.subtle.digest("SHA-256",
      new TextEncoder().encode(msg));
    const computed = Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2,"0"))
      .join("").slice(0,32);
    return computed === sig;
  }

  // ── قراءة الترخيص المحفوظ ──
  function getLicense() {
    try { return JSON.parse(localStorage.getItem(LIC_KEY)); }
    catch { return null; }
  }

  // ── حفظ الترخيص ──
  function saveLicense(lic) {
    // [M3.4] حفظ تاريخ التفعيل إن لم يكن موجوداً في الـ payload
    if (!lic.activatedAt) {
      lic.activatedAt = new Date().toISOString();
    }
    localStorage.setItem(LIC_KEY, JSON.stringify(lic));
  }

  // ── تطبيق بيانات الشركة على التطبيق ──
  function applyLicense(lic) {
    // حفظ Supabase config
    try {
      localStorage.setItem(SB_CFG_KEY, JSON.stringify({
        url: lic.url, key: lic.key
      }));
    } catch(e) {}

    // حفظ Google Client ID في Drive config إن وُجد في الترخيص
    if (lic.clientId) {
      try {
        const DRIVE_CFG_KEY = "stk-drive-cfg-v1";
        const driveCfg = JSON.parse(localStorage.getItem(DRIVE_CFG_KEY) || "{}");
        driveCfg.clientId = lic.clientId;
        localStorage.setItem(DRIVE_CFG_KEY, JSON.stringify(driveCfg));
      } catch(e) {}
    }

    // حفظ Gemini API Key إن وُجد في الترخيص
    if (lic.geminiKey) {
      try {
        const AI_KEYS_KEY = "stk-gemini-keys-v1";
        const AI_IDX_KEY  = "stk-gemini-idx-v1";
        // أضف المفتاح كأول مفتاح مع الاحتفاظ بالمفاتيح الإضافية التي أدخلها المستخدم
        var existingKeys = JSON.parse(localStorage.getItem(AI_KEYS_KEY) || "[]");
        // استبدل المفتاح الأول (مفتاح الأدمن) واحتفظ بالباقي
        existingKeys[0] = lic.geminiKey;
        localStorage.setItem(AI_KEYS_KEY, JSON.stringify(existingKeys));
        localStorage.setItem("stk-ai-v1", lic.geminiKey); // توافق مع الكود القديم
        localStorage.setItem(AI_IDX_KEY, "0");
        if (window.__stkGeminiKeys) window.__stkGeminiKeys = existingKeys;
      } catch(e) {}
    }

    // حفظ اسم الشركة في factory settings
    try {
      let factory = JSON.parse(localStorage.getItem(FACTORY_KEY) || "null") || {};
      factory.company_name = lic.company;
      factory.factory_name = lic.company;
      if (lic.logo) factory.company_logo = lic.logo;
      localStorage.setItem(FACTORY_KEY, JSON.stringify(factory));
      // حفظ اسم الشركة في Supabase باش ما يتمساحش بالـ sync
      try { var _sb=getClient(); if(_sb) _sb.from("stk_config").upsert([{id:1,company_name:lic.company,company_logo:lic.logo||"",updated_at:Date.now()}]).then(function(){}).catch(function(){}); } catch(e) {}
    } catch(e) {}

    // تحديث عنوان الصفحة
    document.title = lic.company + " — STOC";
    // تحديث React state مباشرة إذا كان التطبيق مفتوح (إصلاح اسم الشركة بعد أول تفعيل)
    if (typeof window.__stkUpdateCompanyName === "function") {
      window.__stkUpdateCompanyName(lic.company, lic.logo || "");
    }
  }

  // ── التحقق من الانتهاء ──
  function isExpired(lic) {
    if (!lic.expires) return false;
    return new Date(lic.expires) < new Date();
  }


  // ══════════════════════════════════════════════════════════════
  // [AUTO-REFRESH] تحديث الترخيص تلقائياً من السيرفر عند كل sync
  // ══════════════════════════════════════════════════════════════
  const REFRESH_INTERVAL_MS = 60 * 60 * 1000; // مرة كل ساعة كحد أقصى
  var _lastRefreshAt = 0;

  async function refreshLicenseFromServer() {
    // throttle: لا نفحص أكثر من مرة في الساعة
    var now = Date.now();
    if (now - _lastRefreshAt < REFRESH_INTERVAL_MS) return;

    var lic = getLicense();
    if (!lic || !lic.code) return;

    try {
      // نجلب expires + frozen + sig من admin Supabase
      var res = await fetch(
        ADMIN_SB_URL + "/rest/v1/stoc_licenses?code=eq." +
          encodeURIComponent(lic.code) +
          "&select=expires,frozen,devices,sig",
        {
          headers: {
            "apikey":        ADMIN_SB_KEY,
            "Authorization": "Bearer " + ADMIN_SB_KEY
          }
        }
      );
      if (!res.ok) return; // فشل الشبكة → لا نمس الترخيص المحلي

      var rows = await res.json();
      if (!rows || !rows.length) return;
      var row = rows[0];

      _lastRefreshAt = now;

      // ── تجميد ──
      if (row.frozen) {
        console.log("[License] 🔒 الترخيص مجمَّد من Admin → إيقاف التطبيق");
        showFrozenScreen("تم تجميد هذا الحساب من المدير.");
        return;
      }

      // ── تاريخ الانتهاء تغيَّر ──
      var serverExpires = row.expires || null;
      var localExpires  = lic.expires  || null;

      if (serverExpires !== localExpires) {
        console.log("[License] 🔄 تاريخ الانتهاء تغيَّر:",
          localExpires, "→", serverExpires);

        // تحديث الترخيص المحلي
        lic.expires = serverExpires;
        // نعيد حساب التفعيل (ليس انتهاء صلاحية الآن)
        saveLicense(lic);

        // إعلام قسم الإعدادات بالتغيير
        window.dispatchEvent(new CustomEvent("stoc-license-updated", {
          detail: { expires: serverExpires }
        }));

        // تنبيه المستخدم (فقط إذا كان التطبيق مفتوحاً)
        console.log("[License] ✅ تم تحديث تاريخ الانتهاء تلقائياً إلى:", serverExpires || "دائم");
      }

      // ── انتهاء الصلاحية ──
      if (serverExpires && new Date(serverExpires) < new Date()) {
        console.log("[License] ⛔ الترخيص منتهي");
        showFrozenScreen("انتهت صلاحية هذا الترخيص. تواصل مع المدير للتجديد.");
      }

    } catch(e) {
      // أي خطأ → نتجاهل ونكمل (offline-friendly)
      console.warn("[License] refreshLicenseFromServer خطأ:", e.message);
    }
  }

  // واجهة عامة يستدعيها sync.js عند كل مزامنة
  window.__stkRefreshLicense = refreshLicenseFromServer;

  // ── واجهة مسح QR ──
function showFrozenScreen(reason){if(typeof window.__STOC_HIDE_LOADER__==="function")window.__STOC_HIDE_LOADER__();var ex=document.getElementById("stoc-frozen-screen");if(ex)ex.remove();var el=document.createElement("div");el.id="stoc-frozen-screen";el.style.cssText="position:fixed;inset:0;background:#0d1117;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99999;font-family:Cairo,sans-serif;padding:32px;text-align:center;";el.innerHTML='<div style="font-size:56px;margin-bottom:16px">🔒</div>'+'<div style="color:#f85149;font-size:20px;font-weight:800;margin-bottom:10px">الحساب موقوف مؤقتاً</div>'+'<div style="color:#8b949e;font-size:13px;line-height:1.7;max-width:280px">'+(reason||"تم تجميد هذا الحساب من المدير. سيتم التحقق تلقائياً.")+"</div>"+'<div id="stoc-frozen-cd" style="color:#3fb950;font-size:12px;margin-top:18px"></div>';document.body.appendChild(el);var cnt=15,tries=0;var tm=setInterval(function(){cnt--;var cd=document.getElementById("stoc-frozen-cd");if(cd)cd.textContent="إعادة المحاولة خلال "+cnt+" ثانية…";if(cnt<=0){cnt=Math.min(15+tries*5,60);tries++;if(cd)cd.textContent="جارٍ التحقق…";if(typeof window.__stkCheckLicense==="function"){window.__stkCheckLicense().then(function(ok){if(ok){clearInterval(tm);var sc=document.getElementById("stoc-frozen-screen");if(sc)sc.remove();}}).catch(function(){});}}},1000);}
  function showActivationScreen(initialMessage) {
    // إخفاء loader
    const splash = document.getElementById("stoc-splash");
    if (splash) splash.style.display = "none";

    const screen = document.createElement("div");
    screen.id = "stoc-activation";
    screen.innerHTML = `
      <style>
        #stoc-activation {
          position:fixed;inset:0;z-index:99998;
          background:#07090f;
          display:flex;align-items:center;justify-content:center;
          flex-direction:column;font-family:'Cairo',sans-serif;direction:rtl;
          padding:24px;overflow-y:auto;
        }
        .act-logo{font-size:52px;margin-bottom:12px;}
        .act-title{font-size:20px;font-weight:800;color:#e2e8f0;margin-bottom:4px;}
        .act-sub{font-size:12px;color:#64748b;margin-bottom:20px;text-align:center;}

        /* ── تبويبات الطريقة ── */
        .act-tabs{
          display:flex;gap:8px;margin-bottom:20px;
          background:#0f1420;border:1px solid #1e2535;
          border-radius:12px;padding:4px;
        }
        .act-tab{
          flex:1;padding:9px 18px;border:none;border-radius:9px;
          font-family:'Cairo',sans-serif;font-size:13px;font-weight:700;
          cursor:pointer;transition:all 0.2s;color:#64748b;background:transparent;
        }
        .act-tab.active{
          background:linear-gradient(135deg,#b45309,#f59e0b);
          color:#000;
        }

        /* ── لوح مسح QR ── */
        #act-panel-qr{display:flex;flex-direction:column;align-items:center;}
        .act-cam-wrap{
          width:260px;height:260px;border-radius:16px;overflow:hidden;
          border:2px solid #f59e0b;position:relative;background:#000;
          margin-bottom:14px;
        }
        #act-video{width:100%;height:100%;object-fit:cover;}
        .act-scan-line{
          position:absolute;top:0;left:0;right:0;height:3px;
          background:linear-gradient(90deg,transparent,#f59e0b,transparent);
          animation:actscan 2s linear infinite;
        }
        @keyframes actscan{0%{top:0}100%{top:100%}}
        .act-corners::before,.act-corners::after{
          content:'';position:absolute;width:24px;height:24px;border-color:#f59e0b;border-style:solid;
        }
        .act-corners::before{top:8px;right:8px;border-width:3px 3px 0 0;border-radius:0 4px 0 0;}
        .act-corners::after{bottom:8px;left:8px;border-width:0 0 3px 3px;border-radius:0 0 0 4px;}

        /* ── لوح إدخال الرابط ── */
        #act-panel-url{
          display:none;flex-direction:column;align-items:center;
          width:100%;max-width:380px;
        }
        .act-url-icon{font-size:56px;margin-bottom:12px;}
        .act-url-hint{
          font-size:11px;color:#475569;text-align:center;
          margin-bottom:16px;line-height:1.7;
        }
        #act-url-input{
          width:100%;background:#0f1420;border:1px solid #1e2535;
          border-radius:12px;color:#f59e0b;font-family:monospace;
          font-size:11px;padding:12px 14px;outline:none;direction:ltr;
          text-align:left;resize:none;min-height:80px;transition:border-color 0.2s;
        }
        #act-url-input:focus{border-color:#f59e0b;}
        #act-url-input.err{border-color:#ef4444;}
        #act-url-submit{
          width:100%;margin-top:12px;
          background:linear-gradient(135deg,#b45309,#f59e0b);
          color:#000;border:none;border-radius:12px;
          font-family:'Cairo',sans-serif;font-size:15px;font-weight:800;
          padding:14px;cursor:pointer;
        }

        /* ── رسالة الحالة المشتركة ── */
        .act-msg{font-size:12px;color:#64748b;min-height:20px;margin-bottom:14px;text-align:center;}
        .act-msg.err{color:#ef4444;}
        .act-msg.ok{color:#10b981;}

        /* ── أزرار QR ── */
        #act-start{
          background:linear-gradient(135deg,#b45309,#f59e0b);
          color:#000;border:none;border-radius:12px;
          font-family:'Cairo',sans-serif;font-size:15px;font-weight:800;
          padding:14px 36px;cursor:pointer;
        }
        #act-stop{
          background:transparent;border:1px solid #1e2535;color:#64748b;
          border-radius:12px;font-family:'Cairo',sans-serif;font-size:13px;
          font-weight:700;padding:10px 24px;cursor:pointer;margin-top:10px;display:none;
        }
      </style>

      <div class="act-logo">🔐</div>
      <div class="act-title">تفعيل التطبيق</div>
      <div class="act-sub">اختر طريقة التفعيل</div>

      <!-- تبويبات -->
      <div class="act-tabs">
        <button class="act-tab active" id="act-tab-qr"   onclick="window.__actSwitchTab('qr')">📷 مسح كيوار</button>
        <button class="act-tab"        id="act-tab-url"  onclick="window.__actSwitchTab('url')">🔗 إدخال الرابط</button>
      </div>

      <!-- لوح QR -->
      <div id="act-panel-qr">
        <div class="act-cam-wrap">
          <video id="act-video" playsinline muted autoplay></video>
          <div class="act-scan-line"></div>
          <div class="act-corners"></div>
        </div>
        <div class="act-msg" id="act-msg">اضغط لبدء المسح</div>
        <button id="act-start" onclick="window.__actStart()">📷 بدء المسح</button>
        <button id="act-stop"  onclick="window.__actStop()">إيقاف</button>
      </div>

      <!-- لوح الرابط النصي -->
      <div id="act-panel-url" style="display:none;flex-direction:column;align-items:center;width:100%;max-width:380px;">
        <div class="act-url-icon">🔗</div>
        <div class="act-url-hint">
          الصق رابط التفعيل الذي أرسله لك المدير<br/>
          <span style="color:#f59e0b;">https://…/?lic=eyJ…</span>
        </div>
        <textarea id="act-url-input" placeholder="الصق الرابط هنا…"></textarea>
        <div class="act-msg" id="act-url-msg"></div>
        <button id="act-url-submit" onclick="window.__actSubmitURL()">✅ تفعيل</button>
      </div>
    `;
    document.body.appendChild(screen);

    let stream = null, rafId = null;
    let activeTab = "qr";

    const video  = document.getElementById("act-video");
    const msg    = document.getElementById("act-msg");
    const urlMsg = document.getElementById("act-url-msg");

    // إظهار سبب الرفض إن وُجد
    if (initialMessage) {
      msg.className = "act-msg err";
      msg.textContent = "🔒 " + initialMessage;
    }

    // ── تبديل التبويبات ──
    window.__actSwitchTab = function(tab) {
      activeTab = tab;
      window.__actStop();
      document.getElementById("act-tab-qr").classList.toggle("active",  tab === "qr");
      document.getElementById("act-tab-url").classList.toggle("active", tab === "url");
      document.getElementById("act-panel-qr").style.display  = tab === "qr"  ? "flex" : "none";
      document.getElementById("act-panel-url").style.display = tab === "url" ? "flex" : "none";
      if (tab === "url") {
        setTimeout(() => document.getElementById("act-url-input").focus(), 100);
      }
    };

    // ── استخلاص payload من أي صيغة ──
    function extractPayload(raw) {
      raw = raw.trim();
      // حالة 1: رابط كامل يحتوي ?lic=
      if (raw.includes("?lic=") || raw.includes("&lic=")) {
        try {
          const u = new URL(raw.startsWith("http") ? raw : "https://x.x/" + raw);
          const licParam = u.searchParams.get("lic");
          if (licParam) {
            const json = decodeURIComponent(escape(atob(licParam)));
            return JSON.parse(json);
          }
        } catch(e) {}
      }
      // حالة 2: base64 مباشر
      try {
        const json = decodeURIComponent(escape(atob(raw)));
        const parsed = JSON.parse(json);
        if (parsed && parsed.sig) return parsed;
      } catch(e) {}
      // حالة 3: JSON مباشر (QR قديم)
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.sig) return parsed;
      } catch(e) {}
      return null;
    }

    // ── معالجة مشتركة للـ payload ──
    async function processPayload(payload, setMsg) {
      if (!payload || !payload.sig || !payload.company || !payload.url || !payload.key) {
        throw new Error("الرابط غير صالح أو ناقص");
      }
      const ok = await verify(payload);
      if (!ok) throw new Error("توقيع غير صحيح — الرابط غير معتمد");
      if (isExpired(payload)) throw new Error("انتهت صلاحية هذا الترخيص");

      if (navigator.onLine) {
        setMsg("جارٍ التحقق من السيرفر…", "");
        const onlineCheck = await checkOnlineLicense(payload.code);
        if (!onlineCheck.ok) throw new Error(onlineCheck.reason);
      }

      setMsg("✅ تم التحقق — جارٍ تفعيل " + payload.company, "ok");
      saveLicense(payload);
      applyLicense(payload);

      setTimeout(() => {
        screen.style.transition = "opacity 0.4s";
        screen.style.opacity = "0";
        setTimeout(() => { screen.remove(); window.__stkShowLoader && window.__stkShowLoader(); }, 450);
      }, 1200);
    }

    // ── مسح QR بالكاميرا ──
    window.__actStart = async function() {
      document.getElementById("act-start").style.display = "none";
      document.getElementById("act-stop").style.display = "inline-block";
      msg.className = "act-msg";
      msg.textContent = "جارٍ فتح الكاميرا…";
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        video.srcObject = stream;
        await video.play();
        if (window.__JSQR_FAILED__) {
          msg.textContent = "⚠️ مسح QR غير متاح — استخدم خيار 'إدخال الرابط' بدلاً منه";
          return;
        }
        msg.textContent = "وجّه الكاميرا نحو QR التفعيل…";
        scan();
      } catch(e) {
        msg.className = "act-msg err";
        msg.textContent = "❌ تعذّر فتح الكاميرا: " + e.message;
        document.getElementById("act-start").style.display = "inline-block";
        document.getElementById("act-stop").style.display = "none";
      }
    };

    window.__actStop = function() {
      if (rafId) cancelAnimationFrame(rafId);
      if (stream) stream.getTracks().forEach(t => t.stop());
      stream = null; rafId = null;
      const startBtn = document.getElementById("act-start");
      const stopBtn  = document.getElementById("act-stop");
      if (startBtn) startBtn.style.display = "inline-block";
      if (stopBtn)  stopBtn.style.display  = "none";
      if (msg) { msg.className = "act-msg"; msg.textContent = "اضغط لبدء المسح"; }
    };

    function scan() {
      const canvas = document.createElement("canvas");
      const ctx    = canvas.getContext("2d");
      function frame() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width  = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imgData.data, imgData.width, imgData.height);
          if (code) {
            processQR(code.data);
            return;
          }
        }
        rafId = requestAnimationFrame(frame);
      }
      rafId = requestAnimationFrame(frame);
    }

    async function processQR(raw) {
      window.__actStop();
      msg.className = "act-msg";
      msg.textContent = "جارٍ التحقق…";
      try {
        const payload = extractPayload(raw);
        await processPayload(payload, (text, cls) => {
          msg.className = "act-msg" + (cls ? " " + cls : "");
          msg.textContent = text;
        });
      } catch(e) {
        msg.className = "act-msg err";
        msg.textContent = "❌ " + (e.message || "QR غير صالح");
        setTimeout(() => {
          msg.className = "act-msg";
          msg.textContent = "اضغط لإعادة المحاولة";
          document.getElementById("act-start").style.display = "inline-block";
        }, 2500);
      }
    }

    // ── تفعيل بالرابط النصي ──
    window.__actSubmitURL = async function() {
      const input = document.getElementById("act-url-input");
      const raw   = input.value.trim();
      if (!raw) {
        input.classList.add("err");
        setTimeout(() => input.classList.remove("err"), 800);
        return;
      }
      const submitBtn = document.getElementById("act-url-submit");
      submitBtn.disabled = true;
      submitBtn.textContent = "⏳ جارٍ التحقق…";
      urlMsg.className = "act-msg";
      urlMsg.textContent = "جارٍ التحقق…";
      try {
        const payload = extractPayload(raw);
        await processPayload(payload, (text, cls) => {
          urlMsg.className = "act-msg" + (cls ? " " + cls : "");
          urlMsg.textContent = text;
        });
      } catch(e) {
        urlMsg.className = "act-msg err";
        urlMsg.textContent = "❌ " + (e.message || "رابط غير صالح");
        submitBtn.disabled = false;
        submitBtn.textContent = "✅ تفعيل";
      }
    };

    // Enter في الـ textarea → تفعيل
    document.getElementById("act-url-input").addEventListener("keydown", function(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        window.__actSubmitURL();
      }
    });
  }

  // ── نقطة الدخول الرئيسية ──
  window.__stkCheckLicense = async function() {
    const lic = getLicense();
    if (!lic) {
      showActivationScreen();
      return false;
    }
    if (isExpired(lic)) {
      showActivationScreen();
      return false;
    }
    // ── تحقق أونلاين من التجميد ──
    if (navigator.onLine) {
      const check = await checkOnlineLicense(lic.code);
      if (!check.ok) {
        if (check.frozen) { showFrozenScreen(check.reason); return false; }
        localStorage.removeItem("stoc-license-v1");
        showActivationScreen(check.reason);
        return false;
      }
    }
    // ترخيص صالح
    applyLicense(lic);
    return true;
  };

  // ── QR مشاركة داخلي (للأجهزة الأخرى في نفس الشركة) ──
  window.__stkGetShareQR = function() {
    return getLicense();
  };

  // ── تفعيل تلقائي من رابط ?lic= ──
  async function tryAutoActivateFromURL() {
    const params = new URLSearchParams(window.location.search);
    const licParam = params.get("lic");
    if (!licParam) return false;

    // تنظيف الرابط فوراً (لا يُحفظ في التاريخ)
    history.replaceState({}, "", window.location.pathname);

    // عرض شاشة تفعيل صامتة
    const splash = document.getElementById("stoc-splash");
    const stocMsg = document.getElementById("stoc-msg");
    if (stocMsg) stocMsg.textContent = "جارٍ تفعيل التطبيق…";

    try {
      const json    = decodeURIComponent(escape(atob(licParam)));
      const payload = JSON.parse(json);

      if (!payload.sig || !payload.company || !payload.url || !payload.key) {
        throw new Error("رابط التفعيل غير صالح");
      }

      const ok = await verify(payload);
      if (!ok) throw new Error("توقيع غير صحيح");
      if (isExpired(payload)) throw new Error("انتهت صلاحية الترخيص");

      if (navigator.onLine) {
        if (stocMsg) stocMsg.textContent = "جارٍ التحقق من السيرفر…";
        const check = await checkOnlineLicense(payload.code);
        if (!check.ok) throw new Error(check.reason);
      }

      saveLicense(payload);
      applyLicense(payload);

      if (stocMsg) stocMsg.textContent = "✅ تم التفعيل — " + payload.company;

      // عرض شاشة الترحيب لثانيتين ثم التطبيق
      showWelcomeScreen(payload.company);
      return true;

    } catch(e) {
      // فشل → نكمل العادي (شاشة المسح)
      if (stocMsg) stocMsg.textContent = "جارٍ التحميل…";
      return false;
    }
  }

  // ── شاشة ترحيب بعد التفعيل التلقائي ──
  function showWelcomeScreen(company) {
    const splash = document.getElementById("stoc-splash");
    if (splash) splash.style.display = "none";

    const ws = document.createElement("div");
    ws.innerHTML = `
      <style>
        #stoc-welcome {
          position:fixed;inset:0;z-index:99999;
          background:#07090f;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          font-family:'Cairo',sans-serif;direction:rtl;padding:32px;
          animation: wsFadeIn 0.4s ease;
        }
        @keyframes wsFadeIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        .ws-check { font-size:72px; margin-bottom:16px; animation: wsPop 0.5s ease 0.2s both; }
        @keyframes wsPop { from{transform:scale(0)} to{transform:scale(1)} }
        .ws-title { font-size:22px;font-weight:800;color:#e2e8f0;margin-bottom:6px; }
        .ws-company { font-size:16px;font-weight:700;color:#f59e0b;margin-bottom:24px; }
        .ws-install {
          background:linear-gradient(135deg,#b45309,#f59e0b);
          color:#000;border:none;border-radius:14px;
          font-family:'Cairo',sans-serif;font-size:15px;font-weight:800;
          padding:14px 36px;cursor:pointer;margin-bottom:12px;
          display:none;
        }
        .ws-skip { background:transparent;border:1px solid #1e2535;color:#64748b;
          border-radius:12px;font-family:'Cairo',sans-serif;font-size:13px;
          font-weight:700;padding:10px 28px;cursor:pointer; }
      </style>
      <div id="stoc-welcome">
        <div class="ws-check">✅</div>
        <div class="ws-title">تم تفعيل التطبيق!</div>
        <div class="ws-company">🏢 ${company}</div>
        <button class="ws-install" id="ws-install-btn">📲 تثبيت التطبيق</button>
        <button class="ws-skip" id="ws-skip-btn">الدخول للتطبيق ←</button>
      </div>
    `;
    document.body.appendChild(ws);

    // زر التثبيت (PWA install prompt)
    let deferredPrompt = null;
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      document.getElementById("ws-install-btn").style.display = "inline-block";
    });
    document.getElementById("ws-install-btn").addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
      }
      enterApp();
    });
    document.getElementById("ws-skip-btn").addEventListener("click", enterApp);

    // إذا لم يظهر زر التثبيت بعد 2 ثانية → ندخل مباشرة
    setTimeout(() => {
      if (!deferredPrompt) enterApp();
    }, 2500);

    function enterApp() {
      ws.style.transition = "opacity 0.3s";
      ws.style.opacity = "0";
      setTimeout(() => { ws.remove(); window.__stkShowLoader && window.__stkShowLoader(); }, 320);
    }
  }

  // تشغيل عند جاهزية DOM
  window.addEventListener("DOMContentLoaded", async function() {
    setTimeout(async function() {
      const activatedFromURL = await tryAutoActivateFromURL();
      if (!activatedFromURL) {
        window.__stkCheckLicense();
      }
    }, 200);
  });
})();
