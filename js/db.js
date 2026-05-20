// ══════════════════════════════════════════════════════════════
// IndexedDB — للبيانات الكبيرة (بدل localStorage المحدود بـ 5MB)
// ══════════════════════════════════════════════════════════════
const IDB=(()=>{const DB_NAME="stk-idb-v1";const STORE="kv";let _idb=null;const _mem={};// كاش في الذاكرة — يسمح بقراءة متزامنة
function _open(){if(_idb)return Promise.resolve(_idb);return new Promise((res,rej)=>{const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=e=>e.target.result.createObjectStore(STORE);req.onsuccess=e=>{_idb=e.target.result;res(_idb);};req.onerror=e=>rej(e.target.error);});}function _write(key,value){_open().then(db=>{const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).put(value,key);}).catch(()=>{});}// يُستدعى مرة واحدة عند بداية التطبيق
// يحمّل البيانات من IDB ويهاجر تلقائياً من localStorage
async function init(keys){try{const db=await _open();const tx=db.transaction(STORE,"readonly");const st=tx.objectStore(STORE);await Promise.all(keys.map(key=>new Promise(res=>{const req=st.get(key);req.onsuccess=()=>{if(req.result!==undefined){_mem[key]=req.result;// موجود في IDB
}else{// هجرة تلقائية من localStorage — مرة واحدة فقط
try{const raw=localStorage.getItem(key);if(raw){_mem[key]=JSON.parse(raw);_write(key,_mem[key]);localStorage.removeItem(key);}}catch{}}res();};req.onerror=()=>res();})));}catch(e){// IDB غير متاح (وضع خاص) — نرجع للذاكرة فقط
console.warn("IDB unavailable:",e);}}function get(key,fallback){return key in _mem?_mem[key]:fallback;}function set(key,value){_mem[key]=value;_write(key,value);return true;}function remove(key){delete _mem[key];_open().then(db=>{const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).delete(key);}).catch(()=>{});}return{init,get,set,remove};})();// ── Device ID (لتجنب تكرار sync للجهاز نفسو)
function getDeviceId(){let m=lsGet(META_KEY,null);if(!m||!m.deviceId){m={deviceId:"dev_"+Math.random().toString(36).slice(2,10),lastSync:0};lsSet(META_KEY,m);}return m.deviceId;}function getMeta(){return IDB.get(META_KEY,{deviceId:getDeviceId(),lastSync:0});}function setMeta(m){IDB.set(META_KEY,m);}// ── DB helpers
function dbGet(){return IDB.get(DB_KEY,INIT_DB);}function dbSet(data){IDB.set(DB_KEY,data);}// ── Pending queue (تعديلات ما تزامنتش بعد)
function pendingGet(){return IDB.get(PENDING_KEY,{factories:[],suppliers:[],customers:[],types:[],measures:[],packagings:[],categories:[],sizes:[],items:[],orders:[],invoices:[]});}function pendingAdd(table,record){const p=pendingGet();if(!p[table])p[table]=[];const idx=p[table].findIndex(r=>r.id===record.id);if(idx>=0)p[table][idx]=record;else p[table].push(record);IDB.set(PENDING_KEY,p);}function pendingClear(){IDB.set(PENDING_KEY,{factories:[],suppliers:[],customers:[],types:[],measures:[],packagings:[],categories:[],sizes:[],items:[],orders:[],invoices:[]});}function pendingCount(){const p=pendingGet();return["factories","suppliers","customers","types","measures","packagings","categories","sizes","items","orders","invoices"].reduce((s,k)=>s+(p[k]?.length||0),0);}// ── Offline-first: user + factory info مخزنة محلياً
function localUserGet(){return lsGet(USER_KEY,null);}function localUserSet(u){if(u)lsSet(USER_KEY,u);else try{localStorage.removeItem(USER_KEY);}catch{}}function localFactoryGet(){return lsGet(FACTORY_KEY,null);}function localFactorySet(f){if(f)lsSet(FACTORY_KEY,f);else try{localStorage.removeItem(FACTORY_KEY);}catch{}}// ── بيانات الدخول المشفرة — تُخزّن بعد كل دخول ناجح للسماح بالدخول بدون سيرفر
async function hashPassword(password){try{const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(password+"stk-salt-2026"));return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");}catch{// fallback بسيط إذا crypto.subtle غير متاح
let h=0;for(let i=0;i<password.length;i++)h=(h<<5)-h+password.charCodeAt(i)|0;return"fallback_"+Math.abs(h).toString(16);}}async function saveOfflineCreds(username,password){const hash=await hashPassword(password);lsSet(CREDS_KEY,{username,hash,savedAt:Date.now()});}function getOfflineCreds(){return lsGet(CREDS_KEY,null);}async function verifyOfflineCreds(username,password){const saved=getOfflineCreds();if(!saved||saved.username!==username)return false;const hash=await hashPassword(password);return hash===saved.hash;}function clearOfflineCreds(){try{localStorage.removeItem(CREDS_KEY);}catch{}}// ── ID generator و timestamp
function genId(){return"id_"+Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);}function nowMs(){return Date.now();}// ── Local mutation (يحدث localStorage + يزيد لـ pending)
// type: "supplier"|"type"|"measure"|"item"|"category"|...
// record: الكائن كامل (مع id)
// deleted: true/false
//
// خريطة الجمع — مهمة باش "category" → "categories" ماشي "categorys"
const PLURAL_MAP={factory:"factories",supplier:"suppliers",customer:"customers",type:"types",measure:"measures",packaging:"packagings",category:"categories",size:"sizes",item:"items",order:"orders",invoice:"invoices"};function localMutate(type,record,deleted=false){const table=PLURAL_MAP[type]||type+"s";const db=dbGet();const now=nowMs();// نبني الـ record مع updated_at
const full={...record,updated_at:now,deleted_at:deleted?now:null};// ── تحديث الـ DB المحلي
if(!db[table])db[table]=[];const idx=db[table].findIndex(r=>r.id===full.id);if(deleted){if(idx>=0)db[table].splice(idx,1);// نحيدو من الـ UI
}else{if(idx>=0)db[table][idx]=full;else db[table].unshift(full);}db.ts=now;dbSet(db);// ── زيادة للـ pending
pendingAdd(table,full);return full;}// ── Token storage (أكثر موثوقية من الكوكيز عبر الشبكة)
const TOKEN_KEY="auth_token_v1";function getAuthToken(){try{return localStorage.getItem(TOKEN_KEY)||"";}catch{return"";}}function setAuthToken(t){try{if(t)localStorage.setItem(TOKEN_KEY,t);else localStorage.removeItem(TOKEN_KEY);}catch{}}// ── API call (مع timeout + Bearer token)
async function apiCall(path,opts={}){const ctrl=new AbortController();const timeoutId=setTimeout(()=>ctrl.abort(),opts.timeout||10000);const token=getAuthToken();const authHeader=token?{"Authorization":"Bearer "+token}:{};// ngrok: هذا الرأس يتجاوز صفحة التحذير
const ngrokHeader={"ngrok-skip-browser-warning":"true"};try{const res=await fetch(path,{credentials:"include",headers:{"Content-Type":"application/json",...ngrokHeader,...authHeader,...(opts.headers||{})},signal:ctrl.signal,...opts});clearTimeout(timeoutId);if(res.status===401)throw{auth:true,status:401};if(!res.ok){let err;try{err=await res.json();}catch{err={error:res.statusText};}throw{...err,status:res.status};}return await res.json();}catch(e){clearTimeout(timeoutId);if(e.auth)throw e;// network error, timeout, CORS, etc.
throw{network:true,error:e.message||"اتصال فاشل"};}}const API={info:()=>apiCall("/api/info"),login:(username,pwd)=>apiCall("/api/login",{method:"POST",body:JSON.stringify({username,password:pwd})}),logout:()=>apiCall("/api/logout",{method:"POST"}),me:()=>apiCall("/api/me"),snapshot:()=>apiCall("/api/snapshot"),delta:since=>apiCall(`/api/delta?since=${since||0}`),push:changes=>apiCall("/api/push",{method:"POST",body:JSON.stringify(changes)}),ping:()=>apiCall("/api/ping"),factoryReset:password=>apiCall("/api/factory-reset",{method:"POST",body:JSON.stringify({password})}),saveSettings:data=>apiCall("/api/settings",{method:"POST",body:JSON.stringify(data)}),setOrderStatus:(orderId,status,note)=>apiCall(`/api/orders/${orderId}/set-status`,{method:"PATCH",body:JSON.stringify({status,note:note||""})})};// ── Merge: دمج delta من السيرفر مع الـ DB المحلي (LWW)
function mergeDelta(localDb,serverDelta){const db={...localDb};const pending=pendingGet();for(const table of["factories","suppliers","customers","types","measures","packagings","categories","sizes","items","orders","invoices"]){if(!db[table])db[table]=[];const serverRecs=serverDelta[table]||[];for(const srv of serverRecs){const idx=db[table].findIndex(r=>r.id===srv.id);const local=idx>=0?db[table][idx]:null;const localTs=local?.updated_at||0;const srvTs=srv.updated_at||0;const isPending=!!(pending[table]||[]).find(function(r){return r.id===srv.id;});const serverIsNewer=srvTs>localTs+(isPending?5000:0);// LWW مع حماية الـ pending
// استثناء: السيرفر يعطي orderNumber لطلبية جديدة حتى لو srvTs == localTs
const srvHasOrderNum=table==="orders"&&(srv.orderNumber||0)>0;const localMissingOrderNum=!local||!local.orderNumber||local.orderNumber===0;if(serverIsNewer||srvHasOrderNum&&localMissingOrderNum){if(srv.deleted_at){if(idx>=0)db[table].splice(idx,1);}else{// نحيد الـ tombstone fields قبل الحفظ
const clean={...srv};delete clean.deleted_at;if(idx>=0)db[table][idx]=clean;else db[table].unshift(clean);}}// إلا كان الجهاز أحدث، كاين pending → يتبعت ف المرة الجاية
}}db.ts=Math.max(db.ts||0,serverDelta.ts||0);return db;}// ── Sync cycle: push pending → pull delta → merge
// returns: {ok, pushed, pulled, error}
async function syncCycle(){const meta=getMeta();const pending=pendingGet();const pendingTotal=pendingCount();let pushedCount=0;let pulledCount=0;// 1. Push pending إذا كاين
if(pendingTotal>0){try{const r=await API.push(pending);const ap=r.applied||{};pushedCount=(ap.factories||0)+(ap.suppliers||0)+(ap.customers||0)+(ap.categories||0)+(ap.types||0)+(ap.measures||0)+(ap.packagings||0)+(ap.sizes||0)+(ap.items||0)+(ap.orders||0)+(ap.invoices||0);pendingClear();// ── تطبيق أرقام الطلبيات المخصصة من السيرفر فوراً
const serverOrderNums=r.orderNumbers||{};if(Object.keys(serverOrderNums).length>0){const current=dbGet();const updatedOrders=(current.orders||[]).map(o=>{if(serverOrderNums[o.id]&&(!o.orderNumber||o.orderNumber===0)){return{...o,orderNumber:serverOrderNums[o.id]};}return o;});dbSet({...current,orders:updatedOrders});}// ── بعد push ناجح: نجلب delta بدل snapshot كامل — أسرع بكثير
if(pushedCount>0){try{const currentMeta=getMeta();const freshDelta=await API.delta(currentMeta.lastSync||0);const serverResetAt=freshDelta.reset_at||0;const localResetAt=currentMeta.lastResetAt||0;if(serverResetAt>localResetAt){// تصفير كامل حدث أثناء الـ push — نحتاج snapshot استثنائياً
const snap=await API.snapshot();dbSet(snap);setMeta({...getMeta(),lastSync:snap.ts||nowMs(),lastResetAt:snap.reset_at||serverResetAt});return{ok:true,pushed:pushedCount,pulled:0,data:snap};}const merged=mergeDelta(dbGet(),freshDelta);dbSet(merged);setMeta({...getMeta(),lastSync:freshDelta.ts||nowMs(),lastResetAt:serverResetAt});return{ok:true,pushed:pushedCount,pulled:0,data:dbGet()};}catch(_){// إذا فشل الـ delta، نكمل بـ delta عادي في الخطوة التالية
}}}catch(e){return{ok:false,error:e,pushed:0,pulled:0};}}// 2. Pull delta
try{const delta=await API.delta(meta.lastSync||0);// ── كشف factory reset: إلا server reset_at > local reset_at → نمسح الكل
const localResetAt=meta.lastResetAt||0;const serverResetAt=delta.reset_at||0;if(serverResetAt>localResetAt){// السيرفر تصفر — نمسح localStorage ونعاود snapshot
console.log("Factory reset detected — clearing local DB");dbSet({...INIT_DB});pendingClear();// نأخذ snapshot جديد
try{const snap=await API.snapshot();dbSet(snap);setMeta({...meta,lastSync:snap.ts||nowMs(),lastResetAt:snap.reset_at||serverResetAt});return{ok:true,pushed:0,pulled:0,reset:true,data:snap};}catch(e){return{ok:false,error:e,pushed:0,pulled:0};}}pulledCount=(delta.factories?.length||0)+(delta.suppliers?.length||0)+(delta.customers?.length||0)+(delta.categories?.length||0)+(delta.types?.length||0)+(delta.measures?.length||0)+(delta.packagings?.length||0)+(delta.sizes?.length||0)+(delta.items?.length||0)+(delta.orders?.length||0);// ── دائماً نعمل merge حتى لو 0 سجلات — باش نضمن التزامن الكامل
const merged=mergeDelta(dbGet(),delta);dbSet(merged);setMeta({...meta,lastSync:delta.ts||nowMs(),lastResetAt:serverResetAt});return{ok:true,pushed:pushedCount,pulled:pulledCount,data:dbGet()};}catch(e){return{ok:false,error:e,pushed:pushedCount,pulled:0};}}// ── Initial full load (فقط المرة الأولى)
async function initialLoad(){try{const snap=await API.snapshot();const meta=getMeta();const localResetAt=meta.lastResetAt||0;const serverResetAt=snap.reset_at||0;// إلا السيرفر تصفر بعد آخر sync ديالنا → نمسح كلشي قديم
if(serverResetAt>localResetAt){console.log("Factory reset detected on initial load — using server snapshot only");dbSet({...INIT_DB});pendingClear();}// نعمل merge مع pending باش ما نفقدوش التعديلات المحلية
const merged=mergeDelta(dbGet(),snap);dbSet(merged);setMeta({...getMeta(),lastSync:snap.ts||nowMs(),lastResetAt:serverResetAt});return{ok:true,data:merged};}catch(e){return{ok:false,error:e};}}/* ══ STOCK AVAILABILITY HELPERS ══
 * مفهوم: الرولو entry فيه measureValue الأصلي (مثلاً 50م).
 *  - طلبية ف status: draft / cutting → الرولو محجوز كامل (ما يبان ف المخزون)
 *  - طلبية ف status: production / ready → الرولو "تستهلك" بـ usedMeasure،
 *      والباقي (50 - 30 = 20م) يرجع للمخزون المتاح كـ leftover
 *  - طلبية ف status: cancelled / deleted → ما تحجزش
 *
 * usedMeasure تيجي من order.rollPieces[i].usedMeasure (مكتوبة من قسم القص).
 * إذا ما كانتش، نعتبروا الرولو تستعمل كامل.
 */// ترجع info حسب حالة الطلبية: 'active' (محجوز كامل) أو 'consumed' (محسوب بـ usedMeasure)
function _orderRollState(orderStatus){if(orderStatus==="cancelled")return"free";if(orderStatus==="draft"||orderStatus==="cutting")return"active";if(orderStatus==="production"||orderStatus==="ready")return"consumed";return"active";// unknown statuses → احتياطي
}// helper: ترجع map من entryId إلى usedMeasure (من order.rollPieces)
function _rollUsageFromOrder(order){const map={};for(const rp of order.rollPieces||[]){if(rp.entryId&&toNum(rp.usedMeasure)>0){map[rp.entryId]=toNum(rp.usedMeasure);}}return map;}// ترجع Set من entry IDs محجوزة كاملة (لـ orders ف draft/cutting)
function getReservedRollIds(orders){const reserved=new Set();for(const o of orders||[]){if(o.deleted_at)continue;if(_orderRollState(o.status)!=="active")continue;for(const sel of o.selectedRolls||[]){reserved.add(sel.entryId);}}return reserved;}// ترجع map: entryId -> total used measure من orders ف production/ready
//   { [entryId]: number_metres_consumed }
function getConsumedRollMeasures(orders){const consumed={};for(const o of orders||[]){if(o.deleted_at)continue;if(_orderRollState(o.status)!=="consumed")continue;const usage=_rollUsageFromOrder(o);for(const sel of o.selectedRolls||[]){const used=usage[sel.entryId];if(used!=null){consumed[sel.entryId]=(consumed[sel.entryId]||0)+used;}else{// ما كاينش usedMeasure → معناتها استعمل الرولو كامل (للطلبيات القديمة)
// نعلموا بـ -1 = "consumed all" — هاد الرولو ماشي متاح
consumed[sel.entryId]=-1;}}}return consumed;}function isRollReserved(entryId,orders){return getReservedRollIds(orders).has(entryId);}// ترجع نسخة من db ولكن: items فيها فقط الألوان والرولوات المتاحة
// — للـ roll items: نحتفظوا بالألوان اللي مازال عندها entries غير محجوزة
//   مع تعديل measureValue للرولوات اللي تستعملت جزئياً
// — للـ bulk items: نضمها إلا كان عندها كمية متبقية > 0
function buildAvailableStock(db){const reserved=getReservedRollIds(db.orders);const consumed=getConsumedRollMeasures(db.orders);const result=[];for(const item of db.items||[]){if(item.deleted_at)continue;if(item.sourceOrderId)continue;// بضائع جاهزة — تبان فقط في قسمها
// bulk: نقيس على المتبقي
if(item.kind==="bulk"){const total=toNum(item.totalQuantity);const cQty=toNum(item.consumedQuantity);const remaining=total-cQty;if(remaining>0){result.push({...item});}continue;}// roll: نقص الـ entries المحجوزة، ونحسب المتبقي للرولوات الجزئية
const newColors=[];for(const color of item.colors||[]){const newEntries=[];for(const e of color.entries||[]){// محجوز كامل (draft/cutting) → ما يبانش
if(reserved.has(e.id))continue;// تستعمل ف طلبية ماضية
const consumedMeasure=consumed[e.id];if(consumedMeasure===undefined){// ما تستعملش → entry كامل متاح
newEntries.push({...e});continue;}if(consumedMeasure<0){// طلبية قديمة بلا usedMeasure → نعتبرو الرولو تستهلك كامل
continue;}// جزئي → نحسب المتبقي
const original=toNum(e.measureValue);const remaining=original-consumedMeasure;if(remaining>0){newEntries.push({...e,measureValue:remaining,originalMeasureValue:original,// الأصلي (للعرض)
usedMeasureValue:consumedMeasure,// المستعمل
isLeftover:true// علم: هاد رولو متبقي من قص سابق
});}}if(newEntries.length>0){newColors.push({...color,entries:newEntries});}}if(newColors.length>0){result.push({...item,colors:newColors});}}return result;}// ── helper: ترجع object {entryId: {orderId, modelName, status, isPartial?, usedMeasure?}}
//   للرولوات المستعملة (سواء active أو consumed)
//   تأخذ بالاعتبار طلبيات نشطة فقط (غير ملغاة وغير محذوفة)
function buildRollUsageMap(orders){const map={};for(const o of orders||[]){if(o.deleted_at)continue;if(o.status==="cancelled")continue;const usage=_rollUsageFromOrder(o);for(const sel of o.selectedRolls||[]){const used=usage[sel.entryId];map[sel.entryId]={orderId:o.id,orderNumber:o.orderNumber,modelName:o.modelName||"بلا اسم",status:o.status,usedMeasure:used!=null?used:null,isPartial:used!=null// كاين usedMeasure → معناتها كاين قص رسمي
};}}return map;}// لـ Detail view: نوريو الرولوات مع علامة "مستعمل" أو "متاح" أو "متبقي جزء"
function annotateRollsWithStatus(item,orders){const reserved=getReservedRollIds(orders);const consumed=getConsumedRollMeasures(orders);const newColors=(item.colors||[]).map(color=>({...color,entries:(color.entries||[]).map(e=>{const cMeasure=consumed[e.id];const original=toNum(e.measureValue);let leftover=null;let isLeftover=false;if(cMeasure!==undefined&&cMeasure>=0){leftover=Math.max(0,original-cMeasure);if(leftover>0)isLeftover=true;}return{...e,reserved:reserved.has(e.id),consumedMeasure:cMeasure,leftoverMeasure:leftover,isLeftover};})}));return{...item,colors:newColors};}// ── حساب قيمة الطلبية: متراج × سعر، مفصلة لكل رولو + التكاليف الإضافية
// ترجع: { rolls: [...], totalMeters, totalUsedMeters, totalReturnedMeters,
//          fabricValue, fabricValueUsed, fabricValueReturned,
//          manufacturingCost, accessoriesCost, dyeingCost,
//          totalValue, piecesCount, actualPieces, perPieceValue }
//
// المنطق: إذا الطلبية ف القص أو ما بعد، نستعمل usedMeasure (الفعلي)
//   غير ذلك (مسودة): نستعمل measureValue الأصلي للرولو
function computeOrderValue(order,db){const rolls=[];let totalMeters=0;// إجمالي ميتراج الرولوات الأصلي (للمعلومة)
let totalUsedMeters=0;// المستعمل فعلياً (بعد القص)
let totalReturnedMeters=0;// اللي رجع للمخزون (Leftover)
let fabricValueOriginal=0;// قيمة الرولوات الأصلية
let fabricValueUsed=0;// قيمة المستعمل
let fabricValueReturned=0;// قيمة اللي رجع
// map من entryId إلى usedMeasure (من rollPieces)
const usageByEntry={};for(const rp of order.rollPieces||[]){if(rp.entryId&&toNum(rp.usedMeasure)>0){usageByEntry[rp.entryId]=toNum(rp.usedMeasure);}}// هل الطلبية تخطت مرحلة القص؟ (production/ready) — نعتمد usedMeasure
// قبل (draft/cutting): نعتمد الميتراج الأصلي
const isPostCutting=["production","ready"].includes(order.status);for(const sel of order.selectedRolls||[]){const item=db.items.find(i=>i.id===sel.itemId);if(!item)continue;const color=item.colors.find(c=>c.id===sel.colorId);if(!color)continue;const entry=color.entries.find(e=>e.id===sel.entryId);if(!entry)continue;const meters=toNum(entry.measureValue);const unitPrice=toNum(item.price);const valueOriginal=meters*unitPrice;// المستعمل ديال هاد الرولو
const used=isPostCutting&&usageByEntry[entry.id]!=null?Math.min(usageByEntry[entry.id],meters):meters;// قبل القص = الكل محجوز
const returned=Math.max(0,meters-used);const valueUsed=used*unitPrice;const valueReturned=returned*unitPrice;rolls.push({itemId:sel.itemId,colorId:sel.colorId,entryId:sel.entryId,item,color,entry,meters,// الأصلي
usedMeters:used,returnedMeters:returned,unitPrice,value:valueUsed,// ⭐ القيمة الفعلية = المستعمل (تستعمل ف العرض)
valueOriginal,valueReturned});totalMeters+=meters;totalUsedMeters+=used;totalReturnedMeters+=returned;fabricValueOriginal+=valueOriginal;fabricValueUsed+=valueUsed;fabricValueReturned+=valueReturned;}// التكاليف الإضافية: لكل قطعة (تضرب ف عدد القطع)
const manufacturingPerPiece=toNum(order.manufacturingCost);const accessoriesPerPiece=toNum(order.accessoriesCost);const dyeingPerPiece=toNum(order.dyeingCost);const packagingPerPiece=toNum(order.packagingCost);// عدد القطع: نحسب من rollPieces إذا متاحة، وإلا actualPieces
// إذا قسم الإنتاج أكد عدداً مختلفاً (productionPieces)، نستعمله للحساب
const rollPiecesArray=order.rollPieces||[];const rollPiecesSum=rollPiecesArray.reduce((s,rp)=>s+toNum(rp.pieces),0);const piecesCount=toNum(order.piecesCount)||0;const actualPieces=rollPiecesSum>0?rollPiecesSum:toNum(order.actualPieces)||0;const productionPieces=toNum(order.productionPieces)||0;// productionPieces = ما أنجزه قسم الإنتاج فعلاً (قد يكون أقل من actualPieces)
const piecesForCalc=productionPieces>0?productionPieces:actualPieces>0?actualPieces:piecesCount;// إجماليات التكاليف الإضافية = السعر/قطعة × عدد القطع
const manufacturingCost=manufacturingPerPiece*piecesForCalc;const accessoriesCost=accessoriesPerPiece*piecesForCalc;const dyeingCost=dyeingPerPiece*piecesForCalc;const packagingCost=packagingPerPiece*piecesForCalc;// التكاليف الديناميكية (cost_items) — يُضيفها المستخدم عند الإرسال للمبيعات
const costItems=Array.isArray(order.costItems)?order.costItems:[];const costItemsPerPiece=costItems.reduce((s,ci)=>s+toNum(ci.amountPerPiece),0);const costItemsTotal=costItemsPerPiece*piecesForCalc;const extraCosts=manufacturingCost+accessoriesCost+dyeingCost+packagingCost+costItemsTotal;// ⭐ الـ fabricValue ديال "الإجمالي" = المستعمل الفعلي (ماشي الأصلي)
const fabricValue=fabricValueUsed;const totalValue=fabricValue+extraCosts;const perPieceValue=piecesForCalc>0?totalValue/piecesForCalc:0;return{rolls,totalMeters,totalUsedMeters,totalReturnedMeters,fabricValue,// = fabricValueUsed (المستعمل فقط)
fabricValueOriginal,// الأصلي (للمقارنة)
fabricValueUsed,fabricValueReturned,isPostCutting,manufacturingPerPiece,accessoriesPerPiece,dyeingPerPiece,packagingPerPiece,manufacturingCost,accessoriesCost,dyeingCost,packagingCost,costItems,costItemsPerPiece,costItemsTotal,extraCosts,totalValue,piecesCount,actualPieces,productionPieces,piecesForCalc,rollPieces:rollPiecesArray,perPieceValue};}/* ══ CALCULATIONS ══ */const colorTotalMeasure=c=>c.entries.reduce((s,e)=>s+(toNum(e.quantity)||1)*toNum(e.measureValue),0);const colorValue=(c,p)=>colorTotalMeasure(c)*toNum(p);const itemTotalMeasure=i=>i.colors.reduce((s,c)=>s+colorTotalMeasure(c),0);const itemTotalValue=i=>itemTotalMeasure(i)*toNum(i.price);// ⭐ آمن للـ bulk والـ roll
const safeItemMeasure=i=>i.kind==="bulk"?toNum(i.totalQuantity):itemTotalMeasure(i);const safeItemValue=i=>safeItemMeasure(i)*toNum(i.price);
