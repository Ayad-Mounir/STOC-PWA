// ══════════════════════════════════════════════════════════════
//  SUPABASE REAL-TIME SYNC LAYER
//  جهاز أول يحفظ → Supabase → كل الأجهزة تتحدث فوراً ⚡
//
//  الجداول المطلوبة في Supabase (SQL):
//  ─────────────────────────────────────────────
//  create table stk_data (
//    id text not null,
//    tbl text not null,
//    data jsonb not null default '{}',
//    updated_at bigint not null default 0,
//    deleted_at bigint,
//    primary key (id, tbl)
//  );
//  create table stk_config (key text primary key, value text);
//  create table stk_meta (
//    id int primary key default 1,
//    ts bigint default 0,
//    reset_at bigint default 0,
//    order_seq int default 0
//  );
//  insert into stk_meta (id) values (1) on conflict do nothing;
//  -- فعّل Realtime على stk_data من لوحة Supabase
// ══════════════════════════════════════════════════════════════
(function() {
  const NOW = Date.now();

  // ── مفاتيح التخزين المحلي ──
  const SB_CFG_KEY = "stk-supabase-cfg-v1";
  const LS_DB      = "stk-db-v1";
  const LS_CFG     = "stk-cfg-v1";

  // ── الحصول على إعدادات Supabase ──
  function getSbCfg() {
    try { return JSON.parse(localStorage.getItem(SB_CFG_KEY)) || {}; } catch { return {}; }
  }
  window.__stkGetSbCfg  = getSbCfg;
  window.__stkSaveSbCfg = function(cfg) {
    try { localStorage.setItem(SB_CFG_KEY, JSON.stringify(cfg)); } catch {}
  };

  // ── إنشاء Supabase client ──
  var _sb = null;
  function getClient() {
    if (_sb) return _sb;
    var cfg = getSbCfg();
    if (!cfg.url || !cfg.key) return null;
    try {
      _sb = window.supabase.createClient(cfg.url, cfg.key, {
        realtime: { params: { eventsPerSecond: 10 } }
      });
      return _sb;
    } catch(e) { console.error("[Supabase] init failed:", e); return null; }
  }
  window.__stkReinitSb = function() { _sb = null; return !!getClient(); };
  window.__stkSbReady  = function() { return !!getClient(); };

  // ── Realtime subscription ──
  var _channel = null;
  window.__stkRealtimeSubscribe = function(onUpdate) {
    var sb = getClient();
    if (!sb) return;
    if (_channel) { try { sb.removeChannel(_channel); } catch {} }
    _channel = sb.channel("stk-live-" + Math.random().toString(36).slice(2,6))
      .on("postgres_changes",
          { event: "*", schema: "public", table: "stk_data" },
          function(payload) { onUpdate(payload); })
      .subscribe(function(status) {
        console.log("[Realtime] status:", status);
      });
  };

  // ── SEED — البيانات الأولية ──
  var TABLES = ["factories","suppliers","customers","types","measures",
                "packagings","categories","sizes","items","orders","invoices"];

  var SEED = {
    factories:[], suppliers:[], customers:[],
    types:[], measures:[], packagings:[], categories:[], sizes:[],
    items:[], orders:[], invoices:[],
    ts: NOW - 86400000, reset_at: 0,
  };

  var SEED_CFG = {
    company_name:"", company_logo:"", factory_address:"",
    factory_city:"", factory_phone:"", factory_phone2:"",
    factory_ice:"", factory_rc:"", factory_note:"",
  };

  // ── Local DB (fallback + cache) ──
  function loadLocalDB()  { try { var s=localStorage.getItem(LS_DB); if(s) return JSON.parse(s); } catch {} var c=JSON.parse(JSON.stringify(SEED)); saveLocalDB(c); return c; }
  function saveLocalDB(d) { try { localStorage.setItem(LS_DB, JSON.stringify(d)); } catch {} }
  function loadLocalCFG() { try { var s=localStorage.getItem(LS_CFG); if(s) return JSON.parse(s); } catch {} return Object.assign({}, SEED_CFG); }
  function saveLocalCFG(c){ try { localStorage.setItem(LS_CFG, JSON.stringify(c)); } catch {} }

  var DB  = loadLocalDB();
  var CFG = loadLocalCFG();

  var DEMO_USER = {
    id:1, username:"admin", role:"admin",
    role_label:"مدير عام", role_icon:"👑",
    full_name:"المدير",
    sections:["home","cutting","sales","reports","settings"],
  };

  // ══════════════════════════════════════════════════════════════
  //  Supabase Operations
  // ══════════════════════════════════════════════════════════════

  async function sbPush(body) {
    var sb = getClient();
    if (!sb) return localPush(body);
    var now = Date.now();
    var applied = {};
    var orderNumbers = {};
    var rows = [];

    for (var ti = 0; ti < TABLES.length; ti++) {
      var tbl = TABLES[ti];
      var changes = (body[tbl] || []).slice();
      applied[tbl] = changes.length;
      if (!changes.length) continue;

      for (var ci = 0; ci < changes.length; ci++) {
        var rec = Object.assign({}, changes[ci]);

        // ── ترقيم الطلبيات التلقائي ──
        if (tbl === "orders" && !rec.deleted_at && (!rec.orderNumber || rec.orderNumber === 0)) {
          try {
            var maxRes = await sb.from("stk_meta").select("order_seq").eq("id",1).single();
            var maxN = (maxRes.data && maxRes.data.order_seq) || 0;
            rec.orderNumber = maxN + 1;
            orderNumbers[rec.id] = rec.orderNumber;
            await sb.from("stk_meta").update({ order_seq: rec.orderNumber }).eq("id",1);
          } catch(_) {
            // fallback رقم عشوائي
            rec.orderNumber = Math.floor(Math.random() * 9000) + 1000;
            orderNumbers[rec.id] = rec.orderNumber;
          }
        }

        rows.push({
          id: rec.id,
          tbl: tbl,
          data: rec,
          updated_at: rec.updated_at || now,
          deleted_at: rec.deleted_at || null,
        });
      }
    }

    if (rows.length > 0) {
      var { error } = await sb.from("stk_data").upsert(rows, { onConflict: "id,tbl" });
      if (error) {
        console.error("[Supabase push]", error);
        return localPush(body);
      }
    }

    try { await sb.from("stk_meta").update({ ts: now }).eq("id", 1); } catch(_) {}
    return { ok: true, applied: applied, orderNumbers: orderNumbers, ts: now };
  }

  async function sbSnapshot() {
    var sb = getClient();
    if (!sb) return localSnapshot();

    var { data, error } = await sb.from("stk_data").select("*").is("deleted_at", null);
    if (error || !data) return localSnapshot();

    var out = Object.assign(JSON.parse(JSON.stringify(SEED)), { ts: Date.now(), reset_at: 0 });
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      if (!out[row.tbl]) out[row.tbl] = [];
      out[row.tbl].push(row.data);
    }

    // تحميل الـ config أيضاً
    var cfgRes = await sb.from("stk_config").select("*");
    if (cfgRes.data) {
      for (var j = 0; j < cfgRes.data.length; j++) {
        CFG[cfgRes.data[j].key] = cfgRes.data[j].value;
      }
      saveLocalCFG(CFG);
    }

    saveLocalDB(out);
    DB = out;
    return out;
  }

  async function sbDelta(since) {
    var sb = getClient();
    if (!sb) return localDelta(since);
    var sinceMs = parseInt(since, 10) || 0;

    var { data, error } = await sb.from("stk_data").select("*").gt("updated_at", sinceMs);
    if (error || !data) return localDelta(since);

    var metaRes = await sb.from("stk_meta").select("*").eq("id",1).single();
    var out = {
      reset_at: (metaRes.data && metaRes.data.reset_at) || 0,
      ts: (metaRes.data && metaRes.data.ts) || Date.now(),
    };
    for (var i = 0; i < TABLES.length; i++) out[TABLES[i]] = [];
    for (var j = 0; j < data.length; j++) {
      var row = data[j];
      if (!out[row.tbl]) out[row.tbl] = [];
      out[row.tbl].push(row.data);
    }
    return out;
  }

  async function sbSaveSettings(body) {
    var sb = getClient();
    var fields = ["company_name","company_logo","factory_name","factory_address",
                  "factory_city","factory_phone","factory_phone2","factory_ice","factory_rc","factory_note"];
    var rows = [];
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (body[f] !== undefined) {
        var key = (f === "factory_name") ? "company_name" : f;
        CFG[key] = body[f];
        rows.push({ key: key, value: body[f] });
      }
    }
    saveLocalCFG(CFG);
    if (sb && rows.length > 0) {
      await sb.from("stk_config").upsert(rows, { onConflict: "key" });
    }
    return { ok: true };
  }

  async function sbSetStatus(orderId, status, note) {
    var now = Date.now();
    var sb = getClient();
    var orderData = null;

    if (sb) {
      var r = await sb.from("stk_data").select("data").eq("id", orderId).eq("tbl","orders").single();
      orderData = r.data && r.data.data;
    }
    if (!orderData) {
      for (var i = 0; i < (DB.orders||[]).length; i++) {
        if (DB.orders[i].id === orderId) { orderData = DB.orders[i]; break; }
      }
    }
    if (!orderData) return { ok: false, error: "order not found" };

    var updated = Object.assign({}, orderData, {
      status: status, note: note || orderData.note || "", updated_at: now
    });
    if (sb) {
      await sb.from("stk_data").upsert(
        { id: orderId, tbl: "orders", data: updated, updated_at: now, deleted_at: null },
        { onConflict: "id,tbl" }
      );
    } else {
      localSetStatus(orderId, status, note);
    }
    return { ok: true };
  }

  async function sbFactoryReset() {
    var sb = getClient();
    if (sb) {
      await sb.from("stk_data").delete().neq("id", "___never___");
      await sb.from("stk_config").delete().neq("key", "___never___");
      var now = Date.now();
      await sb.from("stk_meta").upsert({ id:1, ts:now, reset_at:now, order_seq:0 });
    }
    DB  = JSON.parse(JSON.stringify(SEED));
    CFG = Object.assign({}, SEED_CFG);
    DB.ts = Date.now();
    saveLocalDB(DB);
    saveLocalCFG(CFG);
    return { ok: true };
  }

  // ══════════════════════════════════════════════════════════════
  //  Local fallback (بدون Supabase)
  // ══════════════════════════════════════════════════════════════
  function localPush(body) {
    var applied = {};
    var orderNumbers = {};
    var now = Date.now();
    for (var ti = 0; ti < TABLES.length; ti++) {
      var t = TABLES[ti];
      var changes = (body[t] || []).slice();
      applied[t] = changes.length;
      if (!changes.length) continue;
      if (!DB[t]) DB[t] = [];
      for (var ci = 0; ci < changes.length; ci++) {
        var rec = Object.assign({}, changes[ci]);
        if (t === "orders" && !rec.deleted_at && (!rec.orderNumber || rec.orderNumber === 0)) {
          var maxN = 0;
          for (var oi = 0; oi < DB.orders.length; oi++) {
            if ((DB.orders[oi].orderNumber||0) > maxN) maxN = DB.orders[oi].orderNumber;
          }
          rec.orderNumber = maxN + 1;
          orderNumbers[rec.id] = rec.orderNumber;
        }
        var idx = -1;
        for (var di = 0; di < DB[t].length; di++) {
          if (DB[t][di].id === rec.id) { idx = di; break; }
        }
        if (rec.deleted_at) { if (idx >= 0) DB[t].splice(idx, 1); }
        else { if (idx >= 0) DB[t][idx] = rec; else DB[t].unshift(rec); }
      }
    }
    DB.ts = now; saveLocalDB(DB);
    return { ok:true, applied:applied, orderNumbers:orderNumbers, ts:now };
  }
  function localSnapshot() { return Object.assign({}, DB); }
  function localDelta(since) {
    var sinceMs = parseInt(since,10)||0;
    var out = { reset_at: DB.reset_at||0, ts: DB.ts||NOW };
    for (var i=0; i<TABLES.length; i++) {
      var t = TABLES[i];
      out[t] = (DB[t]||[]).filter(function(r){ return (r.updated_at||0)>sinceMs; });
    }
    return out;
  }
  function localSetStatus(orderId, status, note) {
    var now = Date.now();
    for (var i=0; i<(DB.orders||[]).length; i++) {
      if (DB.orders[i].id === orderId) {
        DB.orders[i] = Object.assign({}, DB.orders[i], {
          status:status, note:note||DB.orders[i].note||"", updated_at:now
        });
        break;
      }
    }
    DB.ts = now; saveLocalDB(DB);
    return { ok:true };
  }

  function buildInfo() {
    return {
      ok:true, logged_in:true, password_required:false, current_user:DEMO_USER,
      company_name:    CFG.company_name    || "",
      company_logo:    CFG.company_logo    || "",
      factory_name:    CFG.company_name    || "",
      factory_address: CFG.factory_address || "",
      factory_city:    CFG.factory_city    || "",
      factory_phone:   CFG.factory_phone   || "",
      factory_phone2:  CFG.factory_phone2  || "",
      factory_ice:     CFG.factory_ice     || "",
      factory_rc:      CFG.factory_rc      || "",
      factory_note:    CFG.factory_note    || "",
    };
  }

  // ══════════════════════════════════════════════════════════════
  //  اعتراض fetch — نفس الواجهة القديمة
  // ══════════════════════════════════════════════════════════════
  var _origFetch = window.fetch.bind(window);

  window.fetch = function(input, init) {
    var url    = (typeof input === "string") ? input : (input.url || "");
    var method = (((init && init.method) || "GET")).toUpperCase();

    if (!url.startsWith("/api/")) return _origFetch(input, init);

    var delay   = function() { return new Promise(function(r){ setTimeout(r, 40 + Math.random()*60); }); };
    var respond = function(promiseOrData, status) {
      return Promise.resolve(promiseOrData).then(function(data) {
        return delay().then(function() {
          return new Response(JSON.stringify(data), {
            status: status || 200,
            headers: { "Content-Type": "application/json" }
          });
        });
      });
    };

    if (url === "/api/info")     return respond(buildInfo());
    if (url === "/api/ping")     return respond({ ok:true, ts:Date.now() });
    if (url === "/api/me")       return respond({ ok:true, user:DEMO_USER, permissions:{"*":true}, role_label:"مدير عام" });
    if (url === "/api/snapshot") return respond(sbSnapshot());
    if (url === "/api/login")    return respond({ ok:true, user:DEMO_USER, token:"sb-token-" + Date.now() });
    if (url === "/api/logout")   return respond({ ok:true });

    if (url.startsWith("/api/delta")) {
      var since = "0";
      try { since = new URL(url, "http://x").searchParams.get("since") || "0"; } catch {}
      return respond(sbDelta(since));
    }

    if (url.includes("/set-status") && method === "PATCH") {
      var orderId = url.split("/orders/")[1].split("/")[0];
      var sbody = {};
      try { sbody = JSON.parse((init && init.body) || "{}"); } catch {}
      return respond(sbSetStatus(orderId, sbody.status, sbody.note));
    }

    var pbody = {};
    try { pbody = JSON.parse((init && init.body) || "{}"); } catch {}

    if (url === "/api/push"          && method === "POST") return respond(sbPush(pbody));
    if (url === "/api/settings"      && method === "POST") return respond(sbSaveSettings(pbody));
    if (url === "/api/factory-reset" && method === "POST") {
      if (pbody.password !== "0000") {
        return respond({ ok: false, error: "كلمة السر غير صحيحة" }, 403);
      }
      return respond(sbFactoryReset());
    }

    return respond({ ok:false, error:"endpoint not implemented" }, 404);
  };

})();
