/* ══════════════════════════════════════════════════════════════
   GEMINI MULTI-KEY ENGINE
   يدير 3 مفاتيح Gemini API مع تبديل تلقائي عند بلوغ الحد
   يُحقن في كل fetch يذهب لـ generativelanguage.googleapis.com
══════════════════════════════════════════════════════════════ */
(function(){
  const KEYS_KEY = "stk-gemini-keys-v1";
  const IDX_KEY  = "stk-gemini-idx-v1";
  const OLD_KEY  = "creativa_gemini_key";

  function getKeys(){
    try{ return JSON.parse(localStorage.getItem(KEYS_KEY)||"[]"); }catch{ return []; }
  }
  function getIdx(){
    return parseInt(localStorage.getItem(IDX_KEY)||"0")||0;
  }
  function setIdx(i){
    localStorage.setItem(IDX_KEY, String(i));
    window.__stkGeminiIdx = i;
  }

  // هجرة المفتاح القديم
  (function migrate(){
    var old = localStorage.getItem(OLD_KEY);
    var keys = getKeys();
    if(old && keys.length === 0){
      localStorage.setItem(KEYS_KEY, JSON.stringify([old]));
      localStorage.removeItem(OLD_KEY);
    }
  })();

  // دالة عامة: إرجاع المفتاح النشط
  window.__stkGetGeminiKey = function(){
    var keys = getKeys();
    if(!keys.length) return localStorage.getItem(OLD_KEY)||"";
    var idx = Math.min(getIdx(), keys.length-1);
    return keys[idx]||"";
  };

  // دالة عامة: التبديل للمفتاح التالي
  window.__stkRotateGeminiKey = function(){
    var keys = getKeys();
    if(keys.length <= 1) return false;
    var next = (getIdx()+1) % keys.length;
    setIdx(next);
    console.log("[Gemini] 🔄 تبديل للمفتاح #"+(next+1));
    return true;
  };

  // اعتراض fetch لـ Gemini — إضافة تبديل تلقائي عند quota/limit
  var _origFetch = window.fetch.bind(window);
  window.fetch = function(input, init){
    var url = (typeof input === "string") ? input : (input && input.url ? input.url : "");

    // فقط طلبات Gemini
    if(!url.includes("generativelanguage.googleapis.com")){
      return _origFetch(input, init);
    }

    var keys = getKeys();
    if(!keys.length) return _origFetch(input, init);

    // استبدال المفتاح في الـ URL بالمفتاح الحالي
    function injectKey(u, k){
      return u.replace(/([?&]key=)[^&]*/g, "$1"+k);
    }

    // نحاول مع كل المفاتيح بالترتيب
    async function tryWithKeys(startIdx){
      var tried = 0;
      var idx = startIdx;
      while(tried < keys.length){
        var k = keys[idx];
        var newUrl = injectKey(url, k);
        var newInput = (typeof input === "string") ? newUrl : Object.assign({}, input, {url: newUrl});
        try{
          var res = await _origFetch(newInput, init);
          if(res.ok){
            if(idx !== getIdx()) setIdx(idx);
            return res;
          }
          // 429 = quota exhausted → جرّب التالي
          if(res.status === 429 || res.status === 403){
            console.warn("[Gemini] مفتاح #"+(idx+1)+" وصل للحد — تبديل...");
            idx = (idx+1) % keys.length;
            tried++;
            continue;
          }
          // خطأ آخر → أعده كما هو
          if(idx !== getIdx()) setIdx(idx);
          return res;
        }catch(e){
          idx = (idx+1) % keys.length;
          tried++;
        }
      }
      // كل المفاتيح فشلت — إرجاع آخر استجابة
      var k = keys[startIdx % keys.length];
      return _origFetch(injectKey(typeof input==="string"?input:input.url||"", k), init);
    }

    return tryWithKeys(Math.min(getIdx(), keys.length-1));
  };

  console.log("[Gemini] ✅ Multi-key engine نشط — "+getKeys().length+" مفتاح");
})();
