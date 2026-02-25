// ── Demo Data (Showcase Products) ──────────────────────────────
// Hardcoded SaaS products for the Showcase section.
// These are temporary demo data and live in a separate nav section.

const DemoData = (() => {

    const companies = [
        { id: 'c1', nameEn: 'CloudFlow Inc.', nameAr: 'كلاود فلو', slug: 'cloudflow', website: 'https://example.com', isVerified: true, foundedYear: 2019, descriptionAr: 'شركة رائدة في حلول إدارة المشاريع السحابية', descriptionEn: 'Leading provider of cloud project management solutions' },
        { id: 'c2', nameEn: 'PayStack Systems', nameAr: 'باي ستاك', slug: 'paystack', website: 'https://example.com', isVerified: true, foundedYear: 2020, descriptionAr: 'منصة المدفوعات والفوترة الذكية', descriptionEn: 'Smart payment and invoicing platform' },
        { id: 'c3', nameEn: 'DataVault AI', nameAr: 'داتا فولت', slug: 'datavault', website: 'https://example.com', isVerified: false, foundedYear: 2021, descriptionAr: 'حلول تحليل البيانات بالذكاء الاصطناعي', descriptionEn: 'AI-powered data analytics solutions' },
        { id: 'c4', nameEn: 'SecureNet Pro', nameAr: 'سكيور نت', slug: 'securenet', website: 'https://example.com', isVerified: true, foundedYear: 2018, descriptionAr: 'أمن سيبراني متقدم للشركات', descriptionEn: 'Advanced cybersecurity for enterprises' },
    ];

    const categories = [
        { id: 'cat1', nameEn: 'Project Management', nameAr: 'إدارة المشاريع', slug: 'project-management', icon: 'project', _count: { products: 3 } },
        { id: 'cat2', nameEn: 'Finance & Payments', nameAr: 'المالية والمدفوعات', slug: 'finance', icon: 'finance', _count: { products: 2 } },
        { id: 'cat3', nameEn: 'Analytics & BI', nameAr: 'التحليلات والذكاء', slug: 'analytics', icon: 'analytics', _count: { products: 2 } },
        { id: 'cat4', nameEn: 'Security', nameAr: 'الأمن السيبراني', slug: 'security', icon: 'security', _count: { products: 1 } },
        { id: 'cat5', nameEn: 'Communication', nameAr: 'التواصل والتعاون', slug: 'communication', icon: 'communication', _count: { products: 2 } },
    ];

    const plans = {
        free: { id: 'pl1', nameEn: 'Free', nameAr: 'مجاني' },
        starter: { id: 'pl2', nameEn: 'Starter', nameAr: 'أساسي' },
        pro: { id: 'pl3', nameEn: 'Professional', nameAr: 'احترافي' },
        enterprise: { id: 'pl4', nameEn: 'Enterprise', nameAr: 'مؤسسي' },
    };

    const products = [
        {
            id: 'p1',
            nameEn: 'TaskFlow Pro',
            nameAr: 'تاسك فلو برو',
            slug: 'taskflow-pro',
            taglineAr: 'نظام إدارة مشاريع متكامل مع لوحات كانبان وتتبع الوقت',
            taglineEn: 'Complete project management with Kanban boards and time tracking',
            descriptionAr: 'تاسك فلو برو هو نظام إدارة مشاريع سحابي متكامل يتيح لفريقك التعاون بكفاءة. يشمل لوحات كانبان، مخططات غانت، تتبع الوقت، وإدارة الموارد. مصمم خصيصًا للفرق التي تبحث عن أداة واحدة لإدارة كل شيء.',
            descriptionEn: 'TaskFlow Pro is a comprehensive cloud project management system that enables your team to collaborate efficiently. It includes Kanban boards, Gantt charts, time tracking, and resource management. Designed for teams looking for one tool to manage everything.',
            logoUrl: '',
            website: 'https://example.com/taskflow',
            previewType: 'screenshots',
            demoUrl: '',
            demoVideoUrl: '',
            screenshots: ['https://placehold.co/800x500/6c5ce7/ffffff?text=Dashboard', 'https://placehold.co/800x500/00cec9/ffffff?text=Kanban+Board', 'https://placehold.co/800x500/a29bfe/ffffff?text=Analytics'],
            status: 'published',
            company: companies[0],
            category: categories[0],
            productPlans: [
                { plan: plans.free, priceMonthly: 0, priceYearly: 0, isPopular: false, features: ['5 projects', '3 team members', 'Basic Kanban', 'Email support'] },
                { plan: plans.pro, priceMonthly: 29, priceYearly: 290, isPopular: true, features: ['Unlimited projects', '25 team members', 'Gantt charts', 'Time tracking', 'Priority support', 'API access'] },
                { plan: plans.enterprise, priceMonthly: 79, priceYearly: 790, isPopular: false, features: ['Everything in Pro', 'Unlimited members', 'Custom workflows', 'SSO / SAML', 'Dedicated manager', 'SLA guarantee'] },
            ],
        },
        {
            id: 'p2',
            nameEn: 'InvoiceHub',
            nameAr: 'إنفويس هب',
            slug: 'invoicehub',
            taglineAr: 'فوترة ذكية وإدارة المدفوعات للشركات الصغيرة والمتوسطة',
            taglineEn: 'Smart invoicing and payment management for SMBs',
            descriptionAr: 'إنفويس هب منصة فوترة سحابية تتيح إنشاء الفواتير، تتبع المدفوعات، وإدارة الحسابات بسهولة. تدعم العملات المتعددة والفوترة المتكررة مع تقارير مالية شاملة.',
            descriptionEn: 'InvoiceHub is a cloud invoicing platform that lets you create invoices, track payments, and manage accounts with ease. Supports multiple currencies and recurring billing with comprehensive financial reports.',
            logoUrl: '',
            website: 'https://example.com/invoicehub',
            previewType: 'video',
            demoUrl: '',
            demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            screenshots: [],
            status: 'published',
            company: companies[1],
            category: categories[1],
            productPlans: [
                { plan: plans.starter, priceMonthly: 9, priceYearly: 90, isPopular: false, features: ['50 invoices/mo', '1 currency', 'Basic reports', 'Email reminders'] },
                { plan: plans.pro, priceMonthly: 25, priceYearly: 250, isPopular: true, features: ['Unlimited invoices', 'Multi-currency', 'Recurring billing', 'Advanced reports', 'Payment gateway', 'Team access'] },
            ],
        },
        {
            id: 'p3',
            nameEn: 'InsightQL',
            nameAr: 'إنسايت كيو إل',
            slug: 'insightql',
            taglineAr: 'تحليل بيانات بالذكاء الاصطناعي مع لوحات تحكم تفاعلية',
            taglineEn: 'AI-powered data analytics with interactive dashboards',
            descriptionAr: 'إنسايت كيو إل يحول بياناتك الخام إلى رؤى قابلة للتنفيذ باستخدام الذكاء الاصطناعي. يدعم الاتصال بأكثر من 50 مصدر بيانات ويوفر لوحات تحكم تفاعلية وتقارير آلية.',
            descriptionEn: 'InsightQL transforms your raw data into actionable insights using AI. Connect to 50+ data sources and get interactive dashboards and automated reports.',
            logoUrl: '',
            website: 'https://example.com/insightql',
            previewType: 'screenshots',
            demoUrl: '',
            demoVideoUrl: '',
            screenshots: ['https://placehold.co/800x500/0984e3/ffffff?text=Real-time+Dashboard', 'https://placehold.co/800x500/6c5ce7/ffffff?text=AI+Predictions'],
            status: 'published',
            company: companies[2],
            category: categories[2],
            productPlans: [
                { plan: plans.free, priceMonthly: 0, priceYearly: 0, isPopular: false, features: ['1 dashboard', '1000 rows', 'Basic charts', 'Community support'] },
                { plan: plans.pro, priceMonthly: 49, priceYearly: 490, isPopular: true, features: ['Unlimited dashboards', '1M rows', 'AI insights', '50+ connectors', 'Scheduled reports', 'API access'] },
                { plan: plans.enterprise, priceMonthly: 149, priceYearly: 1490, isPopular: false, features: ['Everything in Pro', 'Unlimited rows', 'Custom ML models', 'White-label', 'On-premise option', '24/7 support'] },
            ],
        },
        {
            id: 'p4',
            nameEn: 'ShieldGuard',
            nameAr: 'شيلد غارد',
            slug: 'shieldguard',
            taglineAr: 'حماية متقدمة ضد التهديدات السيبرانية مع مراقبة على مدار الساعة',
            taglineEn: 'Advanced cybersecurity with 24/7 threat monitoring',
            descriptionAr: 'شيلد غارد يوفر حماية شاملة ضد التهديدات السيبرانية بما في ذلك مراقبة الشبكة، كشف التسلل، وإدارة الثغرات. مدعوم بالذكاء الاصطناعي للكشف المبكر عن التهديدات.',
            descriptionEn: 'ShieldGuard provides comprehensive cybersecurity protection including network monitoring, intrusion detection, and vulnerability management. Powered by AI for early threat detection.',
            logoUrl: '',
            website: 'https://example.com/shieldguard',
            previewType: 'none',
            demoUrl: '',
            demoVideoUrl: '',
            screenshots: [],
            status: 'published',
            company: companies[3],
            category: categories[3],
            productPlans: [
                { plan: plans.starter, priceMonthly: 39, priceYearly: 390, isPopular: false, features: ['Up to 50 endpoints', 'Basic monitoring', 'Email alerts', 'Weekly reports'] },
                { plan: plans.pro, priceMonthly: 99, priceYearly: 990, isPopular: true, features: ['Up to 500 endpoints', 'Real-time monitoring', 'Threat intelligence', 'Incident response', 'Compliance reports', 'Phone support'] },
            ],
        },
        {
            id: 'p5',
            nameEn: 'TeamChat Plus',
            nameAr: 'تيم شات بلس',
            slug: 'teamchat-plus',
            taglineAr: 'منصة تواصل فريق العمل مع مكالمات فيديو ومشاركة الملفات',
            taglineEn: 'Team communication platform with video calls and file sharing',
            descriptionAr: 'تيم شات بلس هو منصة تواصل شاملة تجمع الرسائل الفورية، مكالمات الفيديو، مشاركة الملفات، وإدارة القنوات في مكان واحد. مصمم للفرق الموزعة والعمل عن بُعد.',
            descriptionEn: 'TeamChat Plus is a comprehensive communication platform combining instant messaging, video calls, file sharing, and channel management in one place. Built for distributed teams and remote work.',
            logoUrl: '',
            website: 'https://example.com/teamchat',
            previewType: 'screenshots',
            demoUrl: '',
            demoVideoUrl: '',
            screenshots: ['https://placehold.co/800x500/00cec9/ffffff?text=Chat+Interface', 'https://placehold.co/800x500/6c5ce7/ffffff?text=Video+Call', 'https://placehold.co/800x500/a29bfe/ffffff?text=File+Sharing'],
            status: 'published',
            company: companies[0],
            category: categories[4],
            productPlans: [
                { plan: plans.free, priceMonthly: 0, priceYearly: 0, isPopular: false, features: ['10 channels', '1-on-1 video', '5GB storage', 'Mobile app'] },
                { plan: plans.pro, priceMonthly: 8, priceYearly: 80, isPopular: true, features: ['Unlimited channels', 'Group video (50)', '100GB storage', 'Screen sharing', 'Guest access', 'Admin panel'] },
                { plan: plans.enterprise, priceMonthly: 15, priceYearly: 150, isPopular: false, features: ['Everything in Pro', '1TB storage', 'SSO / LDAP', 'Data retention', 'Compliance (HIPAA)', '24/7 support'] },
            ],
        },
        {
            id: 'p6',
            nameEn: 'FormBuilder AI',
            nameAr: 'فورم بيلدر',
            slug: 'formbuilder-ai',
            taglineAr: 'أنشئ نماذج واستبيانات ذكية بسحب وإفلات بسيط',
            taglineEn: 'Build smart forms and surveys with simple drag and drop',
            descriptionAr: 'فورم بيلدر يتيح إنشاء نماذج واستبيانات احترافية باستخدام واجهة سحب وإفلات بسيطة. يدعم المنطق الشرطي، الدفع المباشر، وتحليل الردود بالذكاء الاصطناعي.',
            descriptionEn: 'FormBuilder AI lets you create professional forms and surveys using a simple drag-and-drop interface. Supports conditional logic, direct payments, and AI-powered response analysis.',
            logoUrl: '',
            website: 'https://example.com/formbuilder',
            previewType: 'screenshots',
            demoUrl: '',
            demoVideoUrl: '',
            screenshots: ['https://placehold.co/800x500/e17055/ffffff?text=Form+Builder', 'https://placehold.co/800x500/fdcb6e/333333?text=Survey+Results'],
            status: 'published',
            company: companies[1],
            category: categories[0],
            productPlans: [
                { plan: plans.free, priceMonthly: 0, priceYearly: 0, isPopular: false, features: ['3 forms', '100 responses/mo', 'Basic fields', 'Email notifications'] },
                { plan: plans.pro, priceMonthly: 19, priceYearly: 190, isPopular: true, features: ['Unlimited forms', 'Unlimited responses', 'Conditional logic', 'Payment fields', 'File uploads', 'Custom branding'] },
            ],
        },
        {
            id: 'p7',
            nameEn: 'CloudHR',
            nameAr: 'كلاود إتش آر',
            slug: 'cloudhr',
            taglineAr: 'إدارة الموارد البشرية والرواتب بشكل آلي وسلس',
            taglineEn: 'Automated HR and payroll management made simple',
            descriptionAr: 'كلاود إتش آر يوفر حلاً شاملاً لإدارة الموارد البشرية من التوظيف إلى الرواتب. يشمل تتبع الحضور، إدارة الإجازات، تقييم الأداء، ومعالجة الرواتب تلقائيًا.',
            descriptionEn: 'CloudHR provides a comprehensive HR management solution from hiring to payroll. Includes attendance tracking, leave management, performance reviews, and automated payroll processing.',
            logoUrl: '',
            website: 'https://example.com/cloudhr',
            previewType: 'video',
            demoUrl: '',
            demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            screenshots: [],
            status: 'published',
            company: companies[2],
            category: categories[0],
            productPlans: [
                { plan: plans.starter, priceMonthly: 5, priceYearly: 50, isPopular: false, features: ['Up to 25 employees', 'Attendance tracking', 'Leave management', 'Basic reports'] },
                { plan: plans.pro, priceMonthly: 12, priceYearly: 120, isPopular: true, features: ['Up to 200 employees', 'Payroll processing', 'Performance reviews', 'Advanced analytics', 'Recruitment module', 'Integrations'] },
                { plan: plans.enterprise, priceMonthly: 25, priceYearly: 250, isPopular: false, features: ['Unlimited employees', 'Multi-branch', 'Custom policies', 'API access', 'White-label', 'Dedicated support'] },
            ],
        },
        {
            id: 'p8',
            nameEn: 'MetricsPulse',
            nameAr: 'ميتركس بالس',
            slug: 'metricspulse',
            taglineAr: 'مراقبة أداء التطبيقات والبنية التحتية في الوقت الحقيقي',
            taglineEn: 'Real-time application and infrastructure performance monitoring',
            descriptionAr: 'ميتركس بالس يوفر مراقبة شاملة لأداء التطبيقات والخوادم والبنية التحتية السحابية. تنبيهات ذكية، لوحات تحكم مرنة، وتتبع الأخطاء في الوقت الحقيقي.',
            descriptionEn: 'MetricsPulse provides comprehensive monitoring for application performance, servers, and cloud infrastructure. Smart alerts, flexible dashboards, and real-time error tracking.',
            logoUrl: '',
            website: 'https://example.com/metricspulse',
            previewType: 'screenshots',
            demoUrl: '',
            demoVideoUrl: '',
            screenshots: ['https://placehold.co/800x500/2d3436/00cec9?text=Server+Metrics', 'https://placehold.co/800x500/0a0a1a/6c5ce7?text=Alert+Dashboard', 'https://placehold.co/800x500/2d3436/a29bfe?text=Error+Tracking'],
            status: 'published',
            company: companies[3],
            category: categories[2],
            productPlans: [
                { plan: plans.free, priceMonthly: 0, priceYearly: 0, isPopular: false, features: ['5 monitors', '1-min checks', '1 dashboard', 'Email alerts'] },
                { plan: plans.pro, priceMonthly: 35, priceYearly: 350, isPopular: true, features: ['100 monitors', '10-sec checks', 'Unlimited dashboards', 'Slack/Teams alerts', 'APM tracing', 'Log management'] },
                { plan: plans.enterprise, priceMonthly: 99, priceYearly: 990, isPopular: false, features: ['Unlimited monitors', '1-sec checks', 'Custom retention', 'On-call schedules', 'SLO tracking', '24/7 support'] },
            ],
        },
    ];

    // ── Public API ──────────────────────────────────
    function getProducts() {
        return products;
    }

    function getProduct(slug) {
        return products.find(p => p.slug === slug) || null;
    }

    function getCategories() {
        return categories;
    }

    function getCategory(slug) {
        return categories.find(c => c.slug === slug) || null;
    }

    function getCompanies() {
        return companies;
    }

    function getCompany(slug) {
        return companies.find(c => c.slug === slug) || null;
    }

    function getProductsByCategory(catSlug) {
        const cat = getCategory(catSlug);
        if (!cat) return [];
        return products.filter(p => p.category.id === cat.id);
    }

    function searchProducts(query) {
        const q = query.toLowerCase();
        return products.filter(p =>
            p.nameEn.toLowerCase().includes(q) ||
            p.nameAr.includes(q) ||
            p.taglineEn.toLowerCase().includes(q) ||
            p.taglineAr.includes(q) ||
            p.company.nameEn.toLowerCase().includes(q)
        );
    }

    function getFeatured() {
        return products.slice(0, 4);
    }

    function getLatest() {
        return products.slice(4, 8);
    }

    return {
        getProducts, getProduct,
        getCategories, getCategory,
        getCompanies, getCompany,
        getProductsByCategory, searchProducts,
        getFeatured, getLatest,
    };
})();
