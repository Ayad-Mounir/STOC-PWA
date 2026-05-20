const{useState,useEffect,useRef}=React;/* ══ UTILS ══ */const uid=()=>`${Date.now()}-${Math.random().toString(36).slice(2,6)}`;const KEY="stk-pwa-v1";const toNum=v=>parseFloat(v)||0;const fmtN=v=>{const n=toNum(v);return n%1===0?String(n):n.toFixed(2).replace(/\.?0+$/,"");};const fmtMoney=v=>`${Number(toNum(v)).toLocaleString("fr-MA")} د.م`;async function compress(dataUrl,maxPx=700){return new Promise(res=>{const img=new Image();img.onload=()=>{let w=img.width,h=img.height;if(w>maxPx||h>maxPx){if(w>h){h=Math.round(h/w*maxPx);w=maxPx;}else{w=Math.round(w/h*maxPx);h=maxPx;}}const cv=document.createElement("canvas");cv.width=w;cv.height=h;cv.getContext("2d").drawImage(img,0,0,w,h);res(cv.toDataURL("image/jpeg",.72));};img.src=dataUrl;});}async function readFile(file){return new Promise(ok=>{const r=new FileReader();r.onload=e=>ok(e.target.result);r.readAsDataURL(file);});}/* ══ HYBRID SYNC ENGINE ══ */// الفكرة: localStorage دائماً = المصدر الأساسي. السيرفر = sync في الخلفية.
// كل تعديل كيزاد لـ pendingChanges، ومنين يكون online كيتبعت للسيرفر.
const INIT_DB={factories:[],suppliers:[],customers:[],types:[],measures:[],packagings:[],categories:[],sizes:[],items:[],orders:[],invoices:[],ts:0};const READY_CAT_NAME="بضائع جاهزة";// تصنيف النظام — لا يبان في المخزون الأصلي
const DB_KEY="stk-hybrid-db-v1";// البيانات الرئيسية
const PENDING_KEY="stk-hybrid-pending-v1";// تعديلات غير مُزامنة
const META_KEY="stk-hybrid-meta-v1";// آخر sync timestamp + device id
const USER_KEY="stk-user-v1";// المستخدم الحالي (للاستخدام دون اتصال)
const CREDS_KEY="stk-creds-v1";// بيانات الدخول المشفرة (للدخول بدون سيرفر)
const COST_TYPES_KEY="stk-cost-types-v1";// أنواع التكاليف المعرّفة في الإعدادات
const FACTORY_KEY="stk-factory-v1";// معلومات المصنع (للاستخدام دون اتصال)
// ── Storage helpers (صغيرة — تبقى في localStorage)
function lsGet(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}function lsSet(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch(e){console.error("LS full:",e);return false;}}
