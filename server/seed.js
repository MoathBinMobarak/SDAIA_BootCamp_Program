const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 بدء تهيئة البيانات...');

    // ── Admin User ──────────────────────────────────────────────
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@softmarket.com' },
        update: {},
        create: {
            email: 'admin@softmarket.com',
            passwordHash: adminPassword,
            name: 'مسؤول النظام',
            role: 'admin',
        },
    });
    console.log('✅ تم إنشاء المسؤول:', admin.email);

    // ── Subscription Plans ──────────────────────────────────────
    const plans = await Promise.all([
        prisma.subscriptionPlan.create({
            data: { nameAr: 'مجاني', nameEn: 'Free', tier: 0 },
        }),
        prisma.subscriptionPlan.create({
            data: { nameAr: 'احترافي', nameEn: 'Pro', tier: 1 },
        }),
        prisma.subscriptionPlan.create({
            data: { nameAr: 'مؤسسي', nameEn: 'Enterprise', tier: 2 },
        }),
    ]);
    console.log('✅ تم إنشاء خطط الاشتراك:', plans.length);

    // ── Categories ──────────────────────────────────────────────
    const categories = await Promise.all([
        prisma.category.create({
            data: { nameAr: 'إدارة المشاريع', nameEn: 'Project Management', slug: 'project-management', icon: 'clipboard', sortOrder: 1 },
        }),
        prisma.category.create({
            data: { nameAr: 'إدارة علاقات العملاء', nameEn: 'CRM', slug: 'crm', icon: 'users', sortOrder: 2 },
        }),
        prisma.category.create({
            data: { nameAr: 'المحاسبة والمالية', nameEn: 'Accounting & Finance', slug: 'accounting-finance', icon: 'calculator', sortOrder: 3 },
        }),
        prisma.category.create({
            data: { nameAr: 'التسويق الرقمي', nameEn: 'Digital Marketing', slug: 'digital-marketing', icon: 'megaphone', sortOrder: 4 },
        }),
        prisma.category.create({
            data: { nameAr: 'الموارد البشرية', nameEn: 'Human Resources', slug: 'human-resources', icon: 'briefcase', sortOrder: 5 },
        }),
    ]);
    console.log('✅ تم إنشاء التصنيفات:', categories.length);

    // ── Companies ───────────────────────────────────────────────
    const companies = await Promise.all([
        prisma.company.create({
            data: {
                nameAr: 'تقنية السحاب',
                nameEn: 'Cloud Tech',
                slug: 'cloud-tech',
                descriptionAr: 'شركة رائدة في تقديم حلول الحوسبة السحابية للشركات في المنطقة العربية',
                website: 'https://cloudtech.example.com',
                country: 'SA',
                foundedYear: 2018,
                isVerified: true,
            },
        }),
        prisma.company.create({
            data: {
                nameAr: 'حلول ذكية',
                nameEn: 'Smart Solutions',
                slug: 'smart-solutions',
                descriptionAr: 'متخصصون في أنظمة إدارة الأعمال المتكاملة والذكاء الاصطناعي',
                website: 'https://smartsolutions.example.com',
                country: 'AE',
                foundedYear: 2020,
                isVerified: true,
            },
        }),
        prisma.company.create({
            data: {
                nameAr: 'رقمنة',
                nameEn: 'Raqamna',
                slug: 'raqamna',
                descriptionAr: 'منصة تحول رقمي شاملة تخدم الشركات الصغيرة والمتوسطة',
                website: 'https://raqamna.example.com',
                country: 'SA',
                foundedYear: 2021,
                isVerified: false,
            },
        }),
    ]);
    console.log('✅ تم إنشاء الشركات:', companies.length);

    // ── Products ────────────────────────────────────────────────
    const products = await Promise.all([
        // Cloud Tech products
        prisma.product.create({
            data: {
                companyId: companies[0].id,
                categoryId: categories[0].id,
                nameAr: 'مشاريعي',
                nameEn: 'Masharii',
                slug: 'masharii',
                taglineAr: 'إدارة مشاريعك بذكاء وسهولة',
                descriptionAr: 'أداة متكاملة لإدارة المشاريع تدعم اللغة العربية بالكامل. تتضمن لوحات كانبان، مخططات جانت، وتتبع المهام في الوقت الفعلي.',
                website: 'https://masharii.example.com',
                demoUrl: 'https://demo.masharii.example.com',
                previewType: 'iframe',
                isFeatured: true,
                status: 'published',
            },
        }),
        prisma.product.create({
            data: {
                companyId: companies[0].id,
                categoryId: categories[2].id,
                nameAr: 'حساباتي',
                nameEn: 'Hesabati',
                slug: 'hesabati',
                taglineAr: 'محاسبة سحابية للشركات العربية',
                descriptionAr: 'نظام محاسبة سحابي متوافق مع معايير هيئة الزكاة والضريبة والجمارك. يدعم الفوترة الإلكترونية وضريبة القيمة المضافة.',
                website: 'https://hesabati.example.com',
                demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                previewType: 'video',
                isFeatured: true,
                status: 'published',
            },
        }),
        prisma.product.create({
            data: {
                companyId: companies[0].id,
                categoryId: categories[3].id,
                nameAr: 'تسويق برو',
                nameEn: 'Tasweeq Pro',
                slug: 'tasweeq-pro',
                taglineAr: 'حملات تسويقية ذكية بنقرة واحدة',
                descriptionAr: 'منصة تسويق رقمي متكاملة تتضمن إدارة حملات البريد الإلكتروني، وسائل التواصل الاجتماعي، وتحليلات متقدمة.',
                website: 'https://tasweeq.example.com',
                previewType: 'screenshots',
                screenshots: JSON.stringify(['https://placehold.co/800x450/2d1b69/ffffff?text=لوحة+التحكم', 'https://placehold.co/800x450/1a1a2e/ffffff?text=التقارير']),
                isFeatured: false,
                status: 'published',
            },
        }),
        // Smart Solutions products
        prisma.product.create({
            data: {
                companyId: companies[1].id,
                categoryId: categories[1].id,
                nameAr: 'عملائي',
                nameEn: 'Omalai',
                slug: 'omalai',
                taglineAr: 'نظام CRM عربي متكامل',
                descriptionAr: 'نظام إدارة علاقات العملاء مصمم خصيصًا للسوق العربي. يتضمن إدارة جهات الاتصال، تتبع الصفقات، وتقارير المبيعات.',
                website: 'https://omalai.example.com',
                demoUrl: 'https://demo.omalai.example.com',
                previewType: 'iframe',
                isFeatured: true,
                status: 'published',
            },
        }),
        prisma.product.create({
            data: {
                companyId: companies[1].id,
                categoryId: categories[4].id,
                nameAr: 'فريقي',
                nameEn: 'Fareeqi',
                slug: 'fareeqi',
                taglineAr: 'إدارة الموارد البشرية بسلاسة',
                descriptionAr: 'حل شامل لإدارة الموارد البشرية يشمل الرواتب، الإجازات، التقييمات، والتوظيف.',
                website: 'https://fareeqi.example.com',
                previewType: 'video',
                demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                isFeatured: false,
                status: 'published',
            },
        }),
        prisma.product.create({
            data: {
                companyId: companies[1].id,
                categoryId: categories[0].id,
                nameAr: 'إنجاز',
                nameEn: 'Injaz',
                slug: 'injaz',
                taglineAr: 'أنجز مهامك بكفاءة عالية',
                descriptionAr: 'تطبيق لإدارة المهام مع تكامل مع Microsoft Teams وSlack. يدعم العمل التعاوني والإشعارات الفورية.',
                website: 'https://injaz.example.com',
                previewType: 'none',
                isFeatured: false,
                status: 'published',
            },
        }),
        // Raqamna products
        prisma.product.create({
            data: {
                companyId: companies[2].id,
                categoryId: categories[2].id,
                nameAr: 'فاتورة',
                nameEn: 'Fatura',
                slug: 'fatura',
                taglineAr: 'فوترة إلكترونية متوافقة مع زاتكا',
                descriptionAr: 'نظام فوترة إلكترونية يتوافق مع متطلبات هيئة الزكاة والضريبة والجمارك (ZATCA). إصدار وإرسال الفواتير بسهولة.',
                website: 'https://fatura.example.com',
                demoUrl: 'https://demo.fatura.example.com',
                previewType: 'iframe',
                isFeatured: true,
                status: 'published',
            },
        }),
        prisma.product.create({
            data: {
                companyId: companies[2].id,
                categoryId: categories[3].id,
                nameAr: 'نشر',
                nameEn: 'Nashr',
                slug: 'nashr',
                taglineAr: 'جدولة ونشر المحتوى تلقائيًا',
                descriptionAr: 'أداة لإدارة وجدولة المحتوى على منصات التواصل الاجتماعي المتعددة مع تحليلات أداء مفصلة.',
                website: 'https://nashr.example.com',
                previewType: 'screenshots',
                screenshots: JSON.stringify(['https://placehold.co/800x450/0d1117/ffffff?text=الجدولة', 'https://placehold.co/800x450/161b22/ffffff?text=التحليلات']),
                isFeatured: false,
                status: 'published',
            },
        }),
        prisma.product.create({
            data: {
                companyId: companies[2].id,
                categoryId: categories[1].id,
                nameAr: 'تواصل',
                nameEn: 'Tawasl',
                slug: 'tawasl',
                taglineAr: 'دردشة ذكية مع عملائك',
                descriptionAr: 'منصة تواصل مع العملاء تتضمن دردشة حية، شات بوت ذكي، وتكامل مع واتساب للأعمال.',
                website: 'https://tawasl.example.com',
                previewType: 'none',
                isFeatured: false,
                status: 'draft',
            },
        }),
        prisma.product.create({
            data: {
                companyId: companies[2].id,
                categoryId: categories[4].id,
                nameAr: 'حضوري',
                nameEn: 'Hudouri',
                slug: 'hudouri',
                taglineAr: 'نظام حضور وانصراف ذكي',
                descriptionAr: 'تطبيق لتتبع حضور وانصراف الموظفين باستخدام GPS والتعرف على الوجه. يتكامل مع أنظمة الرواتب.',
                website: 'https://hudouri.example.com',
                demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                previewType: 'video',
                isFeatured: false,
                status: 'published',
            },
        }),
    ]);
    console.log('✅ تم إنشاء المنتجات:', products.length);

    // ── Product Plans (Pricing) ─────────────────────────────────
    const productPlansData = [];
    for (const product of products) {
        if (product.status === 'draft') continue;

        // Free plan
        productPlansData.push(
            prisma.productPlan.create({
                data: {
                    productId: product.id,
                    planId: plans[0].id,
                    priceMonthly: 0,
                    priceYearly: 0,
                    currency: 'SAR',
                    features: JSON.stringify(['5 مستخدمين', 'دعم بريد إلكتروني', 'ميزات أساسية']),
                    isPopular: false,
                },
            })
        );
        // Pro plan
        productPlansData.push(
            prisma.productPlan.create({
                data: {
                    productId: product.id,
                    planId: plans[1].id,
                    priceMonthly: 99 + Math.floor(Math.random() * 200),
                    priceYearly: 990 + Math.floor(Math.random() * 1500),
                    currency: 'SAR',
                    features: JSON.stringify(['25 مستخدم', 'دعم أولوية', 'جميع الميزات', 'تقارير متقدمة']),
                    isPopular: true,
                },
            })
        );
        // Enterprise plan
        productPlansData.push(
            prisma.productPlan.create({
                data: {
                    productId: product.id,
                    planId: plans[2].id,
                    priceMonthly: 499 + Math.floor(Math.random() * 500),
                    priceYearly: 4990 + Math.floor(Math.random() * 3000),
                    currency: 'SAR',
                    features: JSON.stringify(['مستخدمين غير محدود', 'مدير حساب مخصص', 'SLA مضمون', 'تخصيص كامل', 'API وصول']),
                    isPopular: false,
                },
            })
        );
    }
    await Promise.all(productPlansData);
    console.log('✅ تم إنشاء خطط التسعير:', productPlansData.length);

    console.log('\n🎉 تمت تهيئة البيانات بنجاح!');
}

main()
    .catch((e) => {
        console.error('❌ خطأ في تهيئة البيانات:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
