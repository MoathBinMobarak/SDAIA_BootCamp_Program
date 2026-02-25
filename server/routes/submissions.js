const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const router = express.Router();
const prisma = new PrismaClient();

// ── Validation Schema ─────────────────────────────────────────

const submissionSchema = z.object({
    // Company info
    companyNameAr: z.string().min(2, 'اسم الشركة بالعربية مطلوب (حرفان على الأقل)'),
    companyNameEn: z.string().optional(),
    companySlug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'الاسم المختصر للشركة يجب أن يكون أحرف صغيرة وأرقام وشرطات فقط'),
    companyLogoUrl: z.string().url().optional().or(z.literal('')),
    companyDescriptionAr: z.string().optional(),
    companyWebsite: z.string().url().optional().or(z.literal('')),
    companyCountry: z.string().max(5).optional(),
    companyFoundedYear: z.number().int().min(1900).max(2100).optional(),

    // Product info
    productNameAr: z.string().min(2, 'اسم المنتج بالعربية مطلوب (حرفان على الأقل)'),
    productNameEn: z.string().optional(),
    productSlug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'الاسم المختصر للمنتج يجب أن يكون أحرف صغيرة وأرقام وشرطات فقط'),
    productTaglineAr: z.string().optional(),
    productDescriptionAr: z.string().optional(),
    productLogoUrl: z.string().url().optional().or(z.literal('')),
    productWebsite: z.string().url().optional().or(z.literal('')),
    categoryId: z.string().uuid('التصنيف مطلوب'),
    previewType: z.enum(['none', 'iframe', 'video', 'screenshots']).default('none'),
    demoUrl: z.string().url().optional().or(z.literal('')),
    demoVideoUrl: z.string().url().optional().or(z.literal('')),
    screenshots: z.array(z.string().url()).optional().default([]),

    // Pricing plans
    plans: z.array(z.object({
        planId: z.string().uuid(),
        priceMonthly: z.number().min(0).optional().default(0),
        priceYearly: z.number().min(0).optional().default(0),
        currency: z.string().default('SAR'),
        isPopular: z.boolean().default(false),
        features: z.array(z.string()).optional().default([]),
    })).min(1, 'يجب إضافة خطة تسعير واحدة على الأقل'),

    // Contact
    contactEmail: z.string().email('البريد الإلكتروني غير صالح'),
    contactName: z.string().min(2, 'الاسم مطلوب').optional(),
});

// POST /api/v1/submissions — submit a product (public, no auth)
router.post('/', async (req, res) => {
    try {
        const data = submissionSchema.parse(req.body);

        // Store into Submission table
        const submission = await prisma.submission.create({
            data: {
                payload: data,
                contactEmail: data.contactEmail,
                contactName: data.contactName || '',
                productName: data.productNameAr,
                companyName: data.companyNameAr,
                status: 'pending',
            },
        });

        res.status(201).json({
            message: 'تم استلام طلبك بنجاح! سنراجعه ونضيف منتجك خلال 24-48 ساعة.',
            id: submission.id,
        });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({
                error: err.errors[0].message,
                errors: err.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
            });
        }
        console.error('Submission error:', err);
        res.status(500).json({ error: 'حدث خطأ في إرسال الطلب. حاول مرة أخرى.' });
    }
});

// GET /api/v1/submissions — list submissions (admin only, handled via admin routes)
router.get('/', async (req, res) => {
    try {
        const submissions = await prisma.submission.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ في جلب الطلبات' });
    }
});

module.exports = router;
