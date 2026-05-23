<div align="center">

<img src="./icon-512.png" alt="STOC Logo" width="100" height="100" />

# 📦 STOC — مدير المخزون

**تطبيق ويب تقدمي (PWA) لإدارة مخزون المصانع**

[![PWA](https://img.shields.io/badge/PWA-Ready-blueviolet?style=for-the-badge&logo=pwa)](.)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](.)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)](.)
[![Offline](https://img.shields.io/badge/Offline-First-orange?style=for-the-badge)](.)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](.)

[🌐 تجربة التطبيق](#) · [📖 التوثيق](#) · [🐛 الإبلاغ عن مشكلة](https://github.com/Ayad-Mounir/STOC-PWA/issues)

---

</div>

## 🏭 نظرة عامة

**STOC** هو تطبيق ويب تقدمي (PWA) متكامل مصمم لإدارة مخزون مصانع الملابس والنسيج. يعمل بالكامل على الهاتف والحاسوب دون الحاجة لتثبيت، مع دعم **وضع عدم الاتصال** ومزامنة تلقائية عبر Supabase.

> **هدف التطبيق:** تتبع الرولوات والمواد الخام، إدارة طلبيات القص والإنتاج والمبيعات، وتوليد تقارير شاملة — كل ذلك من هاتفك.

---

## ✨ المميزات الرئيسية

### 📊 لوحة التحكم
- نظرة شاملة فورية على المخزون والطلبيات النشطة
- بطاقات KPI لعدد الأصناف المتاحة، طلبيات القص، الإنتاج، والجاهز للتسليم
- تصفية سريعة حسب الصلاحيات لكل مستخدم

### 📦 إدارة المخزون
- دعم نوعين من الأصناف: **رولوات** (بالمتر/الطول) و**مفرد** (بالعدد)
- تنظيم المخزون بتصنيفات قابلة للتخصيص (ملابس، أزرار، بطانة...)
- تتبع الألوان بصور وكودات Hex لكل رولو
- تتبع القيمة الإجمالية للمخزون ومقدار المتاح منه
- قراءة QR code لتحديد الأصناف فوراً

### ✂️ دورة الإنتاج الكاملة
```
📝 مسودة  →  ✂️ قص  →  🏭 إنتاج  →  ✅ جاهز  →  📤 مُسلَّم
```
- إنشاء طلبيات القص مع تعيين المصنع والموديل
- تتبع الرولوات المستخدمة وحساب المتبقي تلقائياً
- تسجيل تكاليف التصنيع، الصبغ، التعبئة
- حساب إجمالي التكاليف لكل طلبية

### 🛍️ إدارة المبيعات
- طلبيات مبيعات منفصلة عن طلبيات الإنتاج
- ربط الطلبية بالعميل مع تتبع سعر البيع لكل قطعة
- إدارة المخزون الجاهز للبيع (البضائع المنتهية)

### 📈 التقارير المتقدمة
- تقارير مفصّلة حسب **المصنع** أو **العميل** أو **المورد**
- فلترة زمنية: آخر أسبوع / شهر / سنة / مخصص
- ملخص إجمالي لكل الكيانات
- **تصدير PDF** بجودة عالية مع ترويسة الشركة

### 🤖 الذكاء الاصطناعي
- **مسح الألوان التلقائي**: ارفع صورة رولو القماش وسيحدد الذكاء الاصطناعي الألوان تلقائياً باستخدام **Gemini API**
- دقة عالية في التعرف على الأثواب حتى مع الغلاف الشفاف

### 🔄 المزامنة والعمل دون اتصال
- **Offline-First**: جميع البيانات محفوظة محلياً أولاً (IndexedDB + localStorage)
- مزامنة Delta (فقط السجلات المتغيرة) عبر Supabase لتوفير الباندويدث
- حل نزاعات التزامن بنظام **Last-Write-Wins** مع حماية التعديلات المحلية
- إشعار فوري بحالة الاتصال في الواجهة

### 👥 إدارة المستخدمين والصلاحيات
- نظام أدوار: **مشرف (Admin)** و**مستخدم عادي**
- صلاحيات الوصول قابلة للتخصيص لكل مستخدم (مخزون، إنتاج، مبيعات، تقارير)
- نسخ احتياطي لبيانات الدخول للعمل بدون إنترنت
- تفعيل التطبيق بنظام ترخيص عبر **QR Code**

---

## 🛠️ التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| **React 18** (CDN) | بناء الواجهة كمكونات تفاعلية بدون Build Step |
| **Supabase** | قاعدة البيانات السحابية والمزامنة الآنية |
| **IndexedDB** | التخزين المحلي للبيانات الكبيرة (>5MB) |
| **Service Worker** | التخزين المؤقت والعمل بدون اتصال |
| **jsPDF + html2canvas** | توليد ملفات PDF من التقارير |
| **jsQR + qrcode.js** | قراءة وتوليد رموز QR |
| **Gemini API** | تحليل صور الأقمشة بالذكاء الاصطناعي |
| **Cairo Font** | الخط العربي الاحترافي |

### هيكل المشروع

```
STOC-PWA/
├── index.html              # نقطة الدخول — RTL عربي
├── manifest.json           # إعدادات PWA
├── sw.js                   # Service Worker (Cache v11)
├── icon-192.png            # أيقونة التطبيق
├── icon-512.png
├── css/
│   ├── base.css            # الستايلات الأساسية (Dark theme)
│   ├── components.css      # مكونات قابلة لإعادة الاستخدام
│   └── reports.css         # ستايلات التقارير والطباعة
├── js/
│   ├── config.js           # ثوابت وأدوات مشتركة
│   ├── db.js               # طبقة البيانات (IDB + Sync Engine)
│   ├── sync.js             # Supabase Realtime Sync Layer
│   ├── auth.js             # نظام الترخيص والمصادقة
│   ├── i18n.js             # تعدد اللغات (AR / FR / EN)
│   ├── ui.js               # مكونات React المشتركة
│   ├── pdf.js              # منطق توليد PDF
│   ├── qr.js               # قراءة وتوليد QR
│   ├── pwa.js              # منطق تثبيت PWA
│   ├── loader.js           # شاشة التحميل مع شريط التقدم
│   ├── error-handler.js    # معالجة الأخطاء العامة
│   └── pages/
│       ├── app.js          # المكوّن الجذر + التوجيه
│       ├── dashboard.js    # لوحة التحكم الرئيسية
│       ├── inventory.js    # إدارة المخزون + AI Scan
│       ├── orders.js       # طلبيات القص والإنتاج
│       ├── reports.js      # مركز التقارير
│       └── settings.js     # الإعدادات والكتالوج
└── libs/
    ├── react.min.js
    ├── react-dom.min.js
    ├── supabase.min.js
    ├── jsqr.min.js
    ├── qrcode.min.js
    ├── jspdf.min.js
    └── html2canvas.min.js
```

---

## 🚀 التشغيل والنشر

### المتطلبات
- حساب [Supabase](https://supabase.com) مجاني
- مستضيف ثابت يدعم HTTPS (GitHub Pages، Netlify، Vercel...)
- لا يوجد Node.js أو Build Tools مطلوبة ✅

### 1. إعداد قاعدة البيانات (Supabase)

أنشئ مشروعاً جديداً في Supabase ثم نفّذ هذا SQL:

```sql
-- جدول البيانات الرئيسي
CREATE TABLE stk_data (
  id text NOT NULL,
  tbl text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  updated_at bigint NOT NULL DEFAULT 0,
  deleted_at bigint,
  PRIMARY KEY (id, tbl)
);

-- جدول الإعدادات
CREATE TABLE stk_config (
  key text PRIMARY KEY,
  value text
);

-- جدول الميتاداتا (للمزامنة)
CREATE TABLE stk_meta (
  id int PRIMARY KEY DEFAULT 1,
  ts bigint DEFAULT 0,
  reset_at bigint DEFAULT 0,
  order_seq int DEFAULT 0
);
INSERT INTO stk_meta (id) VALUES (1) ON CONFLICT DO NOTHING;

-- جدول التراخيص
CREATE TABLE stoc_licenses (
  code text PRIMARY KEY,
  frozen boolean DEFAULT false,
  expires timestamptz
);
```

> **مهم:** فعّل **Realtime** على جدول `stk_data` من لوحة Supabase لضمان التحديث الفوري بين الأجهزة.

### 2. نشر التطبيق

**GitHub Pages (موصى به):**
```bash
git clone https://github.com/Ayad-Mounir/STOC-PWA.git
cd STOC-PWA
# ارفع على branch: main أو gh-pages
git push origin main
```
ثم فعّل GitHub Pages من إعدادات الـ Repository.

**أو:** ارفع الملفات مباشرة على أي استضافة HTTPS.

### 3. الإعداد الأول

1. افتح التطبيق → سيطلب منك مفتاح **Supabase URL** و**Anon Key**
2. أدخلهما من لوحة Supabase → Project Settings → API
3. انشئ ترخيصاً في جدول `stoc_licenses` وفعّل التطبيق عبر QR
4. سجّل دخولك وابدأ العمل 🎉

---

## 📱 التثبيت كتطبيق

STOC PWA يمكن تثبيته على أي جهاز:

| الجهاز | طريقة التثبيت |
|--------|--------------|
| **Android** | Chrome → ⋮ → "إضافة إلى الشاشة الرئيسية" |
| **iPhone/iPad** | Safari → مشاركة → "إضافة للشاشة الرئيسية" |
| **Windows/Mac** | Chrome/Edge → أيقونة التثبيت في شريط العنوان |

---

## 🌍 دعم اللغات

| اللغة | الرمز | الحالة |
|-------|-------|--------|
| العربية 🇲🇦 | `ar` | ✅ مكتملة (الافتراضية) |
| الفرنسية 🇫🇷 | `fr` | ✅ مدعومة |
| الإنجليزية 🇬🇧 | `en` | ✅ مدعومة |

يمكن تغيير اللغة من **الإعدادات → تاب اللغة**.

---

## 📸 لقطات الشاشة

> *(أضف لقطات الشاشة هنا)*

| لوحة التحكم | المخزون | الإنتاج | التقارير |
|-------------|---------|---------|----------|
| ![Dashboard](./screenshots/dashboard.png) | ![Inventory](./screenshots/inventory.png) | ![Orders](./screenshots/orders.png) | ![Reports](./screenshots/reports.png) |

---

## ⚙️ الإعدادات المتقدمة

### الذكاء الاصطناعي (Gemini)
لاستخدام ميزة مسح ألوان الأقمشة تلقائياً:
1. احصل على مفتاح [Gemini API](https://aistudio.google.com/app/apikey) مجاناً
2. الإعدادات → تاب **الذكاء** → أدخل المفتاح
3. في صفحة إضافة صنف → اضغط **🤖 مسح AI** وارفع صورة الرولو

### النسخ الاحتياطي
- الإعدادات → تاب **النسخ** → تصدير / استيراد البيانات بصيغة JSON

---

## 🏗️ المعمارية التقنية

```
┌─────────────────────────────────────────────┐
│              واجهة المستخدم                  │
│          React 18 (Vanilla CDN)             │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│              طبقة البيانات                   │
│  IndexedDB (كبير) + localStorage (صغير)     │
│  ← المصدر الأساسي دائماً (Offline-First) →  │
└──────────────────┬──────────────────────────┘
                   │ Delta Sync (LWW)
┌──────────────────▼──────────────────────────┐
│              Supabase Cloud                  │
│     PostgreSQL + Realtime Subscriptions     │
└─────────────────────────────────────────────┘
```

**آلية المزامنة:**
1. كل تعديل → يُحفظ محلياً فوراً + يُضاف لـ `pending_queue`
2. عند الاتصال → `push` الـ pending إلى Supabase
3. `pull` Delta (فقط التغييرات منذ آخر sync)
4. `merge` باستراتيجية Last-Write-Wins مع حماية الـ pending المحلي

---

## 🔐 الأمان

- بيانات الدخول مشفرة بـ SHA-256 قبل الحفظ المحلي
- التحقق من الترخيص أونلاين عبر Supabase مع fallback للعمل أوفلاين
- لا يتم حفظ كلمات المرور بنص واضح في أي مكان

---

## 🤝 المساهمة

المشروع حالياً **مغلق المصدر**. للاستفسارات:

- **GitHub:** [@Ayad-Mounir](https://github.com/Ayad-Mounir)
- **البريد الإلكتروني:** contact.ayad.mounir@gmail.com
- **واتساب:** +212 653 867 667

---

## 📄 الترخيص

هذا المشروع خاضع لترخيص خاص. جميع الحقوق محفوظة © 2025–2026 Ayad Mounir.

---

<div align="center">

صُنع بـ ❤️ في المغرب 🇲🇦

**STOC v5 — Stock Manager PWA**

</div>
