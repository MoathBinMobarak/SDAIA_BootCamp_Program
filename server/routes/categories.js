const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/categories — full tree
router.get('/', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                children: { orderBy: { sortOrder: 'asc' } },
                _count: { select: { products: true } },
            },
            where: { parentId: null },
            orderBy: { sortOrder: 'asc' },
        });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ في جلب التصنيفات' });
    }
});

// GET /api/v1/categories/:slug/products
router.get('/:slug/products', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = Math.min(parseInt(limit), 100);

        const category = await prisma.category.findUnique({ where: { slug: req.params.slug } });
        if (!category) {
            return res.status(404).json({ error: 'التصنيف غير موجود' });
        }

        const where = { categoryId: category.id, status: 'published' };
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take,
                include: {
                    company: { select: { id: true, nameAr: true, slug: true, logoUrl: true, isVerified: true } },
                    category: { select: { id: true, nameAr: true, slug: true, icon: true } },
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
            category,
            data: products,
            meta: { total, page: parseInt(page), limit: take, totalPages: Math.ceil(total / take) },
        });
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ في جلب منتجات التصنيف' });
    }
});

module.exports = router;
