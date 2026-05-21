/* ══════════════════════════════════════════════════════════════
   i18n.js — نظام تعدد اللغات للـ STOC PWA
   يدعم: العربية (ar) | الفرنسية (fr) | الإنجليزية (en)
   الإصدار: 1.0 — M4
   ══════════════════════════════════════════════════════════════ */
(function () {
  var I18N_KEY    = "stoc-lang-v1";
  var DEFAULT     = "ar";

  /* ── قاموس الترجمات ── */
  var D = {
    ar: {
      /* ── تنقل ── */
      "المخزون":    "المخزون",
      "الإنتاج":    "الإنتاج",
      "المبيعات":   "المبيعات",
      "التقارير":   "التقارير",
      "الإعدادات":  "الإعدادات",
      "لوحة التحكم": "لوحة التحكم",
      "اختر قسماً للبدء": "اختر قسماً للبدء",
      /* ── تبويبات الإعدادات ── */
      "الكتالوج":       "الكتالوج",
      "جهات الاتصال":   "جهات الاتصال",
      "النظام":         "النظام",
      "الذكاء":         "الذكاء",
      "النسخ":          "النسخ",
      "مزامنة":         "مزامنة",
      /* ── حالات الطلبيات ── */
      "مسودة":    "مسودة",
      "القص":     "القص",
      "الإنتاج":  "الإنتاج",
      "الجاهز":   "الجاهز",
      "ملغية":    "ملغية",
      /* ── أزرار عامة ── */
      "حفظ":          "حفظ",
      "إلغاء":        "إلغاء",
      "إضافة":        "إضافة",
      "حذف":          "حذف",
      "تعديل":        "تعديل",
      "بحث":          "بحث",
      "تأكيد":        "تأكيد",
      "نعم":          "نعم",
      "لا":           "لا",
      "رجوع":         "رجوع",
      "اتصال":        "اتصال",
      /* ── حالة الشبكة ── */
      "جارٍ التحميل...":  "جارٍ التحميل...",
      "متصل بـ Supabase ⚡":  "متصل بـ Supabase ⚡",
      "غير متصل — وضع محلي فقط": "غير متصل — وضع محلي فقط",
      "جارٍ المزامنة...": "جارٍ المزامنة...",
      "محاولة الاتصال": "محاولة الاتصال",
      "وضع محلي — تعديلاتك ستُزامن عند اتصال الحاسوب": "وضع محلي — تعديلاتك ستُزامن عند اتصال الحاسوب",
      "وضع عرض فقط — التعديل متاح للمشرف عند الاتصال": "وضع عرض فقط — التعديل متاح للمشرف عند الاتصال",
      "رفع الآن": "رفع الآن",
      /* ── ترخيص ── */
      "لا يوجد ترخيص مفعَّل":   "لا يوجد ترخيص مفعَّل",
      "فعِّل التطبيق عبر QR أو الرابط": "فعِّل التطبيق عبر QR أو الرابط",
      "منتهي الصلاحية":  "منتهي الصلاحية",
      "ترخيص دائم":      "ترخيص دائم",
      "ينتهي قريباً!":   "ينتهي قريباً!",
      "ساري":             "ساري",
      "تاريخ التفعيل":   "تاريخ التفعيل",
      "تاريخ الانتهاء":  "تاريخ الانتهاء",
      "المدة المتبقية":  "المدة المتبقية",
      "دائم ♾️":         "دائم ♾️",
      "منتهي":           "منتهي",
      "آخر يوم!":        "آخر يوم!",
      /* ── اللغة ── */
      "اختيار اللغة":                 "اختيار اللغة",
      "اختر لغة عرض التطبيق":        "اختر لغة عرض التطبيق",
      "سيُطبَّق التغيير فوراً على جميع أقسام التطبيق": "سيُطبَّق التغيير فوراً على جميع أقسام التطبيق",
    },

    fr: {
      /* ── تنقل ── */
      "المخزون":    "Inventaire",
      "الإنتاج":    "Production",
      "المبيعات":   "Ventes",
      "التقارير":   "Rapports",
      "الإعدادات":  "Paramètres",
      "لوحة التحكم": "Tableau de bord",
      "اختر قسماً للبدء": "Choisir une section",
      /* ── تبويبات الإعدادات ── */
      "الكتالوج":       "Catalogue",
      "جهات الاتصال":   "Contacts",
      "النظام":         "Système",
      "الذكاء":         "IA",
      "النسخ":          "Sauvegarde",
      "مزامنة":         "Synchro",
      /* ── حالات الطلبيات ── */
      "مسودة":    "Brouillon",
      "القص":     "Coupe",
      "الإنتاج":  "Production",
      "الجاهز":   "Prêt",
      "ملغية":    "Annulée",
      /* ── أزرار عامة ── */
      "حفظ":          "Enregistrer",
      "إلغاء":        "Annuler",
      "إضافة":        "Ajouter",
      "حذف":          "Supprimer",
      "تعديل":        "Modifier",
      "بحث":          "Rechercher",
      "تأكيد":        "Confirmer",
      "نعم":          "Oui",
      "لا":           "Non",
      "رجوع":         "Retour",
      "اتصال":        "Connexion",
      /* ── حالة الشبكة ── */
      "جارٍ التحميل...":  "Chargement...",
      "متصل بـ Supabase ⚡":  "Connecté à Supabase ⚡",
      "غير متصل — وضع محلي فقط": "Hors ligne — mode local",
      "جارٍ المزامنة...": "Synchronisation...",
      "محاولة الاتصال":   "Reconnexion...",
      "وضع محلي — تعديلاتك ستُزامن عند اتصال الحاسوب": "Mode local — vos modifications seront synchronisées à la reconnexion",
      "وضع عرض فقط — التعديل متاح للمشرف عند الاتصال": "Lecture seule — modifications réservées à l'admin en ligne",
      "رفع الآن": "Envoyer",
      /* ── ترخيص ── */
      "لا يوجد ترخيص مفعَّل":   "Aucune licence activée",
      "فعِّل التطبيق عبر QR أو الرابط": "Activez via QR ou lien",
      "منتهي الصلاحية":  "Expiré",
      "ترخيص دائم":      "Licence permanente",
      "ينتهي قريباً!":   "Expire bientôt !",
      "ساري":             "Actif",
      "تاريخ التفعيل":   "Date d'activation",
      "تاريخ الانتهاء":  "Date d'expiration",
      "المدة المتبقية":  "Durée restante",
      "دائم ♾️":         "Permanent ♾️",
      "منتهي":           "Expiré",
      "آخر يوم!":        "Dernier jour !",
      /* ── اللغة ── */
      "اختيار اللغة":                 "Choix de la langue",
      "اختر لغة عرض التطبيق":        "Choisissez la langue d'affichage",
      "سيُطبَّق التغيير فوراً على جميع أقسام التطبيق": "Le changement s'applique immédiatement à toute l'application",
    },

    en: {
      /* ── تنقل ── */
      "المخزون":    "Inventory",
      "الإنتاج":    "Production",
      "المبيعات":   "Sales",
      "التقارير":   "Reports",
      "الإعدادات":  "Settings",
      "لوحة التحكم": "Dashboard",
      "اختر قسماً للبدء": "Select a section to start",
      /* ── تبويبات الإعدادات ── */
      "الكتالوج":       "Catalog",
      "جهات الاتصال":   "Contacts",
      "النظام":         "System",
      "الذكاء":         "AI",
      "النسخ":          "Backup",
      "مزامنة":         "Sync",
      /* ── حالات الطلبيات ── */
      "مسودة":    "Draft",
      "القص":     "Cutting",
      "الإنتاج":  "Production",
      "الجاهز":   "Ready",
      "ملغية":    "Cancelled",
      /* ── أزرار عامة ── */
      "حفظ":          "Save",
      "إلغاء":        "Cancel",
      "إضافة":        "Add",
      "حذف":          "Delete",
      "تعديل":        "Edit",
      "بحث":          "Search",
      "تأكيد":        "Confirm",
      "نعم":          "Yes",
      "لا":           "No",
      "رجوع":         "Back",
      "اتصال":        "Connect",
      /* ── حالة الشبكة ── */
      "جارٍ التحميل...":  "Loading...",
      "متصل بـ Supabase ⚡":  "Connected to Supabase ⚡",
      "غير متصل — وضع محلي فقط": "Offline — local mode only",
      "جارٍ المزامنة...": "Syncing...",
      "محاولة الاتصال":   "Reconnecting...",
      "وضع محلي — تعديلاتك ستُزامن عند اتصال الحاسوب": "Offline — changes will sync when reconnected",
      "وضع عرض فقط — التعديل متاح للمشرف عند الاتصال": "View only — editing available for admin when online",
      "رفع الآن": "Push now",
      /* ── ترخيص ── */
      "لا يوجد ترخيص مفعَّل":   "No active license",
      "فعِّل التطبيق عبر QR أو الرابط": "Activate via QR or link",
      "منتهي الصلاحية":  "Expired",
      "ترخيص دائم":      "Permanent license",
      "ينتهي قريباً!":   "Expiring soon!",
      "ساري":             "Active",
      "تاريخ التفعيل":   "Activation date",
      "تاريخ الانتهاء":  "Expiry date",
      "المدة المتبقية":  "Remaining",
      "دائم ♾️":         "Permanent ♾️",
      "منتهي":           "Expired",
      "آخر يوم!":        "Last day!",
      /* ── اللغة ── */
      "اختيار اللغة":                 "Language selection",
      "اختر لغة عرض التطبيق":        "Choose display language",
      "سيُطبَّق التغيير فوراً على جميع أقسام التطبيق": "Change applies immediately to all sections",
    }
  };

  /* ── الحصول على اللغة الحالية ── */
  function getLang() {
    return localStorage.getItem(I18N_KEY) || DEFAULT;
  }

  /* ── تغيير اللغة ── */
  function setLang(lang) {
    if (!D[lang]) return;
    localStorage.setItem(I18N_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === "ar" ? "rtl" : "ltr";
    /* إطلاق حدث إعادة رسم React */
    window.dispatchEvent(new CustomEvent("stoc-lang-change", { detail: { lang: lang } }));
    console.log("[i18n] اللغة:", lang, "| الاتجاه:", lang === "ar" ? "RTL" : "LTR");
  }

  /* ── دالة الترجمة الرئيسية ── */
  function t(key) {
    if (!key) return "";
    var lang = getLang();
    var dict = D[lang] || D[DEFAULT];
    /* إذا لم توجد ترجمة → أعد المفتاح كما هو (fallback آمن) */
    return (dict && dict[key] !== undefined) ? dict[key] : key;
  }

  /* ── تطبيق اللغة المحفوظة عند التحميل ── */
  (function applyOnLoad() {
    var lang = getLang();
    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === "ar" ? "rtl" : "ltr";
  })();

  /* ── الواجهة العامة ── */
  window.__i18n = {
    t:          t,
    setLang:    setLang,
    getLang:    getLang,
    langs:      ["ar", "fr", "en"],
    langNames:  { ar: "العربية", fr: "Français", en: "English" },
    langFlags:  { ar: "🇲🇦", fr: "🇫🇷", en: "🇬🇧" },
    langDirs:   { ar: "rtl",    fr: "ltr",      en: "ltr"     },
  };

})();
