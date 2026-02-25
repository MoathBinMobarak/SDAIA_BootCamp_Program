const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/products — list published products
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, category, featured, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = Math.min(parseInt(limit), 100);

        const where = { status: 'published' };
        if (category) where.category = { slug: category };
        if (featured === 'true') where.isFeatured = true;
        if (search) {
            where.OR = [
                { nameAr: { contains: search, mode: 'insensitive' } },
                { nameEn: { contains: search, mode: 'insensitive' } },
                { taglineAr: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take,
                include: {
                    company: { select: { id: true, nameAr: true, nameEn: true, slug: true, logoUrl: true, isVerified: true } },
                    category: { select: { id: true, nameAr: true, nameEn: true, slug: true, icon: true } },
                    productPlans: {
                        include: { plan: true },
                        orderBy: { plan: { tier: 'asc' } },
                    },
                },
                orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
            }),
            prisma.product.count({ where }),
        ]);

        res.json({
            data: products,
            meta: { total, page: parseInt(page), limit: take, totalPages: Math.ceil(total / take) },
        });
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ في جلب المنتجات' });
    }
});

// GET /api/v1/products/:slug — single product detail
router.get('/:slug', async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { slug: req.params.slug, status: 'published' },
            include: {
                company: true,
                category: true,
                productPlans: {
                    include: { plan: true },
                    orderBy: { plan: { tier: 'asc' } },
                },
            },
        });

        if (!product) {
            return res.status(404).json({ error: 'المنتج غير موجود' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ في جلب المنتج' });
    }
});

// GET /api/v1/products/:slug/preview — product preview data
router.get('/:slug/preview', async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { slug: req.params.slug, status: 'published' },
            select: {
                id: true,
                nameAr: true,
                nameEn: true,
                slug: true,
                previewType: true,
                demoUrl: true,
                demoVideoUrl: true,
                screenshots: true,
                website: true,
            },
        });

        if (!product) {
            return res.status(404).json({ error: 'المنتج غير موجود' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ في جلب معاينة المنتج' });
    }
});

module.exports = router;
