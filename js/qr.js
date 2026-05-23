/* ══ مكوّن QR المشاركة الداخلي ══ */
function ShareDeviceQR(){
  var [show, setShow] = React.useState(false);
  var canvasRef = React.useRef(null);
  var lic = typeof window.__stkGetShareQR === "function" ? window.__stkGetShareQR() : null;
  var deviceLimit = (lic && lic.devices) ? lic.devices : 1;

  React.useEffect(function(){
    if(show && canvasRef.current && lic && typeof QRCode !== "undefined"){
      QRCode.toCanvas(canvasRef.current, JSON.stringify(lic), {
        width: 220, margin: 1, color: { dark: "#000000", light: "#ffffff" }
      }).catch(console.error);
    }
  }, [show]);

  if(!lic) return null;

  return React.createElement("div", {
    style: {
      background: "#0a1a1a",
      border: "1px solid #134e4a",
      borderRadius: 14, padding: 16
    }
  },

    // ── رأس البطاقة ──
    React.createElement("div", {
      style: {
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 12
      }
    },
      React.createElement("div", null,
        React.createElement("div", {
          style: { fontSize: 13, fontWeight: 800, color: "#2dd4bf", marginBottom: 4 }
        }, "📱 مشاركة مع جهاز آخر"),
        React.createElement("div", {
          style: {
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#0f3460", border: "1px solid #1e5a9a",
            borderRadius: 20, padding: "3px 10px"
          }
        },
          React.createElement("span", { style: { fontSize: 12 } }, "📱"),
          React.createElement("span", { style: { color: "#93c5fd", fontSize: 11, fontWeight: 700 } },
            "الحد الأقصى: " + deviceLimit + (deviceLimit === 1 ? " جهاز" : " أجهزة")
          )
        )
      ),
      React.createElement("button", {
        onClick: function(){ setShow(function(v){ return !v; }); },
        style: {
          background: show ? "#134e4a" : "#0f3460",
          border: "1px solid " + (show ? "#2dd4bf40" : "#134e4a"),
          color: show ? "#2dd4bf" : "#93c5fd",
          borderRadius: 8, padding: "7px 16px",
          fontFamily: "Cairo,sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer",
          transition: "all 0.2s", flexShrink: 0
        }
      }, show ? "إخفاء" : "عرض QR")
    ),

    // ── تلميح ──
    React.createElement("div", {
      style: {
        fontSize: 11, color: "#6b7280", lineHeight: 1.7,
        marginBottom: show ? 14 : 0
      }
    },
      "امسح هذا الـ QR من تطبيق العميل على الجهاز الآخر",
      React.createElement("br", null),
      "ليتفعّل فوراً بنفس بيانات شركتك"
    ),

    // ── QR ──
    show && React.createElement("div", {
      style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }
    },
      React.createElement("div", {
        style: {
          background: "#fff", padding: 16, borderRadius: 14,
          boxShadow: "0 4px 24px #2dd4bf20"
        }
      },
        React.createElement("canvas", { ref: canvasRef })
      ),
      React.createElement("div", {
        style: {
          fontSize: 10, color: "#4b5563", textAlign: "center", lineHeight: 1.8,
          background: "#0f1f1f", border: "1px solid #1f3f3f",
          borderRadius: 8, padding: "8px 14px"
        }
      },
        "⏱ رابط التفعيل صالح لمرة واحدة — لا تشاركه خارج شركتك"
      )
    )
  );
}

function AISettingsTab(){const[key,setKey]=useState(()=>localStorage.getItem(AI_KEY_STORAGE)||"");const[saved,setSaved]=useState(()=>!!localStorage.getItem(AI_KEY_STORAGE));const[show,setShow]=useState(false);function save(){const v=key.trim();if(!v){alert("أدخل المفتاح أولاً");return;}localStorage.setItem(AI_KEY_STORAGE,v);setSaved(true);}function clear(){if(!confirm("حذف مفتاح Gemini API؟"))return;localStorage.removeItem(AI_KEY_STORAGE);setKey("");setSaved(false);}const inp={flex:1,padding:"10px 12px",background:"#0d1117",border:"1px solid #30363d",borderRadius:8,color:"#e6edf3",fontFamily:"Cairo,sans-serif",fontSize:13,outline:"none",direction:"ltr"};return/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement("div",{style:{background:"linear-gradient(135deg,#1e1b4b,#2e1065)",borderRadius:10,padding:14,marginBottom:16,color:"#fff"}},/*#__PURE__*/React.createElement("div",{style:{fontSize:12,fontWeight:800,letterSpacing:1}},"\uD83E\uDDE0 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A"),/*#__PURE__*/React.createElement("div",{style:{fontSize:11,opacity:0.8,marginTop:4}},"\u0645\u0641\u062A\u0627\u062D Gemini API \u0644\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0623\u062B\u0648\u0627\u0628 \u0648\u0643\u0634\u0641 \u0627\u0644\u0623\u0644\u0648\u0627\u0646")),/*#__PURE__*/React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,padding:12,background:saved?"#0c2818":"#1f1010",border:`1px solid ${saved?"#15803d":"#7f1d1d"}`,borderRadius:10,marginBottom:14}},/*#__PURE__*/React.createElement("span",{style:{fontSize:20}},saved?"✅":"⚠️"),/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement("div",{style:{color:saved?"#3fb950":"#f87171",fontWeight:700,fontSize:13}},saved?"المفتاح محفوظ وجاهز للاستخدام":"لا يوجد مفتاح — التحليل معطل"),/*#__PURE__*/React.createElement("div",{style:{color:"#6b7280",fontSize:10,marginTop:2}},saved?"يمكنك تعديله أو حذفه في أي وقت":"أضف مفتاحك للاستفادة من التحليل الآلي"))),/*#__PURE__*/React.createElement("div",{style:{marginBottom:10}},/*#__PURE__*/React.createElement("label",{style:{color:"#8b949e",fontSize:11,fontWeight:700,display:"block",marginBottom:6}},"\u0645\u0641\u062A\u0627\u062D Gemini API"),/*#__PURE__*/React.createElement("div",{style:{display:"flex",gap:8}},/*#__PURE__*/React.createElement("input",{type:show?"text":"password",style:inp,placeholder:"AIzaSy...",value:key,onChange:e=>{setKey(e.target.value);setSaved(false);}}),/*#__PURE__*/React.createElement("button",{onClick:()=>setShow(s=>!s),style:{padding:"10px 12px",background:"#21262d",border:"1px solid #30363d",borderRadius:8,color:"#8b949e",cursor:"pointer",fontSize:14}},show?"🙈":"👁"))),/*#__PURE__*/React.createElement("div",{style:{display:"flex",gap:8,marginBottom:16}},/*#__PURE__*/React.createElement("button",{onClick:save,style:{flex:1,padding:12,background:"#1e40af",color:"#fff",border:"none",borderRadius:8,fontFamily:"Cairo,sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}},"\uD83D\uDCBE \u062D\u0641\u0638 \u0627\u0644\u0645\u0641\u062A\u0627\u062D"),saved&&/*#__PURE__*/React.createElement("button",{onClick:clear,style:{padding:"12px 16px",background:"#1f1010",color:"#f87171",border:"1px solid #7f1d1d",borderRadius:8,fontFamily:"Cairo,sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}},"\uD83D\uDDD1")),/*#__PURE__*/React.createElement("div",{style:{background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:14}},/*#__PURE__*/React.createElement("div",{style:{color:"#e6edf3",fontWeight:700,fontSize:12,marginBottom:10}},"\uD83D\uDCD6 \u0643\u064A\u0641 \u062A\u062D\u0635\u0644 \u0639\u0644\u0649 \u0645\u0641\u062A\u0627\u062D \u0645\u062C\u0627\u0646\u064A\u061F"),["افتح aistudio.google.com","سجل دخول بحساب Google",'اضغط "Get API Key" ثم "Create API key"',"انسخ المفتاح والصقه هنا"].map((step,i)=>/*#__PURE__*/React.createElement("div",{key:i,style:{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}},/*#__PURE__*/React.createElement("div",{style:{width:20,height:20,borderRadius:"50%",background:"#1e40af",color:"#fff",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}},i+1),/*#__PURE__*/React.createElement("div",{style:{color:"#8b949e",fontSize:12}},step))),/*#__PURE__*/React.createElement("a",{href:"https://aistudio.google.com/apikey",target:"_blank",style:{display:"block",textAlign:"center",padding:"10px 0",marginTop:6,background:"linear-gradient(135deg,#1e3a8a,#1e40af)",color:"#60a5fa",borderRadius:8,fontWeight:700,fontSize:12,textDecoration:"none"}},"\uD83D\uDD17 \u0641\u062A\u062D Google AI Studio")));}
