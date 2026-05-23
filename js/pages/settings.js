
/* ══════════════════════════════════════════════════════════════
   [M4] LanguageTab — مكوّن اختيار اللغة
   ══════════════════════════════════════════════════════════════ */
function LanguageTab() {
  var i18n = window.__i18n || { t: function(k){return k;}, getLang: function(){return "ar";},
    setLang: function(){}, langs: ["ar"], langNames: {ar:"العربية"}, langFlags: {ar:"🇲🇦"} };

  var [currentLang, setCurrentLang] = React.useState(i18n.getLang());

  React.useEffect(function() {
    function onLangChange(e) {
      setCurrentLang(e.detail ? e.detail.lang : i18n.getLang());
    }
    window.addEventListener("stoc-lang-change", onLangChange);
    return function() { window.removeEventListener("stoc-lang-change", onLangChange); };
  }, []);

  function selectLang(lang) {
    i18n.setLang(lang);
    setCurrentLang(lang);
  }

  var isRTL = currentLang === "ar";

  return React.createElement("div", { style: { padding: "4px 0 80px" } },

    // ── رأس القسم ──
    React.createElement("div", {
      style: {
        background: "linear-gradient(135deg,#1e1b4b,#312e81)",
        borderRadius: 12, padding: "20px 16px",
        marginBottom: 16, textAlign: "center"
      }
    },
      React.createElement("div", { style: { fontSize: 40, marginBottom: 8 } }, "🌐"),
      React.createElement("div", {
        style: { color: "#e2e8f0", fontWeight: 800, fontSize: 15, marginBottom: 4 }
      }, i18n.t("اختيار اللغة")),
      React.createElement("div", {
        style: { color: "#6b7280", fontSize: 11, lineHeight: 1.6 }
      }, i18n.t("اختر لغة عرض التطبيق"))
    ),

    // ── بطاقات اللغات ──
    React.createElement("div", {
      style: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }
    },
      i18n.langs.map(function(lang) {
        var active = currentLang === lang;
        var isLangRTL = lang === "ar";
        return React.createElement("button", {
          key: lang,
          onClick: function() { selectLang(lang); },
          style: {
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 18px", borderRadius: 14,
            background: active ? "linear-gradient(135deg,#b45309,#f59e0b)" : "#161b22",
            border: "1px solid " + (active ? "#f59e0b" : "#30363d"),
            cursor: "pointer", fontFamily: "Cairo,sans-serif",
            direction: isLangRTL ? "rtl" : "ltr",
            transition: "all 0.2s", width: "100%", textAlign: isLangRTL ? "right" : "left"
          }
        },
          React.createElement("span", { style: { fontSize: 34, flexShrink: 0 } },
            i18n.langFlags[lang]),
          React.createElement("div", { style: { flex: 1 } },
            React.createElement("div", {
              style: {
                fontWeight: 800, fontSize: 15,
                color: active ? "#0d1117" : "#e6edf3"
              }
            }, i18n.langNames[lang]),
            React.createElement("div", {
              style: {
                fontSize: 10, marginTop: 3,
                color: active ? "#0d1117cc" : "#6b7280"
              }
            },
              lang === "ar" ? "الاتجاه: يمين ← يسار" :
              lang === "fr" ? "Direction: gauche → droite" :
                              "Direction: left → right"
            )
          ),
          active && React.createElement("span", {
            style: {
              width: 26, height: 26, borderRadius: "50%",
              background: "#0d111780", display: "flex",
              alignItems: "center", justifyContent: "center",
              color: "#0d1117", fontWeight: 900, fontSize: 14, flexShrink: 0
            }
          }, "✓")
        );
      })
    ),

    // ── ملاحظة ──
    React.createElement("div", {
      style: {
        padding: "10px 14px", background: "#161b22",
        border: "1px solid #30363d", borderRadius: 10,
        color: "#6b7280", fontSize: 11, textAlign: "center", lineHeight: 1.7
      }
    }, i18n.t("سيُطبَّق التغيير فوراً على جميع أقسام التطبيق"))
  );
}

function SettingsView({db,tab,onTab,onAddSupplier,onDelSupplier,onAddCustomer,onDelCustomer,onEditCustomer,onAddType,onDelType,onAddMeasure,onDelMeasure,onAddPackaging,onDelPackaging,onAddCategory,onDelCategory,onAddSize,onDelSize,onFactoryReset,onAddFactory,onEditFactory,onDelFactory,connState,pendingCnt,lastSyncTime,licenseInfo}){const[subTab,setSubTab]=useState("categories");// تعريف التبويبات الرئيسية الأربعة
const mainTabs=[{key:"catalog",icon:"📋",label:"الكتالوج"},{key:"contacts",icon:"👥",label:"جهات الاتصال"},{key:"system",icon:"⚙️",label:"النظام"},{key:"ai",icon:"🧠",label:"الذكاء"},{key:"drive",icon:"☁️",label:"النسخ"},{key:"sync",icon:"🔄",label:"مزامنة"},{key:"language",icon:"🌐",label:"اللغة"}];// التبويبات الفرعية لكل تبويب رئيسي
const subTabsMap={catalog:[["categories","📁","تصنيفات"],["types","🏷️","أنواع"],["measures","📐","مقاييس"],["packagings","📦","تغليف"],["sizes","📏","مقاسات"],["costtypes","💰","التكاليف"]],contacts:[["suppliers","🏭","موردون"],["customers","👤","عملاء"],["factory","🔧","مصانع"]],system:[["system","⚙️","النظام"]],ai:[["ai","🧠","Gemini"]],drive:[["drive","☁️","Google Drive"]],sync:[["sync","🔄","Supabase"]],sync:[["sync","🔄","Supabase"]],language:[["language","🌐","اللغة"]]};const subs=subTabsMap[tab]||[];return/*#__PURE__*/React.createElement("div",{style:{padding:"12px 12px 80px",maxWidth:700,margin:"0 auto"}},/*#__PURE__*/React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4,marginBottom:14}},mainTabs.map(({key,icon,label})=>/*#__PURE__*/React.createElement("button",{key:key,onClick:()=>{onTab(key);setSubTab(subTabsMap[key][0][0]);},style:{padding:"11px 4px",background:tab===key?"linear-gradient(135deg,#b45309,#f59e0b)":"#161b22",color:tab===key?"#0d1117":"#6b7280",border:`1px solid ${tab===key?"#f59e0b":"#30363d"}`,borderRadius:10,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"Cairo,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all 0.2s"}},/*#__PURE__*/React.createElement("span",{style:{fontSize:18}},icon),/*#__PURE__*/React.createElement("span",null,label)))),subs.length>1&&/*#__PURE__*/React.createElement("div",{style:{display:"flex",gap:6,marginBottom:14,background:"#161b22",borderRadius:10,padding:5}},subs.map(([key,icon,label])=>/*#__PURE__*/React.createElement("button",{key:key,onClick:()=>setSubTab(key),style:{flex:1,padding:"7px 4px",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"Cairo,sans-serif",fontWeight:700,fontSize:10,background:subTab===key?"#f59e0b":"transparent",color:subTab===key?"#0d1117":"#6b7280",display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"all 0.15s"}},/*#__PURE__*/React.createElement("span",{style:{fontSize:14}},icon),/*#__PURE__*/React.createElement("span",null,label)))),subTab==="categories"&&/*#__PURE__*/React.createElement(CategoriesTab,{db:db,onAdd:onAddCategory,onDel:onDelCategory}),subTab==="types"&&/*#__PURE__*/React.createElement(SimpleTab,{label:"\u0627\u0644\u0646\u0648\u0639",list:db.types,onAdd:onAddType,onDel:onDelType,placeholder:"\u0645\u062B\u0627\u0644: \u0642\u0645\u0627\u0634 \u0642\u0637\u0646\u064A\u060C \u062A\u0648\u0628..."}),subTab==="measures"&&/*#__PURE__*/React.createElement(SimpleTab,{label:"\u0627\u0644\u0645\u0642\u064A\u0627\u0633",list:db.measures,onAdd:onAddMeasure,onDel:onDelMeasure,placeholder:"\u0645\u062B\u0627\u0644: \u0645\u062A\u0631\u060C \u0643\u064A\u0644\u0648\u060C \u0642\u0637\u0639\u0629..."}),subTab==="packagings"&&/*#__PURE__*/React.createElement(SimpleTab,{label:"\u0627\u0644\u062A\u063A\u0644\u064A\u0641",list:db.packagings||[],onAdd:onAddPackaging,onDel:onDelPackaging,placeholder:"\u0645\u062B\u0627\u0644: \u0631\u0648\u0644\u0648\u060C \u0639\u0644\u0628\u0629\u060C \u0643\u064A\u0633\u060C \u0643\u0631\u062A\u0648\u0646..."}),subTab==="sizes"&&/*#__PURE__*/React.createElement(SimpleTab,{label:"\u0627\u0644\u0645\u0642\u0627\u0633",list:db.sizes||[],onAdd:onAddSize,onDel:onDelSize,placeholder:"\u0645\u062B\u0627\u0644: S, M, L, XL, 38, 40..."}),subTab==="costtypes"&&/*#__PURE__*/React.createElement(CostTypesTab,null),subTab==="suppliers"&&/*#__PURE__*/React.createElement(SuppliersTab,{list:db.suppliers,onAdd:onAddSupplier,onDel:onDelSupplier}),subTab==="customers"&&/*#__PURE__*/React.createElement(CustomersTab,{list:db.customers||[],onAdd:onAddCustomer,onDel:onDelCustomer,onEdit:onEditCustomer}),subTab==="factory"&&/*#__PURE__*/React.createElement(FactoryTab,{list:(db.factories||[]).filter(f=>!f.deleted_at),onAdd:onAddFactory,onEdit:onEditFactory,onDel:onDelFactory}),subTab==="system"&&/*#__PURE__*/React.createElement(SystemTab,{db:db,onFactoryReset:onFactoryReset,connState:connState,pendingCnt:pendingCnt,lastSyncTime:lastSyncTime,licenseInfo:licenseInfo}),subTab==="ai"&&/*#__PURE__*/React.createElement(AISettingsTab,null),subTab==="drive"&&/*#__PURE__*/React.createElement(DriveTab,null),subTab==="sync"&&/*#__PURE__*/React.createElement(SupabaseSettingsTab,null),subTab==="language"&&/*#__PURE__*/React.createElement(LanguageTab,null));}/* ══════════════════════════════════════════════════════════════
   DriveTab — Google Drive Sync
   ══════════════════════════════════════════════════════════════ */const DRIVE_CFG_KEY="stk-drive-cfg-v1";const DRIVE_FILE_NAME="stock-manager-backup.json";const DRIVE_MIME="application/json";function loadDriveCfg(){try{return JSON.parse(localStorage.getItem(DRIVE_CFG_KEY)||"{}");}catch{return{};}}function saveDriveCfg(cfg){try{localStorage.setItem(DRIVE_CFG_KEY,JSON.stringify(cfg));}catch{}}function DriveTab(){const[clientId,setClientId]=React.useState(loadDriveCfg().clientId||"");const[status,setStatus]=React.useState("idle");// idle|signing|ok|err
const[msg,setMsg]=React.useState("");const[lastSync,setLastSync]=React.useState(loadDriveCfg().lastSync||"");const[fileId,setFileId]=React.useState(loadDriveCfg().fileId||"");const[token,setToken]=React.useState("");const[autoSync,setAutoSync]=React.useState(loadDriveCfg().autoSync||false);const autoRef=React.useRef(null);// ── تسجيل الدخول عبر Google Identity Services
function signIn(){if(!clientId.trim()){setMsg("أدخل Client ID أولاً");return;}setStatus("signing");setMsg("");try{const client=google.accounts.oauth2.initTokenClient({client_id:clientId.trim(),scope:"https://www.googleapis.com/auth/drive.file",callback:resp=>{if(resp.error){setStatus("err");setMsg("فشل تسجيل الدخول: "+resp.error);return;}setToken(resp.access_token);setStatus("ok");setMsg("✅ تم تسجيل الدخول بنجاح");const cfg={...loadDriveCfg(),clientId:clientId.trim()};saveDriveCfg(cfg);}});client.requestAccessToken();}catch(e){setStatus("err");setMsg("تأكد من إعداد Google API: "+e.message);}}// ── البحث عن الملف في Drive أو إنشاؤه
async function findOrCreateFile(tk){// بحث
const search=await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${DRIVE_FILE_NAME}'+and+trashed=false&fields=files(id,name,modifiedTime)`,{headers:{Authorization:"Bearer "+tk}});const{files}=await search.json();if(files&&files.length>0)return files[0].id;// إنشاء
const meta=new Blob([JSON.stringify({name:DRIVE_FILE_NAME,mimeType:DRIVE_MIME})],{type:"application/json"});const body=new FormData();body.append("metadata",meta);body.append("file",new Blob(["{}"],{type:DRIVE_MIME}));const create=await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",{method:"POST",headers:{Authorization:"Bearer "+tk},body});const created=await create.json();return created.id;}// ── حفظ على Drive
async function saveToCloud(){if(!token){setMsg("سجّل دخولك أولاً");return;}setStatus("signing");setMsg("جاري الحفظ...");try{// ── الإصلاح: نقرأ من IDB (المصدر الحقيقي) وليس localStorage ──
const rawDB=await dbGet();const rawCFG=localStorage.getItem("stk-cfg-v1")||"{}";const backup=JSON.stringify({db:rawDB,cfg:JSON.parse(rawCFG),savedAt:new Date().toISOString()});let fid=fileId;if(!fid){fid=await findOrCreateFile(token);setFileId(fid);}await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fid}?uploadType=media`,{method:"PATCH",headers:{Authorization:"Bearer "+token,"Content-Type":DRIVE_MIME},body:backup});const now=new Date().toLocaleString("ar-MA");setLastSync(now);setStatus("ok");setMsg("✅ تم الحفظ على Drive بنجاح");saveDriveCfg({...loadDriveCfg(),clientId:clientId.trim(),lastSync:now,fileId:fid,autoSync});}catch(e){setStatus("err");setMsg("❌ خطأ في الحفظ: "+e.message);}}// ── تحميل من Drive
async function loadFromCloud(){if(!token){setMsg("سجّل دخولك أولاً");return;}setStatus("signing");setMsg("جاري التحميل...");try{let fid=fileId;if(!fid){const search=await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${DRIVE_FILE_NAME}'+and+trashed=false&fields=files(id)`,{headers:{Authorization:"Bearer "+token}});const{files}=await search.json();if(!files||files.length===0){setMsg("⚠️ لا توجد نسخة احتياطية على Drive بعد");setStatus("idle");return;}fid=files[0].id;setFileId(fid);}const res=await fetch(`https://www.googleapis.com/drive/v3/files/${fid}?alt=media`,{headers:{Authorization:"Bearer "+token}});const data=await res.json();if(data.db)localStorage.setItem("stk-db-v1",JSON.stringify(data.db));if(data.cfg)localStorage.setItem("stk-cfg-v1",JSON.stringify(data.cfg));// ── كتابة IDB صريحة للأمان قبل إعادة التشغيل ──
if(data.db)await dbSet(data.db);setStatus("ok");setMsg("✅ تم التحميل — سيتم إعادة تشغيل التطبيق");saveDriveCfg({...loadDriveCfg(),lastSync:data.savedAt,fileId:fid});setTimeout(()=>location.reload(),1500);}catch(e){setStatus("err");setMsg("❌ خطأ في التحميل: "+e.message);}}// ── مزامنة تلقائية
React.useEffect(()=>{if(autoRef.current)clearInterval(autoRef.current);if(autoSync&&token){autoRef.current=setInterval(()=>saveToCloud(),10*60*1000);// كل 10 دقائق
}return()=>{if(autoRef.current)clearInterval(autoRef.current);};},[autoSync,token]);const saved=clientId&&status==="ok";return/*#__PURE__*/React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:12}},/*#__PURE__*/React.createElement("div",{style:{background:"linear-gradient(135deg,#0c1a2e,#0d2448)",border:"1px solid #1e3a5f",borderRadius:12,padding:16,textAlign:"center"}},/*#__PURE__*/React.createElement("div",{style:{fontSize:32,marginBottom:6}},"\u2601\uFE0F"),/*#__PURE__*/React.createElement("div",{style:{color:"#60a5fa",fontWeight:800,fontSize:14}},"\u0645\u0632\u0627\u0645\u0646\u0629 Google Drive"),/*#__PURE__*/React.createElement("div",{style:{color:"#6b7280",fontSize:11,marginTop:4,lineHeight:1.6}},"\u0627\u062D\u0641\u0638 \u0628\u064A\u0627\u0646\u0627\u062A\u0643 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0639\u0644\u0649 Google Drive",/*#__PURE__*/React.createElement("br",null),"\u0648\u0627\u0633\u062A\u0639\u062F\u0651\u0647\u0627 \u0645\u0646 \u0623\u064A \u062C\u0647\u0627\u0632 \u0622\u062E\u0631")),/*#__PURE__*/React.createElement("div",{style:{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:14}},/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:8}},"\uD83D\uDD11 Google OAuth Client ID"),/*#__PURE__*/React.createElement("input",{value:clientId,onChange:e=>setClientId(e.target.value),placeholder:"XXXX.apps.googleusercontent.com",style:{width:"100%",padding:"10px 12px",background:"#0d1117",color:"#e6edf3",border:"1px solid #30363d",borderRadius:8,fontFamily:"Cairo",fontSize:12,boxSizing:"border-box",outline:"none",direction:"ltr",textAlign:"left"}}),/*#__PURE__*/React.createElement("div",{style:{color:"#6b7280",fontSize:10,marginTop:6,lineHeight:1.6}},"\uD83D\uDCCC \u0643\u064A\u0641\u064A\u0629 \u0627\u0644\u062D\u0635\u0648\u0644 \u0639\u0644\u064A\u0647: ",/*#__PURE__*/React.createElement("br",null),"1. \u0627\u0641\u062A\u062D ",/*#__PURE__*/React.createElement("strong",{style:{color:"#60a5fa"}},"console.cloud.google.com"),/*#__PURE__*/React.createElement("br",null),"2. \u0623\u0646\u0634\u0626 \u0645\u0634\u0631\u0648\u0639 \u062C\u062F\u064A\u062F \u2192 \u0641\u0639\u0651\u0644 ",/*#__PURE__*/React.createElement("strong",null,"Google Drive API"),/*#__PURE__*/React.createElement("br",null),"3. \u0623\u0646\u0634\u0626 ",/*#__PURE__*/React.createElement("strong",null,"OAuth 2.0 Client ID")," \u0645\u0646 \u0646\u0648\u0639 ",/*#__PURE__*/React.createElement("em",null,"Web application"),/*#__PURE__*/React.createElement("br",null),"4. \u0623\u0636\u0641 \u0631\u0627\u0628\u0637 GitHub Pages \u0641\u064A ",/*#__PURE__*/React.createElement("strong",null,"Authorized JavaScript origins"))),!token?/*#__PURE__*/React.createElement("button",{onClick:signIn,style:{width:"100%",padding:13,background:"linear-gradient(135deg,#1a56db,#1e40af)",color:"#fff",border:"none",borderRadius:10,fontFamily:"Cairo",fontWeight:800,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}},/*#__PURE__*/React.createElement("span",{style:{fontSize:18}},"\uD83D\uDD10"),"\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0628\u0640 Google"):/*#__PURE__*/React.createElement("div",{style:{background:"#0c2818",border:"1px solid #15803d",borderRadius:10,padding:12,display:"flex",alignItems:"center",gap:8}},/*#__PURE__*/React.createElement("span",{style:{fontSize:20}},"\u2705"),/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement("div",{style:{color:"#3fb950",fontWeight:800,fontSize:12}},"\u0645\u062A\u0635\u0644 \u0628\u0640 Google Drive"),/*#__PURE__*/React.createElement("div",{style:{color:"#6b7280",fontSize:10,marginTop:2}},"\u0627\u0644\u0631\u0645\u0632 \u0633\u0627\u0631\u064A \u0644\u0645\u062F\u0629 \u0633\u0627\u0639\u0629"))),/*#__PURE__*/React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},/*#__PURE__*/React.createElement("button",{onClick:saveToCloud,disabled:!token,style:{padding:12,background:token?"linear-gradient(135deg,#15803d,#16a34a)":"#21262d",color:token?"#fff":"#4b5563",border:"none",borderRadius:10,fontFamily:"Cairo",fontWeight:800,fontSize:12,cursor:token?"pointer":"not-allowed",display:"flex",flexDirection:"column",alignItems:"center",gap:4}},/*#__PURE__*/React.createElement("span",{style:{fontSize:20}},"\u2B06\uFE0F"),"\u062D\u0641\u0638 \u0639\u0644\u0649 Drive"),/*#__PURE__*/React.createElement("button",{onClick:loadFromCloud,disabled:!token,style:{padding:12,background:token?"linear-gradient(135deg,#0369a1,#0284c7)":"#21262d",color:token?"#fff":"#4b5563",border:"none",borderRadius:10,fontFamily:"Cairo",fontWeight:800,fontSize:12,cursor:token?"pointer":"not-allowed",display:"flex",flexDirection:"column",alignItems:"center",gap:4}},/*#__PURE__*/React.createElement("span",{style:{fontSize:20}},"\u2B07\uFE0F"),"\u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0645\u0646 Drive")),token&&/*#__PURE__*/React.createElement("div",{style:{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:12,display:"flex",alignItems:"center",justifyContent:"space-between"}},/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement("div",{style:{color:"#e6edf3",fontSize:12,fontWeight:700}},"\u23F1 \u0645\u0632\u0627\u0645\u0646\u0629 \u062A\u0644\u0642\u0627\u0626\u064A\u0629"),/*#__PURE__*/React.createElement("div",{style:{color:"#6b7280",fontSize:10,marginTop:2}},"\u0643\u0644 10 \u062F\u0642\u0627\u0626\u0642 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B")),/*#__PURE__*/React.createElement("div",{onClick:()=>{const v=!autoSync;setAutoSync(v);saveDriveCfg({...loadDriveCfg(),autoSync:v});},style:{width:44,height:24,borderRadius:12,cursor:"pointer",transition:"all 0.3s",background:autoSync?"#15803d":"#30363d",position:"relative"}},/*#__PURE__*/React.createElement("div",{style:{position:"absolute",top:2,transition:"all 0.3s",right:autoSync?"2px":"auto",left:autoSync?"auto":"2px",width:20,height:20,borderRadius:10,background:"#fff"}}))),lastSync&&/*#__PURE__*/React.createElement("div",{style:{color:"#6b7280",fontSize:10,textAlign:"center"}},"\uD83D\uDD50 \u0622\u062E\u0631 \u0645\u0632\u0627\u0645\u0646\u0629: ",lastSync),msg&&/*#__PURE__*/React.createElement("div",{style:{padding:"10px 14px",borderRadius:8,fontSize:12,textAlign:"center",fontWeight:700,background:status==="err"?"#3f1212":status==="ok"?"#0c2818":"#1c1000",color:status==="err"?"#f85149":status==="ok"?"#3fb950":"#fbbf24",border:`1px solid ${status==="err"?"#7f1d1d":status==="ok"?"#15803d":"#92400e"}`}},msg));}/* ══ AI SETTINGS TAB ══ */// ══════════════════════════════════════════════════════════════
//  SupabaseSettingsTab — إعدادات Supabase Realtime
// ══════════════════════════════════════════════════════════════

/* ══════════════════════════════════════════════════════════════
   [M3] LicenseInfoCard — بطاقة معلومات الترخيص والمدة المتبقية
   ══════════════════════════════════════════════════════════════ */

// M3.1 — استخراج بيانات الترخيص من localStorage
function getLicenseInfo() {
  try {
    var raw = localStorage.getItem("stoc-license-v1");
    if (!raw) return null;
    var lic = JSON.parse(raw);
    if (!lic || !lic.company) return null;

    var now         = new Date();
    var activatedAt = lic.activatedAt ? new Date(lic.activatedAt) : null;
    var expiresAt   = lic.expires     ? new Date(lic.expires)     : null;

    var remainingDays = null;
    var isExpired     = false;
    if (expiresAt) {
      var diffMs    = expiresAt - now;
      remainingDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      isExpired     = diffMs < 0;
    }
    return {
      company:       lic.company      || "—",
      code:          lic.code         || "—",
      activatedAt:   activatedAt,
      expiresAt:     expiresAt,
      remainingDays: remainingDays,
      isExpired:     isExpired,
      isPerpetual:   !expiresAt,
    };
  } catch(e) { return null; }
}

// M3.2 — بطاقة عرض معلومات الترخيص
function LicenseInfoCard() {
  // [AUTO-REFRESH] إعادة رسم البطاقة عند تحديث الترخيص تلقائياً
  var [_tick, _setTick] = React.useState(0);
  React.useEffect(function() {
    function onLicUpdate() { _setTick(function(t) { return t + 1; }); }
    window.addEventListener("stoc-license-updated", onLicUpdate);
    return function() { window.removeEventListener("stoc-license-updated", onLicUpdate); };
  }, []);

  var lic = getLicenseInfo();

  // ── حالة: لا يوجد ترخيص ──
  if (!lic) {
    return React.createElement("div", {
      style: {
        background:"#1c1007", border:"1px solid #92400e",
        borderRadius:12, padding:16, marginBottom:16, textAlign:"center"
      }
    },
      React.createElement("div", {style:{fontSize:28, marginBottom:6}}, "⚠️"),
      React.createElement("div", {style:{color:"#fbbf24", fontWeight:800, fontSize:13}},
        "لا يوجد ترخيص مفعَّل"),
      React.createElement("div", {style:{color:"#9ca3af", fontSize:11, marginTop:4}},
        "فعِّل التطبيق عبر QR أو الرابط")
    );
  }

  // ── تحديد لون الحالة ──
  var sColor, sBg, sBorder, sIcon, sText;
  if (lic.isExpired) {
    sColor="#f87171"; sBg="#1a0505"; sBorder="#7f1d1d40";
    sIcon="🔴"; sText="منتهي الصلاحية";
  } else if (lic.isPerpetual) {
    sColor="#4ade80"; sBg="#052e16"; sBorder="#15803d40";
    sIcon="♾️"; sText="ترخيص دائم";
  } else if (lic.remainingDays <= 7) {
    sColor="#fb923c"; sBg="#1c0a00"; sBorder="#92400e40";
    sIcon="🟠"; sText="ينتهي قريباً!";
  } else {
    sColor="#4ade80"; sBg="#052e16"; sBorder="#15803d40";
    sIcon="🟢"; sText="ساري";
  }

  // ── تنسيق التاريخ ──
  function fmtDate(d) {
    if (!d) return "—";
    try { return d.toLocaleDateString("ar-MA", {year:"numeric", month:"short", day:"numeric"}); }
    catch(e) { return d.toISOString().slice(0,10); }
  }

  return React.createElement("div", {
    style: {
      background:sBg, border:"1px solid "+sBorder,
      borderRadius:14, padding:16, marginBottom:16
    }
  },
    // ── رأس البطاقة ──
    React.createElement("div", {
      style:{display:"flex", alignItems:"center", gap:10, marginBottom:14}
    },
      React.createElement("span", {style:{fontSize:28}}, "🔐"),
      React.createElement("div", {style:{flex:1, minWidth:0}},
        React.createElement("div", {
          style:{color:"#e6edf3", fontWeight:800, fontSize:15,
                 overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}
        }, lic.company),
        React.createElement("div", {
          style:{color:"#6b7280", fontSize:10, marginTop:2,
                 direction:"ltr", textAlign:"right", fontFamily:"monospace"}
        }, "# " + lic.code)
      ),
      React.createElement("span", {
        style:{
          background:sColor+"20", color:sColor,
          border:"1px solid "+sColor+"50",
          borderRadius:20, padding:"4px 10px",
          fontSize:10, fontWeight:700, whiteSpace:"nowrap",
          flexShrink:0
        }
      }, sIcon + " " + sText)
    ),

    // ── شبكة المعلومات ──
    React.createElement("div", {
      style:{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}
    },

      // تاريخ التفعيل
      React.createElement("div", {
        style:{background:"#0d1117", borderRadius:10, padding:"10px 12px",
               border:"1px solid #30363d"}
      },
        React.createElement("div", {
          style:{color:"#6b7280", fontSize:9, fontWeight:700,
                 marginBottom:5, letterSpacing:0.5}
        }, "📅 تاريخ التفعيل"),
        React.createElement("div", {
          style:{color:"#e6edf3", fontSize:12, fontWeight:700}
        }, fmtDate(lic.activatedAt))
      ),

      // تاريخ الانتهاء
      React.createElement("div", {
        style:{background:"#0d1117", borderRadius:10, padding:"10px 12px",
               border:"1px solid #30363d"}
      },
        React.createElement("div", {
          style:{color:"#6b7280", fontSize:9, fontWeight:700,
                 marginBottom:5, letterSpacing:0.5}
        }, "⏳ تاريخ الانتهاء"),
        React.createElement("div", {
          style:{color: lic.isExpired ? "#f87171" : "#e6edf3",
                 fontSize:12, fontWeight:700}
        }, lic.isPerpetual ? "دائم ♾️" : fmtDate(lic.expiresAt))
      ),

      // شريط المدة المتبقية — عرض كامل
      !lic.isPerpetual && React.createElement("div", {
        style:{
          gridColumn:"1 / -1",
          background: lic.isExpired ? "#1a0505"
                    : lic.remainingDays <= 7 ? "#1c0a00" : "#052e16",
          borderRadius:10, padding:"12px 14px",
          border:"1px solid "+(lic.isExpired ? "#7f1d1d"
                    : lic.remainingDays <= 7 ? "#92400e" : "#166534"),
          display:"flex", alignItems:"center", justifyContent:"space-between"
        }
      },
        React.createElement("div", {
          style:{color:"#9ca3af", fontSize:11, fontWeight:700}
        }, "⏱ المدة المتبقية"),
        React.createElement("div", {
          style:{
            color: lic.isExpired ? "#f87171"
                 : lic.remainingDays <= 7 ? "#fb923c" : "#4ade80",
            fontWeight:800, fontSize:22, lineHeight:1
          }
        },
          lic.isExpired ? "منتهي"
          : lic.remainingDays === 0 ? "آخر يوم!"
          : lic.remainingDays + " يوم"
        )
      )
    )
  );
}

function SupabaseSettingsTab(){
  var isConnected = typeof window.__stkSbReady === "function" && window.__stkSbReady();

  return React.createElement("div", { style: { padding: "4px 0 80px" } },

    // ── 1. بطاقة الترخيص ──
    React.createElement(LicenseInfoCard, null),

    // ── 2. حالة المزامنة ──
    React.createElement("div", {
      style: {
        background: isConnected ? "#052e16" : "#1c1007",
        border: "1px solid " + (isConnected ? "#166534" : "#92400e"),
        borderRadius: 14, padding: 16, marginBottom: 16,
        display: "flex", alignItems: "center", gap: 12
      }
    },
      React.createElement("span", { style: { fontSize: 26 } }, isConnected ? "🟢" : "🟡"),
      React.createElement("div", { style: { flex: 1 } },
        React.createElement("div", {
          style: { fontWeight: 800, fontSize: 13, color: isConnected ? "#4ade80" : "#fbbf24" }
        }, isConnected ? "متصل بـ Supabase ⚡" : "غير متصل — وضع محلي"),
        React.createElement("div", {
          style: { fontSize: 11, color: "#9ca3af", marginTop: 2 }
        }, isConnected
          ? "البيانات تتزامن تلقائياً مع كل الأجهزة"
          : "تواصل مع المدير إذا كانت المزامنة لا تعمل")
      )
    ),

    // ── 3. مشاركة مع جهاز آخر ──
    React.createElement(ShareDeviceQR, null)
  );
}

/* ══ مكوّن QR المشاركة الداخلي ══ */
function AISettingsTab(){const[key,setKey]=useState(()=>localStorage.getItem(AI_KEY_STORAGE)||"");const[saved,setSaved]=useState(()=>!!localStorage.getItem(AI_KEY_STORAGE));const[show,setShow]=useState(false);function save(){const v=key.trim();if(!v){alert("أدخل المفتاح أولاً");return;}localStorage.setItem(AI_KEY_STORAGE,v);setSaved(true);}function clear(){if(!confirm("حذف مفتاح Gemini API؟"))return;localStorage.removeItem(AI_KEY_STORAGE);setKey("");setSaved(false);}const inp={flex:1,padding:"10px 12px",background:"#0d1117",border:"1px solid #30363d",borderRadius:8,color:"#e6edf3",fontFamily:"Cairo,sans-serif",fontSize:13,outline:"none",direction:"ltr"};return/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement("div",{style:{background:"linear-gradient(135deg,#1e1b4b,#2e1065)",borderRadius:10,padding:14,marginBottom:16,color:"#fff"}},/*#__PURE__*/React.createElement("div",{style:{fontSize:12,fontWeight:800,letterSpacing:1}},"\uD83E\uDDE0 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A"),/*#__PURE__*/React.createElement("div",{style:{fontSize:11,opacity:0.8,marginTop:4}},"\u0645\u0641\u062A\u0627\u062D Gemini API \u0644\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0623\u062B\u0648\u0627\u0628 \u0648\u0643\u0634\u0641 \u0627\u0644\u0623\u0644\u0648\u0627\u0646")),/*#__PURE__*/React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,padding:12,background:saved?"#0c2818":"#1f1010",border:`1px solid ${saved?"#15803d":"#7f1d1d"}`,borderRadius:10,marginBottom:14}},/*#__PURE__*/React.createElement("span",{style:{fontSize:20}},saved?"✅":"⚠️"),/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement("div",{style:{color:saved?"#3fb950":"#f87171",fontWeight:700,fontSize:13}},saved?"المفتاح محفوظ وجاهز للاستخدام":"لا يوجد مفتاح — التحليل معطل"),/*#__PURE__*/React.createElement("div",{style:{color:"#6b7280",fontSize:10,marginTop:2}},saved?"يمكنك تعديله أو حذفه في أي وقت":"أضف مفتاحك للاستفادة من التحليل الآلي"))),/*#__PURE__*/React.createElement("div",{style:{marginBottom:10}},/*#__PURE__*/React.createElement("label",{style:{color:"#8b949e",fontSize:11,fontWeight:700,display:"block",marginBottom:6}},"\u0645\u0641\u062A\u0627\u062D Gemini API"),/*#__PURE__*/React.createElement("div",{style:{display:"flex",gap:8}},/*#__PURE__*/React.createElement("input",{type:show?"text":"password",style:inp,placeholder:"AIzaSy...",value:key,onChange:e=>{setKey(e.target.value);setSaved(false);}}),/*#__PURE__*/React.createElement("button",{onClick:()=>setShow(s=>!s),style:{padding:"10px 12px",background:"#21262d",border:"1px solid #30363d",borderRadius:8,color:"#8b949e",cursor:"pointer",fontSize:14}},show?"🙈":"👁"))),/*#__PURE__*/React.createElement("div",{style:{display:"flex",gap:8,marginBottom:16}},/*#__PURE__*/React.createElement("button",{onClick:save,style:{flex:1,padding:12,background:"#1e40af",color:"#fff",border:"none",borderRadius:8,fontFamily:"Cairo,sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}},"\uD83D\uDCBE \u062D\u0641\u0638 \u0627\u0644\u0645\u0641\u062A\u0627\u062D"),saved&&/*#__PURE__*/React.createElement("button",{onClick:clear,style:{padding:"12px 16px",background:"#1f1010",color:"#f87171",border:"1px solid #7f1d1d",borderRadius:8,fontFamily:"Cairo,sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}},"\uD83D\uDDD1")),/*#__PURE__*/React.createElement("div",{style:{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:14}},/*#__PURE__*/React.createElement("div",{style:{color:"#e6edf3",fontWeight:700,fontSize:12,marginBottom:10}},"\uD83D\uDCD6 \u0643\u064A\u0641 \u062A\u062D\u0635\u0644 \u0639\u0644\u0649 \u0645\u0641\u062A\u0627\u062D \u0645\u062C\u0627\u0646\u064A\u061F"),["افتح aistudio.google.com","سجل دخول بحساب Google",'اضغط "Get API Key" ثم "Create API key"',"انسخ المفتاح والصقه هنا"].map((step,i)=>/*#__PURE__*/React.createElement("div",{key:i,style:{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}},/*#__PURE__*/React.createElement("div",{style:{width:20,height:20,borderRadius:"50%",background:"#1e40af",color:"#fff",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}},i+1),/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",fontSize:12}},step))),/*#__PURE__*/React.createElement("a",{href:"https://aistudio.google.com/apikey",target:"_blank",style:{display:"block",textAlign:"center",padding:"10px 0",marginTop:6,background:"linear-gradient(135deg,#1e3a8a,#1e40af)",color:"#60a5fa",borderRadius:8,fontWeight:700,fontSize:12,textDecoration:"none"}},"\uD83D\uDD17 \u0641\u062A\u062D Google AI Studio")));}/* ══ COST TYPES TAB — أنواع التكاليف ══ */function CostTypesTab(){const loadTypes=()=>{try{return JSON.parse(localStorage.getItem(COST_TYPES_KEY)||"[]");}catch{return[];}};const saveTypes=list=>localStorage.setItem(COST_TYPES_KEY,JSON.stringify(list));const[list,setList]=useState(loadTypes);const[inp,setInp]=useState("");const[err,setErr]=useState("");const EXAMPLES=["سلاسل","ازرار","فزلين","صباغة","تطريز","تعبئة","كيس","إكسسوار","خيط"];function addType(){const name=inp.trim();if(!name){setErr("أدخل اسم النوع");return;}if(list.some(t=>t.name===name)){setErr("هاد النوع موجود أصلاً");return;}const next=[...list,{id:uid(),name}];setList(next);saveTypes(next);setInp("");setErr("");}function delType(id){const next=list.filter(t=>t.id!==id);setList(next);saveTypes(next);}const inputSt={flex:1,padding:"9px 12px",background:"#0d1117",color:"#e6edf3",border:"1px solid #30363d",borderRadius:7,fontFamily:"Cairo,sans-serif",fontSize:14,outline:"none"};return/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",fontSize:12,marginBottom:14,lineHeight:1.6}},"\u0639\u0631\u0651\u0641 \u0647\u0646\u0627 \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u062A\u0643\u0627\u0644\u064A\u0641 \u0627\u0644\u0644\u064A \u062A\u0633\u062A\u062E\u062F\u0645\u0647\u0627 \u0641\u064A \u0627\u0644\u0625\u0646\u062A\u0627\u062C.",/*#__PURE__*/React.createElement("br",null),"\u0639\u0646\u062F \u0627\u0644\u0625\u0631\u0633\u0627\u0644 \u0644\u0644\u0645\u0628\u064A\u0639\u0627\u062A\u060C \u062A\u062E\u062A\u0627\u0631 \u0645\u0646 \u0647\u0627\u0630\u064A \u0627\u0644\u0623\u0646\u0648\u0627\u0639 \u0623\u064A\u0647\u0627 \u064A\u062E\u0635 \u0627\u0644\u0645\u0648\u062F\u064A\u0644 \u0648\u062A\u062F\u062E\u0644 \u0645\u0628\u0644\u063A\u0647."),/*#__PURE__*/React.createElement("div",{style:{display:"flex",gap:8,marginBottom:err?4:14}},/*#__PURE__*/React.createElement("input",{value:inp,onChange:e=>{setInp(e.target.value);setErr("");},onKeyDown:e=>e.key==="Enter"&&addType(),placeholder:"\u0645\u062B\u0627\u0644: \u0627\u0632\u0631\u0627\u0631\u060C \u0635\u0628\u0627\u063A\u0629\u060C \u0641\u0632\u0644\u064A\u0646...",style:inputSt}),/*#__PURE__*/React.createElement("button",{onClick:addType,style:{padding:"9px 18px",background:"#f59e0b",color:"#0d1117",border:"none",borderRadius:7,fontFamily:"Cairo,sans-serif",fontWeight:800,fontSize:13,cursor:"pointer"}},"\uFF0B \u0625\u0636\u0627\u0641\u0629")),err&&/*#__PURE__*/React.createElement("div",{style:{color:"#f85149",fontSize:11,marginBottom:10}},err),list.length===0&&/*#__PURE__*/React.createElement("div",{style:{marginBottom:16}},/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",fontSize:11,marginBottom:8}},"\u0623\u0645\u062B\u0644\u0629 \u0634\u0627\u0626\u0639\u0629 \u2014 \u0627\u0636\u063A\u0637 \u0644\u0644\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0633\u0631\u064A\u0639\u0629:"),/*#__PURE__*/React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},EXAMPLES.filter(ex=>!list.some(t=>t.name===ex)).map(ex=>/*#__PURE__*/React.createElement("button",{key:ex,onClick:()=>{const next=[...list,{id:uid(),name:ex}];setList(next);saveTypes(next);},style:{padding:"5px 12px",background:"#21262d",color:"#8b949e",border:"1px dashed #30363d",borderRadius:20,fontFamily:"Cairo,sans-serif",fontSize:12,cursor:"pointer"}},ex)))),list.length===0?/*#__PURE__*/React.createElement("div",{style:{textAlign:"center",color:"#484f58",padding:"32px 20px",border:"1px dashed #30363d",borderRadius:10}},/*#__PURE__*/React.createElement("div",{style:{fontSize:28,marginBottom:6}},"\uD83C\uDFF7\uFE0F"),/*#__PURE__*/React.createElement("div",{style:{fontSize:13}},"\u0644\u0627 \u064A\u0648\u062C\u062F \u0623\u0646\u0648\u0627\u0639 \u062A\u0643\u0627\u0644\u064A\u0641 \u0628\u0639\u062F")):/*#__PURE__*/React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:8}},list.map(t=>/*#__PURE__*/React.createElement("div",{key:t.id,style:{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",background:"#0d1117",border:"1px solid #30363d",borderRadius:20}},/*#__PURE__*/React.createElement("span",{style:{color:"#e6edf3",fontSize:13,fontWeight:700}},t.name),/*#__PURE__*/React.createElement("button",{onClick:()=>delType(t.id),style:{background:"none",border:"none",color:"#f85149",cursor:"pointer",fontSize:14,padding:0,lineHeight:1}},"\u2715")))),list.length>0&&/*#__PURE__*/React.createElement("div",{style:{marginTop:14,color:"#8b949e",fontSize:11}},list.length," \u0646\u0648\u0639 \xB7 \u0633\u062A\u0638\u0647\u0631 \u0643\u0644\u0647\u0627 \u0643\u062E\u064A\u0627\u0631\u0627\u062A \u0639\u0646\u062F \u0627\u0644\u0625\u0631\u0633\u0627\u0644 \u0644\u0644\u0645\u0628\u064A\u0639\u0627\u062A"));}/* ══ FACTORY TAB ══ */function FactoryTab({list,onAdd,onEdit,onDel}){const BLANK={name:"",phone:"",address:""};const[form,setForm]=useState(BLANK);const[editId,setEditId]=useState(null);// null = إضافة, id = تعديل
const[open,setOpen]=useState(false);const upd=(f,v)=>setForm(x=>({...x,[f]:v}));function openAdd(){setForm(BLANK);setEditId(null);setOpen(true);}function openEdit(f){setForm({name:f.name,phone:f.phone||"",address:f.address||""});setEditId(f.id);setOpen(true);}function cancel(){setOpen(false);setEditId(null);setForm(BLANK);}function submit(){if(!form.name.trim())return;const data={name:form.name.trim(),phone:form.phone.trim(),address:form.address.trim()};if(editId)onEdit(editId,data);else onAdd(data);cancel();}return/*#__PURE__*/React.createElement("div",null,!open?/*#__PURE__*/React.createElement(Btn,{onClick:openAdd,full:true},"+ \u0625\u0636\u0627\u0641\u0629 \u0645\u0635\u0646\u0639 / \u0648\u0631\u0634\u0629"):/*#__PURE__*/React.createElement(Card,{style:{marginBottom:16}},/*#__PURE__*/React.createElement(SecTitle,{icon:editId?"✏️":"➕"},editId?"تعديل المصنع":"مصنع / ورشة جديدة"),/*#__PURE__*/React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:10}},/*#__PURE__*/React.createElement(Input,{value:form.name,onChange:v=>upd("name",v),placeholder:"\u0627\u0633\u0645 \u0627\u0644\u0645\u0635\u0646\u0639 / \u0627\u0644\u0648\u0631\u0634\u0629 *"}),/*#__PURE__*/React.createElement(Input,{value:form.phone,onChange:v=>upd("phone",v),placeholder:"\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641",type:"tel"}),/*#__PURE__*/React.createElement(Input,{value:form.address,onChange:v=>upd("address",v),placeholder:"\u0627\u0644\u0639\u0646\u0648\u0627\u0646"}),/*#__PURE__*/React.createElement("div",{style:{display:"flex",gap:8}},/*#__PURE__*/React.createElement(Btn,{onClick:cancel,secondary:true,full:true},"\u0625\u0644\u063A\u0627\u0621"),/*#__PURE__*/React.createElement(Btn,{onClick:submit,full:true,disabled:!form.name.trim()},"\u062D\u0641\u0638")))),/*#__PURE__*/React.createElement("div",{style:{marginTop:16,display:"flex",flexDirection:"column",gap:10}},list.length===0&&/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",textAlign:"center",padding:30,fontSize:13}},"\u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u0635\u0627\u0646\u0639 \u0628\u0639\u062F"),list.map(f=>/*#__PURE__*/React.createElement(Card,{key:f.id,style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}},/*#__PURE__*/React.createElement("div",{style:{flex:1}},/*#__PURE__*/React.createElement("div",{style:{color:"#e6edf3",fontWeight:700}},"\uD83C\uDFED ",f.name),f.phone&&/*#__PURE__*/React.createElement("a",{href:`tel:${f.phone}`,style:{color:"#3fb950",fontSize:13,textDecoration:"none",display:"block",marginTop:3}},"\uD83D\uDCDE ",f.phone),f.address&&/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",fontSize:12,marginTop:2}},"\uD83D\uDCCD ",f.address)),/*#__PURE__*/React.createElement("div",{style:{display:"flex",gap:8,flexShrink:0}},/*#__PURE__*/React.createElement("button",{onClick:()=>openEdit(f),style:{background:"none",border:"none",color:"#60a5fa",fontSize:18,cursor:"pointer"},title:"\u062A\u0639\u062F\u064A\u0644"},"\u270F\uFE0F"),/*#__PURE__*/React.createElement("button",{onClick:()=>onDel(f.id),style:{background:"none",border:"none",color:"#f85149",fontSize:18,cursor:"pointer"},title:"\u062D\u0630\u0641"},"\uD83D\uDDD1"))))));}/* ══ SYSTEM TAB — تصفير النظام ══ */function SystemTab({db,onFactoryReset,connState,pendingCnt,lastSyncTime,licenseInfo}){const[showDialog,setShowDialog]=useState(false);const[password,setPassword]=useState("");const[busy,setBusy]=useState(false);const[error,setError]=useState("");const[result,setResult]=useState(null);const[me,setMe]=useState(null);// إحصائيات
const itemsCount=(db.items||[]).filter(i=>!i.deleted_at).length;const ordersCount=(db.orders||[]).filter(o=>!o.deleted_at).length;const customersCount=(db.customers||[]).filter(c=>!c.deleted_at).length;const suppliersCount=(db.suppliers||[]).filter(s=>!s.deleted_at).length;// نجلب معلومات المستخدم الحالي مرة وحدة (باش نوريوه ف الـ dialog)
useEffect(()=>{API.me().then(r=>setMe(r?.user||null)).catch(()=>{});},[]);const isAdmin=me?.role==="admin";async function handleReset(){if(!password){setError("أدخل كلمة السر");return;}setBusy(true);setError("");try{const r=await API.factoryReset(password);if(!r||!r.ok){setError((r&&r.error)||"كلمة السر غير صحيحة");return;}// نمسح كل شيء محلياً بعد تأكيد السيرفر
const emptyDB={...INIT_DB,ts:Date.now(),reset_at:Date.now()};dbSet(emptyDB);pendingClear();setAuthToken("");try{IDB.set(META_KEY,{deviceId:getDeviceId(),lastSync:0,lastResetAt:Date.now()});IDB.set(DB_KEY,emptyDB);IDB.set(PENDING_KEY,{factories:[],suppliers:[],customers:[],types:[],measures:[],packagings:[],categories:[],sizes:[],items:[],orders:[],invoices:[]});}catch(e){}setResult({...r,done:true});}catch(e){if(e.network){setError("offline");}else{setError(e.error||"كلمة السر غير صحيحة");}}finally{setBusy(false);}}function handleLocalReset(){dbSet({...INIT_DB});pendingClear();try{IDB.set(META_KEY,{deviceId:getDeviceId(),lastSync:0,lastResetAt:0});}catch(e){}setResult({done:true,localOnly:true});}return/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement("div",{style:{background:"linear-gradient(135deg,#7f1d1d,#991b1b)",borderRadius:10,padding:14,marginBottom:14,color:"#fff"}},/*#__PURE__*/React.createElement("div",{style:{fontSize:12,fontWeight:800,marginBottom:6}},"\u26A0\uFE0F \u0645\u0646\u0637\u0642\u0629 \u062E\u0637\u0631\u0629"),/*#__PURE__*/React.createElement("div",{style:{fontSize:11,opacity:0.95,lineHeight:1.6}},"\u062A\u0635\u0641\u064A\u0631 \u0627\u0644\u0646\u0638\u0627\u0645 \u064A\u062D\u0630\u0641 ",/*#__PURE__*/React.createElement("strong",null,"\u0643\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A"),": \u0627\u0644\u0645\u062E\u0632\u0648\u0646\u060C \u0627\u0644\u0637\u0644\u0628\u064A\u0627\u062A\u060C \u0627\u0644\u0639\u0645\u0644\u0627\u0621\u060C \u0627\u0644\u0645\u0648\u0631\u062F\u064A\u0646\u060C \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A\u060C \u0627\u0644\u0645\u0642\u0627\u0633\u0627\u062A\u060C \u0627\u0644\u0623\u0646\u0648\u0627\u0639\u060C \u0648\u0627\u0644\u0645\u0642\u0627\u064A\u064A\u0633.",/*#__PURE__*/React.createElement("br",null),/*#__PURE__*/React.createElement("strong",null,"\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646 \u064A\u0628\u0642\u0627\u0648 \u0645\u062D\u0641\u0648\u0638\u064A\u0646."))),me&&!isAdmin&&/*#__PURE__*/React.createElement("div",{style:{background:"#451a03",border:"1px solid #f59e0b",borderRadius:10,padding:12,marginBottom:14,color:"#fbbf24",fontSize:12,lineHeight:1.6}},"\uD83D\uDD12 \u0647\u0627\u062F \u0627\u0644\u0639\u0645\u0644\u064A\u0629 \u0645\u062A\u0627\u062D\u0629 ",/*#__PURE__*/React.createElement("strong",null,"\u0641\u0642\u0637 \u0644\u0640 admin"),". \u0623\u0646\u062A \u062F\u0627\u062E\u0644 \u0628\u0635\u0644\u0627\u062D\u064A\u0629: ",/*#__PURE__*/React.createElement("strong",null,me.role),". \u0627\u062A\u0635\u0644 \u0628\u0627\u0644\u0640 admin \u0625\u0644\u0627 \u0643\u0646\u062A \u0645\u062D\u062A\u0627\u062C \u062A\u0635\u0641\u064A\u0631."),/*#__PURE__*/React.createElement("div",{style:{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:14,marginBottom:14}},/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:10}},"\u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062D\u0627\u0644\u064A\u0629 (\u0633\u064A\u062A\u0645 \u062D\u0630\u0641\u0647\u0627)"),/*#__PURE__*/React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}},/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement("span",{style:{color:"#8b949e",fontSize:11}},"\uD83D\uDCE6 \u0623\u0635\u0646\u0627\u0641")," ",/*#__PURE__*/React.createElement("strong",{style:{color:"#e6edf3"}},itemsCount)),/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement("span",{style:{color:"#8b949e",fontSize:11}},"\u2702\uFE0F \u0637\u0644\u0628\u064A\u0627\u062A")," ",/*#__PURE__*/React.createElement("strong",{style:{color:"#e6edf3"}},ordersCount)),/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement("span",{style:{color:"#8b949e",fontSize:11}},"\uD83D\uDC65 \u0639\u0645\u0644\u0627\u0621")," ",/*#__PURE__*/React.createElement("strong",{style:{color:"#e6edf3"}},customersCount)),/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement("span",{style:{color:"#8b949e",fontSize:11}},"\uD83C\uDFED \u0645\u0648\u0631\u062F\u064A\u0646")," ",/*#__PURE__*/React.createElement("strong",{style:{color:"#e6edf3"}},suppliersCount)))),result?.done&&/*#__PURE__*/React.createElement("div",{style:{background:"#0c2818",border:"2px solid #15803d",borderRadius:12,padding:20,textAlign:"center"}},/*#__PURE__*/React.createElement("div",{style:{fontSize:36,marginBottom:8}},"\u2705"),/*#__PURE__*/React.createElement("div",{style:{color:"#3fb950",fontWeight:800,fontSize:15,marginBottom:6}},result.localOnly?"تم مسح البيانات المحلية":"تم تصفير النظام بنجاح"),result.backup_created&&/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",fontSize:11,marginBottom:12}},"\uD83D\uDCBE \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u0645\u062D\u0641\u0648\u0638\u0629"),/*#__PURE__*/React.createElement("button",{onClick:()=>location.reload(),style:{padding:"10px 24px",background:"#15803d",color:"#fff",border:"none",borderRadius:8,fontFamily:"Cairo",fontWeight:800,fontSize:13,cursor:"pointer"}},"\uD83D\uDD04 \u0625\u0639\u0627\u062F\u0629 \u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u062A\u0637\u0628\u064A\u0642")),error==="offline"&&!result?.done&&/*#__PURE__*/React.createElement("div",{style:{background:"#1c1000",border:"2px solid #92400e",borderRadius:12,padding:16,marginBottom:12}},/*#__PURE__*/React.createElement("div",{style:{color:"#fbbf24",fontWeight:800,fontSize:13,marginBottom:8}},"\u26A0\uFE0F \u0644\u0627 \u064A\u0648\u062C\u062F \u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0633\u064A\u0631\u0641\u0631"),/*#__PURE__*/React.createElement("div",{style:{color:"#d97706",fontSize:11,marginBottom:14,lineHeight:1.7}},"\u0647\u0644 \u062A\u0631\u064A\u062F \u0645\u0633\u062D \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062D\u0644\u064A\u0629 \u0641\u0642\u0637 \u0639\u0644\u0649 \u0647\u0630\u0627 \u0627\u0644\u062C\u0647\u0627\u0632\u061F",/*#__PURE__*/React.createElement("br",null),/*#__PURE__*/React.createElement("strong",null,"\u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0639\u0644\u0649 \u0627\u0644\u0633\u064A\u0631\u0641\u0631 \u0644\u0646 \u062A\u064F\u062D\u0630\u0641.")),/*#__PURE__*/React.createElement("div",{style:{display:"flex",gap:8}},/*#__PURE__*/React.createElement("button",{onClick:()=>{setError("");setShowDialog(false);setPassword("");},style:{flex:1,padding:10,background:"#21262d",color:"#8b949e",border:"1px solid #30363d",borderRadius:8,cursor:"pointer",fontFamily:"Cairo",fontWeight:700,fontSize:12}},"\u0625\u0644\u063A\u0627\u0621"),/*#__PURE__*/React.createElement("button",{onClick:handleLocalReset,style:{flex:1,padding:10,background:"#92400e",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"Cairo",fontWeight:800,fontSize:12}},"\uD83D\uDDD1 \u0645\u0633\u062D \u0627\u0644\u0645\u062D\u0644\u064A \u0641\u0642\u0637"))),!result?.done&&error!=="offline"&&/*#__PURE__*/React.createElement(React.Fragment,null,!showDialog?/*#__PURE__*/React.createElement("button",{onClick:()=>setShowDialog(true),disabled:me&&!isAdmin,style:{width:"100%",padding:14,background:me&&!isAdmin?"#3f1212":"linear-gradient(135deg,#7f1d1d,#991b1b)",color:"#fff",border:"none",borderRadius:10,cursor:me&&!isAdmin?"not-allowed":"pointer",fontFamily:"Cairo",fontSize:13,fontWeight:800,opacity:me&&!isAdmin?0.5:1}},"\uD83D\uDDD1 \u062A\u0635\u0641\u064A\u0631 \u0627\u0644\u0646\u0638\u0627\u0645"):/*#__PURE__*/React.createElement("div",{style:{background:"#161b22",border:"1px solid #f85149",borderRadius:10,padding:14}},/*#__PURE__*/React.createElement("div",{style:{color:"#f85149",fontSize:13,fontWeight:800,marginBottom:8}},"\u26A0\uFE0F \u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F\u061F"),/*#__PURE__*/React.createElement("div",{style:{color:"#e6edf3",fontSize:11,marginBottom:12,lineHeight:1.7}},"\u0647\u0627\u062F \u0627\u0644\u0639\u0645\u0644\u064A\u0629 ",/*#__PURE__*/React.createElement("strong",null,"\u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646\u0647\u0627"),". \u0633\u064A\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0642\u0628\u0644 \u0627\u0644\u062A\u0635\u0641\u064A\u0631."),/*#__PURE__*/React.createElement("div",{style:{background:"#0c2818",border:"1px solid #15803d",borderRadius:8,padding:"10px 12px",marginBottom:12,color:"#3fb950",fontSize:11,lineHeight:1.6}},"\uD83D\uDD11 \u0623\u062F\u062E\u0644 ",/*#__PURE__*/React.createElement("strong",null,"\u0643\u0644\u0645\u0629 \u0633\u0631 \u0627\u0644\u062F\u062E\u0648\u0644 \u062F\u064A\u0627\u0644\u0643")," \u0644\u0644\u062A\u0623\u0643\u064A\u062F",me&&/*#__PURE__*/React.createElement("div",{style:{marginTop:3,color:"#8b949e",fontSize:10}},"\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645: ",/*#__PURE__*/React.createElement("strong",{style:{color:"#e6edf3"}},me.username))),/*#__PURE__*/React.createElement("input",{type:"password",value:password,onChange:e=>{setPassword(e.target.value);if(error&&error!=="offline")setError("");},placeholder:"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",disabled:busy,autoFocus:true,onKeyDown:e=>{if(e.key==="Enter"&&password&&!busy)handleReset();},style:{width:"100%",padding:12,background:"#0d1117",color:"#e6edf3",border:`1px solid ${error&&error!=="offline"?"#f85149":"#30363d"}`,borderRadius:8,fontFamily:"Cairo",fontSize:16,boxSizing:"border-box",marginBottom:8,textAlign:"center",letterSpacing:6,outline:"none"}}),error&&error!=="offline"&&/*#__PURE__*/React.createElement("div",{style:{color:"#f85149",fontSize:11,marginBottom:10,padding:"6px 10px",background:"#3f1212",borderRadius:6,border:"1px solid #7f1d1d"}},"\u274C ",error),/*#__PURE__*/React.createElement("div",{style:{display:"flex",gap:8,marginTop:4}},/*#__PURE__*/React.createElement("button",{onClick:()=>{setShowDialog(false);setPassword("");setError("");},disabled:busy,style:{flex:1,padding:12,background:"#21262d",color:"#8b949e",border:"1px solid #30363d",borderRadius:8,cursor:"pointer",fontFamily:"Cairo",fontWeight:700}},"\u0625\u0644\u063A\u0627\u0621"),/*#__PURE__*/React.createElement("button",{onClick:handleReset,disabled:busy||!password,style:{flex:2,padding:12,background:busy||!password?"#3f1212":"#991b1b",color:"#fff",border:"none",borderRadius:8,cursor:busy||!password?"not-allowed":"pointer",fontFamily:"Cairo",fontWeight:800,opacity:busy||!password?0.6:1}},busy?"⏳ جاري التصفير...":"🗑 تأكيد التصفير")))));}function CustomersTab({list,onAdd,onDel,onEdit}){const EMPTY={name:"",phone:"",address:"",note:""};const[form,setForm]=useState(EMPTY);const[open,setOpen]=useState(false);const upd=(f,v)=>setForm(x=>({...x,[f]:v}));function openAdd(){setForm(EMPTY);setOpen("add");}function openEdit(c){setForm({name:c.name,phone:c.phone||"",address:c.address||"",note:c.note||""});setOpen(c.id);}function cancel(){setOpen(false);setForm(EMPTY);}function submit(){if(!form.name.trim())return;const payload={name:form.name.trim(),phone:form.phone.trim(),address:form.address.trim(),note:form.note.trim()};if(open==="add"){onAdd(payload);}else{onEdit(open,payload);}cancel();}const isEditing=open&&open!=="add";return/*#__PURE__*/React.createElement("div",null,!open?/*#__PURE__*/React.createElement(Btn,{onClick:openAdd,full:true},"\u2795 \u0625\u0636\u0627\u0641\u0629 \u0639\u0645\u064A\u0644 \u062C\u062F\u064A\u062F"):/*#__PURE__*/React.createElement(Card,{style:{marginBottom:16}},/*#__PURE__*/React.createElement(SecTitle,{icon:isEditing?"✏️":"➕"},isEditing?"تعديل العميل":"عميل جديد"),/*#__PURE__*/React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:10}},/*#__PURE__*/React.createElement(Input,{value:form.name,onChange:v=>upd("name",v),placeholder:"\u0627\u0633\u0645 \u0627\u0644\u0639\u0645\u064A\u0644 *"}),/*#__PURE__*/React.createElement(Input,{value:form.phone,onChange:v=>upd("phone",v),placeholder:"\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641",type:"tel"}),/*#__PURE__*/React.createElement(Input,{value:form.address,onChange:v=>upd("address",v),placeholder:"\u0627\u0644\u0639\u0646\u0648\u0627\u0646"}),/*#__PURE__*/React.createElement(Input,{value:form.note,onChange:v=>upd("note",v),placeholder:"\u0645\u0644\u0627\u062D\u0638\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)"}),/*#__PURE__*/React.createElement("div",{style:{display:"flex",gap:8}},/*#__PURE__*/React.createElement(Btn,{onClick:cancel,secondary:true,full:true},"\u0625\u0644\u063A\u0627\u0621"),/*#__PURE__*/React.createElement(Btn,{onClick:submit,full:true,disabled:!form.name.trim()},"\u062D\u0641\u0638")))),/*#__PURE__*/React.createElement("div",{style:{marginTop:16,display:"flex",flexDirection:"column",gap:10}},list.length===0&&/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",textAlign:"center",padding:30,fontSize:13}},"\u0644\u0627 \u064A\u0648\u062C\u062F \u0639\u0645\u0644\u0627\u0621 \u0628\u0639\u062F"),list.map(c=>/*#__PURE__*/React.createElement(Card,{key:c.id,style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}},/*#__PURE__*/React.createElement("div",{style:{flex:1,minWidth:0}},/*#__PURE__*/React.createElement("div",{style:{color:"#e6edf3",fontWeight:700,fontSize:13}},c.name),c.phone&&/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",fontSize:11,marginTop:3}},"\uD83D\uDCDE ",c.phone),c.address&&/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",fontSize:11,marginTop:2}},"\uD83D\uDCCD ",c.address),c.note&&/*#__PURE__*/React.createElement("div",{style:{color:"#94a3b8",fontSize:11,marginTop:2,fontStyle:"italic"}},c.note)),/*#__PURE__*/React.createElement("div",{style:{display:"flex",gap:6,flexShrink:0}},/*#__PURE__*/React.createElement("button",{onClick:()=>openEdit(c),style:{background:"none",border:"none",color:"#58a6ff",cursor:"pointer",fontSize:16},title:"\u062A\u0639\u062F\u064A\u0644"},"\u270F\uFE0F"),/*#__PURE__*/React.createElement("button",{onClick:()=>{if(confirm(`حذف العميل "${c.name}"؟`))onDel(c.id);},style:{background:"none",border:"none",color:"#f85149",cursor:"pointer",fontSize:16},title:"\u062D\u0630\u0641"},"\uD83D\uDDD1"))))));}function SuppliersTab({list,onAdd,onDel}){const[form,setForm]=useState({name:"",phone:"",address:""});const[open,setOpen]=useState(false);const upd=(f,v)=>setForm(x=>({...x,[f]:v}));function submit(){if(!form.name.trim())return;onAdd({name:form.name.trim(),phone:form.phone.trim(),address:form.address.trim()});setForm({name:"",phone:"",address:""});setOpen(false);}return/*#__PURE__*/React.createElement("div",null,!open?/*#__PURE__*/React.createElement(Btn,{onClick:()=>setOpen(true),full:true},"+ \u0625\u0636\u0627\u0641\u0629 \u0645\u0648\u0631\u062F"):/*#__PURE__*/React.createElement(Card,{style:{marginBottom:16}},/*#__PURE__*/React.createElement(SecTitle,{icon:"\u2795"},"\u0645\u0648\u0631\u062F \u062C\u062F\u064A\u062F"),/*#__PURE__*/React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:10}},/*#__PURE__*/React.createElement(Input,{value:form.name,onChange:v=>upd("name",v),placeholder:"\u0627\u0633\u0645 \u0627\u0644\u0645\u0648\u0631\u062F *"}),/*#__PURE__*/React.createElement(Input,{value:form.phone,onChange:v=>upd("phone",v),placeholder:"\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641",type:"tel"}),/*#__PURE__*/React.createElement(Input,{value:form.address,onChange:v=>upd("address",v),placeholder:"\u0627\u0644\u0639\u0646\u0648\u0627\u0646"}),/*#__PURE__*/React.createElement("div",{style:{display:"flex",gap:8}},/*#__PURE__*/React.createElement(Btn,{onClick:()=>setOpen(false),secondary:true,full:true},"\u0625\u0644\u063A\u0627\u0621"),/*#__PURE__*/React.createElement(Btn,{onClick:submit,full:true,disabled:!form.name.trim()},"\u062D\u0641\u0638")))),/*#__PURE__*/React.createElement("div",{style:{marginTop:16,display:"flex",flexDirection:"column",gap:10}},list.length===0&&/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",textAlign:"center",padding:30,fontSize:13}},"\u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u0648\u0631\u062F\u0648\u0646 \u0628\u0639\u062F"),list.map(s=>/*#__PURE__*/React.createElement(Card,{key:s.id,style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}},/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement("div",{style:{color:"#e6edf3",fontWeight:700}},s.name),s.phone&&/*#__PURE__*/React.createElement("a",{href:`tel:${s.phone}`,style:{color:"#3fb950",fontSize:13,textDecoration:"none",display:"block",marginTop:3}},"\uD83D\uDCDE ",s.phone),s.address&&/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",fontSize:12,marginTop:2}},"\uD83D\uDCCD ",s.address)),/*#__PURE__*/React.createElement("button",{onClick:()=>onDel(s.id),style:{background:"none",border:"none",color:"#f85149",fontSize:20,cursor:"pointer"}},"\uD83D\uDDD1")))));}/* ══ CATEGORIES TAB — تصنيفات المخزون مع عرض عدد الأصناف ══ */function CategoriesTab({db,onAdd,onDel}){const[val,setVal]=useState("");const list=(db.categories||[]).filter(c=>!c.deleted_at&&c.name!==READY_CAT_NAME);const items=(db.items||[]).filter(i=>!i.deleted_at&&!i.sourceOrderId);// إحصائيات لكل تصنيف
const counts={};let uncategorized=0;for(const it of items){if(it.categoryId)counts[it.categoryId]=(counts[it.categoryId]||0)+1;else uncategorized++;}function submit(){const t=val.trim();if(!t)return;// مانضيفش إذا الاسم موجود
const exists=list.some(c=>(c.name||"").trim().toLowerCase()===t.toLowerCase());if(exists){alert("هاد التصنيف موجود من قبل");return;}onAdd(t);setVal("");}function handleDelete(cat){const n=counts[cat.id]||0;if(n>0){const ok=confirm(`⚠️ تنبيه: التصنيف "${cat.name}" مستعمل ف ${n} ${n===1?"صنف":"أصناف"}.\n\n`+`إلا حذفتو، هاد الأصناف غادي تبقى بلا تصنيف ("بدون تصنيف"). تابع؟`);if(!ok)return;}else{const ok=confirm(`حذف التصنيف "${cat.name}"؟`);if(!ok)return;}onDel(cat.id);}return/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement(Card,{style:{marginBottom:14,padding:14,background:"#0c2818",border:"1px solid #15803d"}},/*#__PURE__*/React.createElement("div",{style:{color:"#3fb950",fontSize:12,fontWeight:700,marginBottom:6}},"\uD83D\uDCC1 \u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0627\u0644\u0645\u062E\u0632\u0648\u0646"),/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",fontSize:11,lineHeight:1.6}},"\u0639\u0631\u0641 \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0627\u0644\u0644\u064A \u0639\u0646\u062F\u0643 \u0641 \u0627\u0644\u0645\u0639\u0645\u0644\u060C \u0645\u062B\u0644\u0627\u064B: ",/*#__PURE__*/React.createElement("strong",{style:{color:"#e6edf3"}},"\u0642\u0645\u0627\u0634"),"\u060C ",/*#__PURE__*/React.createElement("strong",{style:{color:"#e6edf3"}},"\u0625\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062A"),"\u060C",/*#__PURE__*/React.createElement("strong",{style:{color:"#e6edf3"}}," \u0628\u0636\u0627\u0626\u0639 \u062C\u0627\u0647\u0632\u0629"),"\u060C ",/*#__PURE__*/React.createElement("strong",{style:{color:"#e6edf3"}},"\u062E\u064A\u0648\u0637"),"... \u0639\u0646\u062F \u0625\u0636\u0627\u0641\u0629 \u0635\u0646\u0641 \u0641 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0643\u062A\u062E\u062A\u0627\u0631 \u0627\u0644\u062A\u0635\u0646\u064A\u0641 \u062F\u064A\u0627\u0644\u0648 \u0648\u0627\u0644\u0646\u0648\u0639 (\u0628\u0627\u0644\u0642\u064A\u0627\u0633 \u0648\u0644\u0627 \u0628\u0627\u0644\u0643\u0645\u064A\u0629).")),/*#__PURE__*/React.createElement(Card,{style:{marginBottom:16}},/*#__PURE__*/React.createElement(SecTitle,{icon:"\u2795"},"\u0625\u0636\u0627\u0641\u0629 \u062A\u0635\u0646\u064A\u0641 \u062C\u062F\u064A\u062F"),/*#__PURE__*/React.createElement("div",{style:{display:"flex",gap:8}},/*#__PURE__*/React.createElement(Input,{value:val,onChange:setVal,placeholder:"\u0645\u062B\u0627\u0644: \u0642\u0645\u0627\u0634\u060C \u0625\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062A\u060C \u0628\u0636\u0627\u0626\u0639 \u062C\u0627\u0647\u0632\u0629...",style:{flex:1}}),/*#__PURE__*/React.createElement(Btn,{onClick:submit,disabled:!val.trim()},"\u0625\u0636\u0627\u0641\u0629"))),/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",fontSize:11,fontWeight:700,marginBottom:8,padding:"0 4px"}},"\uD83D\uDCCB \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0627\u0644\u0645\u0648\u062C\u0648\u062F\u0629 (",list.length,")"),list.length===0?/*#__PURE__*/React.createElement("div",{style:{textAlign:"center",padding:30,color:"#8b949e",fontSize:13,background:"#161b22",borderRadius:10,border:"1px dashed #30363d"}},"\uD83D\uDCC1 \u0645\u0627 \u0643\u0627\u064A\u0646 \u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0628\u0639\u062F",/*#__PURE__*/React.createElement("div",{style:{fontSize:11,marginTop:6,opacity:0.7}},"\u0632\u064A\u062F \u0627\u0644\u062A\u0635\u0646\u064A\u0641 \u0627\u0644\u0623\u0648\u0644 \u0645\u0646 \u0641\u0648\u0642")):/*#__PURE__*/React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8}},list.map(cat=>{const n=counts[cat.id]||0;return/*#__PURE__*/React.createElement("div",{key:cat.id,style:{display:"flex",alignItems:"center",gap:10,background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:"12px 14px"}},/*#__PURE__*/React.createElement("span",{style:{fontSize:22}},"\uD83D\uDCC1"),/*#__PURE__*/React.createElement("div",{style:{flex:1,minWidth:0}},/*#__PURE__*/React.createElement("div",{style:{color:"#e6edf3",fontWeight:700,fontSize:14}},cat.name),/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",fontSize:11,marginTop:2}},n===0?"لا يوجد أصناف":`${n} ${n===1?"صنف":"أصناف"}`)),n>0&&/*#__PURE__*/React.createElement("span",{style:{background:"#1e3a8a",color:"#93c5fd",padding:"3px 10px",borderRadius:14,fontSize:11,fontWeight:700}},n),/*#__PURE__*/React.createElement("button",{onClick:()=>handleDelete(cat),style:{background:"none",border:"none",color:"#f85149",fontSize:18,cursor:"pointer",padding:"4px 8px",lineHeight:1},title:"\u062D\u0630\u0641"},"\u2715"));})),uncategorized>0&&/*#__PURE__*/React.createElement("div",{style:{marginTop:14,padding:"10px 14px",background:"#21262d",border:"1px solid #30363d",borderRadius:10,display:"flex",alignItems:"center",gap:10}},/*#__PURE__*/React.createElement("span",{style:{fontSize:18}},"\u26AA"),/*#__PURE__*/React.createElement("div",{style:{flex:1}},/*#__PURE__*/React.createElement("div",{style:{color:"#e6edf3",fontSize:12,fontWeight:700}},"\u0623\u0635\u0646\u0627\u0641 \u0628\u062F\u0648\u0646 \u062A\u0635\u0646\u064A\u0641"),/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",fontSize:10,marginTop:2}},"\u0623\u0635\u0646\u0627\u0641 \u0642\u062F\u064A\u0645\u0629 \u0623\u0646\u0634\u0626\u062A \u0642\u0628\u0644 \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A")),/*#__PURE__*/React.createElement("span",{style:{background:"#0d1117",color:"#8b949e",padding:"3px 10px",borderRadius:14,fontSize:11,fontWeight:700}},uncategorized)));}function SimpleTab({label,list,onAdd,onDel,placeholder}){const[val,setVal]=useState("");function submit(){if(!val.trim())return;onAdd(val.trim());setVal("");}return/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement(Card,{style:{marginBottom:16}},/*#__PURE__*/React.createElement(SecTitle,{icon:"\u2795"},"\u0625\u0636\u0627\u0641\u0629 ",label),/*#__PURE__*/React.createElement("div",{style:{display:"flex",gap:8}},/*#__PURE__*/React.createElement(Input,{value:val,onChange:setVal,placeholder:placeholder,style:{flex:1}}),/*#__PURE__*/React.createElement(Btn,{onClick:submit,disabled:!val.trim()},"\u0625\u0636\u0627\u0641\u0629"))),/*#__PURE__*/React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:8}},list.length===0&&/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",fontSize:13,padding:"10px 0"}},"\u0644\u0627 \u064A\u0648\u062C\u062F ",label," \u0628\u0639\u062F"),list.map(item=>/*#__PURE__*/React.createElement("div",{key:item.id,style:{display:"flex",alignItems:"center",gap:6,background:"#21262d",border:"1px solid #30363d",borderRadius:20,padding:"7px 14px",fontSize:13,color:"#e6edf3"}},item.name,/*#__PURE__*/React.createElement("button",{onClick:()=>onDel(item.id),style:{background:"none",border:"none",color:"#f85149",fontSize:14,cursor:"pointer",padding:0,lineHeight:1}},"\u2715")))));}/* ══ PRINT VIEW (تقرير المخزون الشامل) ══
 * يدعم نوعين من المخزون (roll/bulk) ويجمع حسب التصنيف.
 * - الـ KPIs ف الـ cover تفصل بين النوعين
 * - كل صنف يـ render حسب نوعو
 * - الـ summary table فيه عمود النوع والتصنيف
 */