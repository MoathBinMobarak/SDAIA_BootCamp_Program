const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/companies
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = Math.min(parseInt(limit), 100);

        const [companies, total] = await Promise.all([
            prisma.company.findMany({
                skip,
                take,
                include: { _count: { select: { products: true } } },
                orderBy: [{ isVerified: 'desc' }, { nameAr: 'asc' }],
            }),
            prisma.company.count(),
        ]);

        res.json({
            data: companies,
            meta: { total, page: parseInt(page), limit: take, totalPages: Math.ceil(total / take) },
        });
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ في جلب الشركات' });
    }
});

// GET /api/v1/companies/:slug
router.get('/:slug', async (req, res) => {
    try {
        const company = await prisma.company.findUnique({
            where: { slug: req.params.slug },
            include: {
                products: {
                    where: { status: 'published' },
                    include: {
                        category: { select: { nameAr: true, slug: true, icon: true } },
                        productPlans: {
                            include: { plan: true },
                            orderBy: { plan: { tier: 'asc' } },
                        },
                    },
                    orderBy: { isFeatured: 'desc' },
                },
            },
        });

        if (!company) {
            return res.status(404).json({ error: 'الشركة غير موجودة' });
        }
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ في جلب الشركة' });
    }
});

module.exports = router;
