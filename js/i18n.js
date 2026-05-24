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
      /* ── ترجمات إضافية ── */
      "القيمة": "القيمة",
      "الكل": "الكل",
      "المتاح": "المتاح",
      "المحجوز": "المحجوز",
      "المستهلك": "المستهلك",
      "كل المخزون": "كل المخزون",
      "بدون تصنيف": "بدون تصنيف",
      "لا يوجد مخزون ف هاد التصنيف": "لا يوجد مخزون في هذا التصنيف",
      "لا توجد نتائج": "لا توجد نتائج",
      "العربية": "العربية",
      "تصنيفات": "تصنيفات",
      "أنواع": "أنواع",
      "مقاييس": "مقاييس",
      "تغليف": "تغليف",
      "مقاسات": "مقاسات",
      "التكاليف": "التكاليف",
      "موردون": "موردون",
      "عملاء": "عملاء",
      "مصانع": "مصانع",
      "جارٍ الرفع...": "جارٍ الرفع...",
      "جارٍ الاسترجاع...": "جارٍ الاسترجاع...",
      "نسخ Google Drive الاحتياطي": "نسخ Google Drive الاحتياطي",
      "إضافة مورد": "إضافة مورد",
      "إضافة عميل": "إضافة عميل",
      "إضافة مصنع": "إضافة مصنع",
      "إضافة تصنيف جديد": "إضافة تصنيف جديد",
      "التصنيفات الموجودة": "التصنيفات الموجودة",
      "تصنيفات المخزون": "تصنيفات المخزون",
      "صنف": "صنف",
      /* ── Dashboard ── */
      "لا يوجد نشاط":           "لا يوجد نشاط",
      "لا يوجد":                "لا يوجد",
      "مصانع · موردون · عملاء": "مصانع · موردون · عملاء",
      "الكتالوج · جهات الاتصال · النظام · الذكاء": "الكتالوج · جهات الاتصال · النظام · الذكاء",
      "اضغط على أي قسم لفتحه":  "اضغط على أي قسم لفتحه",
      "صنف":      "صنف",
      "متاح":     "متاح",
      "جاهز":     "جاهز",
      "قطعة":     "قطعة",
      "قص":       "قص",
      "تصنيع":    "تصنيع",
      "عملية بيع": "عملية بيع",
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
      /* ── ترجمات إضافية ── */
      "القيمة": "Valeur",
      "الكل": "Tout",
      "المتاح": "Disponible",
      "المحجوز": "Réservé",
      "المستهلك": "Consommé",
      "كل المخزون": "Tout le stock",
      "بدون تصنيف": "Sans catégorie",
      "لا يوجد مخزون ف هاد التصنيف": "Aucun article dans cette catégorie",
      "لا توجد نتائج": "Aucun résultat",
      "العربية": "Arabe",
      "تصنيفات": "Catégories",
      "أنواع": "Types",
      "مقاييس": "Unités",
      "تغليف": "Emballage",
      "مقاسات": "Tailles",
      "التكاليف": "Coûts",
      "موردون": "Fournisseurs",
      "عملاء": "Clients",
      "مصانع": "Usines",
      "جارٍ الرفع...": "Envoi en cours...",
      "جارٍ الاسترجاع...": "Récupération...",
      "نسخ Google Drive الاحتياطي": "Sauvegarde Google Drive",
      "إضافة مورد": "+ Ajouter fournisseur",
      "إضافة عميل": "+ Ajouter client",
      "إضافة مصنع": "+ Ajouter usine",
      "إضافة تصنيف جديد": "+ Nouvelle catégorie",
      "التصنيفات الموجودة": "Catégories existantes",
      "تصنيفات المخزون": "Catégories du stock",
      "صنف": "article",
      /* ── Dashboard ── */
      "لا يوجد نشاط":           "Aucune activité",
      "لا يوجد":                "Aucun",
      "مصانع · موردون · عملاء": "Usines · Fournisseurs · Clients",
      "الكتالوج · جهات الاتصال · النظام · الذكاء": "Catalogue · Contacts · Système · IA",
      "اضغط على أي قسم لفتحه":  "Appuyez sur une section",
      "صنف":      "article",
      "متاح":     "disponible",
      "جاهز":     "prêt",
      "قطعة":     "pièce",
      "قص":       "coupe",
      "تصنيع":    "fabrication",
      "عملية بيع": "vente",
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
      /* ── ترجمات إضافية ── */
      "القيمة": "Value",
      "الكل": "All",
      "المتاح": "Available",
      "المحجوز": "Reserved",
      "المستهلك": "Consumed",
      "كل المخزون": "All inventory",
      "بدون تصنيف": "Uncategorized",
      "لا يوجد مخزون ف هاد التصنيف": "No items in this category",
      "لا توجد نتائج": "No results",
      "العربية": "Arabic",
      "تصنيفات": "Categories",
      "أنواع": "Types",
      "مقاييس": "Units",
      "تغليف": "Packaging",
      "مقاسات": "Sizes",
      "التكاليف": "Costs",
      "موردون": "Suppliers",
      "عملاء": "Clients",
      "مصانع": "Factories",
      "جارٍ الرفع...": "Uploading...",
      "جارٍ الاسترجاع...": "Restoring...",
      "نسخ Google Drive الاحتياطي": "Google Drive Backup",
      "إضافة مورد": "+ Add supplier",
      "إضافة عميل": "+ Add client",
      "إضافة مصنع": "+ Add factory",
      "إضافة تصنيف جديد": "+ New category",
      "التصنيفات الموجودة": "Existing categories",
      "تصنيفات المخزون": "Stock categories",
      "صنف": "item",
      /* ── Dashboard ── */
      "لا يوجد نشاط":           "No activity",
      "لا يوجد":                "None",
      "مصانع · موردون · عملاء": "Factories · Suppliers · Clients",
      "الكتالوج · جهات الاتصال · النظام · الذكاء": "Catalog · Contacts · System · AI",
      "اضغط على أي قسم لفتحه":  "Tap any section to open",
      "صنف":      "item",
      "متاح":     "available",
      "جاهز":     "ready",
      "قطعة":     "piece",
      "قص":       "cutting",
      "تصنيع":    "production",
      "عملية بيع": "sale",
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
