// ── Internationalization (AR ↔ EN) ────────────────────────────

const I18n = (() => {
    let currentLang = localStorage.getItem('gc_lang') || 'en';

    const translations = {
        ar: {
            // Nav
            'nav.explore': 'تصفح',
            'nav.categories': 'التصنيفات',
            'nav.admin': 'لوحة التحكم',
            'nav.bookmarks': 'المحفوظات',
            'nav.login': 'تسجيل الدخول',
            'nav.logout': 'خروج',
            'nav.search': 'ابحث عن منتج أو شركة...',

            // Hero
            'hero.title': 'اكتشف أفضل البرمجيات لعملك',
            'hero.subtitle': 'منصة عربية شاملة للبحث والمقارنة وتجربة البرمجيات السحابية قبل الاشتراك',
            'hero.search': 'ابحث عن منتج، شركة، أو تصنيف...',
            'hero.popular': 'الأكثر بحثًا:',
            'hero.stat.products': 'منتج',
            'hero.stat.companies': 'شركة',
            'hero.stat.categories': 'تصنيف',
            'hero.stat.users': 'مستخدم',

            // Home
            'home.categories': 'التصنيفات',
            'home.featured': 'المنتجات المميزة',
            'home.latest': 'أحدث المنتجات',
            'home.viewAll': 'عرض الكل',
            'home.howItWorks': 'كيف تعمل المنصة؟',
            'home.step1.title': 'تصفح وابحث',
            'home.step1.desc': 'اكتشف مئات البرمجيات السحابية المصنفة حسب احتياجاتك',
            'home.step2.title': 'قارن وجرّب',
            'home.step2.desc': 'شاهد المعاينات الحية وقارن الخطط والأسعار',
            'home.step3.title': 'اشترك بثقة',
            'home.step3.desc': 'اختر المنتج المناسب واشترك مباشرة من المنصة',
            'home.cta.title': 'هل لديك منتج SaaS؟',
            'home.cta.subtitle': 'انضم لأكبر دليل برمجيات سحابية في المنطقة العربية',
            'home.cta.btn': 'أضف منتجك الآن',

            // Explore
            'explore.title': 'تصفح المنتجات',
            'explore.category': 'التصنيف',
            'explore.planType': 'نوع الخطة',
            'explore.free': 'مجاني',
            'explore.paid': 'مدفوع',
            'explore.preview': 'المعاينة',
            'explore.hasPreview': 'يوفر معاينة',
            'explore.clearFilters': 'إزالة الفلاتر',
            'explore.results': 'نتيجة',

            // Product
            'product.about': 'عن المنتج',
            'product.preview': 'معاينة المنتج',
            'product.plans': 'خطط الاشتراك',
            'product.visit': 'زيارة الموقع ↗',
            'product.tryIt': 'جرّب المنتج',
            'product.save': 'حفظ',
            'product.saved': 'تم الحفظ',
            'product.savedNotify': 'تم حفظ المنتج',
            'product.removedNotify': 'تم إزالة المنتج من المحفوظات',
            'product.notFound': 'المنتج غير موجود',
            'product.openNew': 'فتح في نافذة جديدة ↗',
            'product.verified': 'شركة موثّقة',
            'product.startFree': 'ابدأ مجانًا',
            'product.subscribe': 'اشترك الآن',
            'product.monthlyPrice': '/شهر',
            'product.yearly': '/ سنويًا',
            'product.popular': 'الأكثر شيوعًا',
            'product.related': 'منتجات مشابهة',

            // Preview
            'preview.live': 'معاينة حية',
            'preview.video': 'فيديو توضيحي',
            'preview.screenshots': 'صور المنتج',

            // Company
            'company.products': 'منتجات الشركة',
            'company.founded': 'تأسست',
            'company.website': 'الموقع',
            'company.noProducts': 'لم تضف هذه الشركة أي منتجات بعد.',
            'company.notFound': 'الشركة غير موجودة',

            // Categories
            'categories.title': 'التصنيفات',
            'categories.product': 'منتج',
            'categories.noCategories': 'سيتم إضافة التصنيفات قريبًا',

            // Search
            'search.title': 'نتائج البحث',
            'search.for': 'البحث عن:',
            'search.noResults': 'لم يتم العثور على نتائج',
            'search.tryDifferent': 'جرّب كلمات بحث مختلفة',
            'search.enterQuery': 'أدخل كلمة للبحث',
            'search.browseAll': 'تصفح المنتجات',

            // Auth
            'auth.login': 'تسجيل الدخول',
            'auth.loginSubtitle': 'أدخل بياناتك للوصول إلى حسابك',
            'auth.email': 'البريد الإلكتروني',
            'auth.password': 'كلمة المرور',
            'auth.name': 'الاسم',
            'auth.register': 'إنشاء حساب',
            'auth.registerSubtitle': 'سجّل حسابًا جديدًا للوصول إلى جميع الميزات',
            'auth.noAccount': 'ليس لديك حساب؟',
            'auth.hasAccount': 'لديك حساب بالفعل؟',
            'auth.verifying': 'جارٍ التحقق...',
            'auth.creating': 'جارٍ الإنشاء...',
            'auth.welcome': 'مرحبًا',
            'auth.accountCreated': 'تم إنشاء الحساب بنجاح!',
            'auth.loggedOut': 'تم تسجيل الخروج بنجاح',

            // Bookmarks
            'bookmarks.title': 'المحفوظات',
            'bookmarks.empty': 'لا توجد محفوظات',
            'bookmarks.emptyText': 'لم تحفظ أي منتج بعد. تصفح المنتجات واحفظ ما يعجبك!',

            // Admin
            'admin.dashboard': 'لوحة التحكم',
            'admin.products': 'المنتجات',
            'admin.companies': 'الشركات',
            'admin.categories': 'التصنيفات',
            'admin.plans': 'خطط الاشتراك',
            'admin.users': 'المستخدمون',
            'admin.welcome': 'مرحبًا بك في لوحة التحكم',
            'admin.welcomeText': 'من هنا يمكنك إدارة المنتجات والشركات والتصنيفات وخطط الاشتراك.',
            'admin.add': '+ إضافة',
            'admin.edit': 'تعديل',
            'admin.delete': 'حذف',
            'admin.save': 'حفظ',
            'admin.cancel': 'إلغاء',
            'admin.create': 'إنشاء',
            'admin.saving': 'جارٍ الحفظ...',
            'admin.confirmDelete': 'هل أنت متأكد من الحذف؟',
            'admin.deleted': 'تم الحذف بنجاح',
            'admin.updated': 'تم التحديث بنجاح',
            'admin.created': 'تم الإنشاء بنجاح',

            // General
            'general.loading': 'جارٍ التحميل...',
            'general.error': 'حدث خطأ',
            'general.noResults': 'لا توجد نتائج',
            'general.backHome': 'العودة للرئيسية',
            'general.next': 'التالي',
            'general.prev': 'السابق',
            'general.free': 'مجاني',
            'general.page404': 'الصفحة غير موجودة',
            'general.page404Text': 'الرابط الذي طلبته غير موجود في SoftMarket',
            'general.status.draft': 'مسودة',
            'general.status.published': 'منشور',
            'general.status.archived': 'مؤرشف',
            'general.role.admin': 'مسؤول',
            'general.role.vendor': 'مزوّد',
            'general.role.user': 'مستخدم',
            'general.verified': 'موثّقة',
            'general.unverified': 'غير موثّقة',

            // Footer
            'footer.about': 'عن المنصة',
            'footer.aboutText': 'منصة SoftMarket هي أول دليل عربي شامل للبرمجيات السحابية، تساعد الشركات على اكتشاف ومقارنة وتجربة أفضل الحلول.',
            'footer.links': 'روابط سريعة',
            'footer.support': 'الدعم',
            'footer.contact': 'تواصل معنا',
            'footer.privacy': 'سياسة الخصوصية',
            'footer.terms': 'الشروط والأحكام',
            'footer.faq': 'الأسئلة الشائعة',
            'footer.copyright': '© 2026 SoftMarket. جميع الحقوق محفوظة.',
            'footer.madeWith': 'صُنع بكل حب في المنطقة العربية',

            // Showcase
            'showcase.badge': 'معرض المنتجات',
            'showcase.title': 'استكشف أفضل البرمجيات السحابية',
            'showcase.subtitle': 'تصفح مجموعة مختارة من أفضل الحلول البرمجية وتعرّف على ميزاتها وخططها',
            'showcase.nav': 'المعرض',
            'showcase.cta.title': 'هذه مجرد عينة!',
            'showcase.cta.subtitle': 'سيتم إضافة المزيد من المنتجات قريبًا. هل لديك منتج تريد إضافته؟',

            // Theme
            'theme.dark': 'dark',
            'theme.light': 'light',
            'lang.toggle': 'EN',

            // Submit
            'submit.nav': 'أضف منتجك',
        },
        en: {
            // Nav
            'nav.explore': 'Explore',
            'nav.categories': 'Categories',
            'nav.admin': 'Dashboard',
            'nav.bookmarks': 'Bookmarks',
            'nav.login': 'Sign In',
            'nav.logout': 'Logout',
            'nav.search': 'Search products or companies...',

            // Hero
            'hero.title': 'Discover the Best Software for Your Business',
            'hero.subtitle': 'A comprehensive platform to search, compare, and try cloud software before you subscribe',
            'hero.search': 'Search products, companies, or categories...',
            'hero.popular': 'Popular:',
            'hero.stat.products': 'Products',
            'hero.stat.companies': 'Companies',
            'hero.stat.categories': 'Categories',
            'hero.stat.users': 'Users',

            // Home
            'home.categories': 'Categories',
            'home.featured': 'Featured Products',
            'home.latest': 'Latest Products',
            'home.viewAll': 'View All',
            'home.howItWorks': 'How It Works',
            'home.step1.title': 'Browse & Search',
            'home.step1.desc': 'Discover hundreds of cloud software solutions categorized for your needs',
            'home.step2.title': 'Compare & Try',
            'home.step2.desc': 'Watch live demos and compare plans and pricing',
            'home.step3.title': 'Subscribe Confidently',
            'home.step3.desc': 'Choose the right product and subscribe directly from the platform',
            'home.cta.title': 'Have a SaaS Product?',
            'home.cta.subtitle': 'Join the largest cloud software directory in the MENA region',
            'home.cta.btn': 'Add Your Product Now',

            // Explore
            'explore.title': 'Explore Products',
            'explore.category': 'Category',
            'explore.planType': 'Plan Type',
            'explore.free': 'Free',
            'explore.paid': 'Paid',
            'explore.preview': 'Preview',
            'explore.hasPreview': 'Has Preview',
            'explore.clearFilters': 'Clear Filters',
            'explore.results': 'results',

            // Product
            'product.about': 'About the Product',
            'product.preview': 'Product Preview',
            'product.plans': 'Subscription Plans',
            'product.visit': 'Visit Website ↗',
            'product.tryIt': 'Try Product',
            'product.save': 'Save',
            'product.saved': 'Saved',
            'product.savedNotify': 'Product saved',
            'product.removedNotify': 'Product removed from bookmarks',
            'product.notFound': 'Product not found',
            'product.openNew': 'Open in new tab ↗',
            'product.verified': 'Verified company',
            'product.startFree': 'Start Free',
            'product.subscribe': 'Subscribe Now',
            'product.monthlyPrice': '/mo',
            'product.yearly': '/year',
            'product.popular': 'Most Popular',
            'product.related': 'Similar Products',

            // Preview
            'preview.live': 'Live Demo',
            'preview.video': 'Demo Video',
            'preview.screenshots': 'Screenshots',

            // Company
            'company.products': 'Company Products',
            'company.founded': 'Founded',
            'company.website': 'Website',
            'company.noProducts': 'This company has no products yet.',
            'company.notFound': 'Company not found',

            // Categories
            'categories.title': 'Categories',
            'categories.product': 'products',
            'categories.noCategories': 'Categories coming soon',

            // Search
            'search.title': 'Search Results',
            'search.for': 'Search for:',
            'search.noResults': 'No results found',
            'search.tryDifferent': 'Try different search terms',
            'search.enterQuery': 'Enter a search term',
            'search.browseAll': 'Browse Products',

            // Auth
            'auth.login': 'Sign In',
            'auth.loginSubtitle': 'Enter your credentials to access your account',
            'auth.email': 'Email',
            'auth.password': 'Password',
            'auth.name': 'Name',
            'auth.register': 'Create Account',
            'auth.registerSubtitle': 'Create a new account to access all features',
            'auth.noAccount': "Don't have an account?",
            'auth.hasAccount': 'Already have an account?',
            'auth.verifying': 'Verifying...',
            'auth.creating': 'Creating...',
            'auth.welcome': 'Welcome',
            'auth.accountCreated': 'Account created successfully!',
            'auth.loggedOut': 'Logged out successfully',

            // Bookmarks
            'bookmarks.title': 'Bookmarks',
            'bookmarks.empty': 'No bookmarks yet',
            'bookmarks.emptyText': 'Start exploring products and save your favorites!',

            // Admin
            'admin.dashboard': 'Dashboard',
            'admin.products': 'Products',
            'admin.companies': 'Companies',
            'admin.categories': 'Categories',
            'admin.plans': 'Subscription Plans',
            'admin.users': 'Users',
            'admin.welcome': 'Welcome to the Dashboard',
            'admin.welcomeText': 'Manage products, companies, categories, and subscription plans from here.',
            'admin.add': '+ Add',
            'admin.edit': 'Edit',
            'admin.delete': 'Delete',
            'admin.save': 'Save',
            'admin.cancel': 'Cancel',
            'admin.create': 'Create',
            'admin.saving': 'Saving...',
            'admin.confirmDelete': 'Are you sure you want to delete?',
            'admin.deleted': 'Deleted successfully',
            'admin.updated': 'Updated successfully',
            'admin.created': 'Created successfully',

            // General
            'general.loading': 'Loading...',
            'general.error': 'An error occurred',
            'general.noResults': 'No results',
            'general.backHome': 'Back to Home',
            'general.next': 'Next',
            'general.prev': 'Previous',
            'general.free': 'Free',
            'general.page404': 'Page Not Found',
            'general.page404Text': 'The link you requested does not exist in SoftMarket',
            'general.status.draft': 'Draft',
            'general.status.published': 'Published',
            'general.status.archived': 'Archived',
            'general.role.admin': 'Admin',
            'general.role.vendor': 'Vendor',
            'general.role.user': 'User',
            'general.verified': 'Verified',
            'general.unverified': 'Unverified',

            // Footer
            'footer.about': 'About',
            'footer.aboutText': 'SoftMarket is the first comprehensive Arabic cloud software directory, helping businesses discover, compare, and try the best solutions.',
            'footer.links': 'Quick Links',
            'footer.support': 'Support',
            'footer.contact': 'Contact Us',
            'footer.privacy': 'Privacy Policy',
            'footer.terms': 'Terms & Conditions',
            'footer.faq': 'FAQ',
            'footer.copyright': '© 2026 SoftMarket. All rights reserved.',
            'footer.madeWith': 'Made with love in the MENA region',

            // Showcase
            'showcase.badge': 'Product Showcase',
            'showcase.title': 'Explore Top Cloud Software',
            'showcase.subtitle': 'Browse a curated collection of the best SaaS solutions and discover their features and plans',
            'showcase.nav': 'Showcase',
            'showcase.cta.title': 'This is just a preview!',
            'showcase.cta.subtitle': 'More products will be added soon. Have a product you want to list?',

            // Theme
            'theme.dark': 'dark',
            'theme.light': 'light',
            'lang.toggle': 'عربي',

            // Submit
            'submit.nav': 'Add Product',
        },
    };

    function t(key) {
        return translations[currentLang]?.[key] || translations['en']?.[key] || key;
    }

    function getLang() {
        return currentLang;
    }

    function setLang(lang) {
        currentLang = lang;
        localStorage.setItem('gc_lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }

    function toggle() {
        setLang(currentLang === 'ar' ? 'en' : 'ar');
    }

    function isAr() {
        return currentLang === 'ar';
    }

    // Init direction
    setLang(currentLang);

    return { t, getLang, setLang, toggle, isAr };
})();
