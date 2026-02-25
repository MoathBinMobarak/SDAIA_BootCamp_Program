const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// All bookmark routes require authentication
router.use(authenticate);

// GET /api/v1/me/bookmarks
router.get('/', async (req, res) => {
    try {
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: req.user.id },
            include: {
                product: {
                    include: {
                        company: { select: { nameAr: true, slug: true, logoUrl: true } },
                        category: { select: { nameAr: true, slug: true, icon: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(bookmarks);
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ في جلب المحفوظات' });
    }
});

// POST /api/v1/me/bookmarks
router.post('/', async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'معرّف المنتج مطلوب' });
        }

        const existing = await prisma.bookmark.findUnique({
            where: { userId_productId: { userId: req.user.id, productId } },
        });
        if (existing) {
            return res.status(409).json({ error: 'المنتج محفوظ مسبقًا' });
        }

        const bookmark = await prisma.bookmark.create({
            data: { userId: req.user.id, productId },
        });
        res.status(201).json(bookmark);
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ في حفظ المنتج' });
    }
});

// DELETE /api/v1/me/bookmarks/:id
router.delete('/:id', async (req, res) => {
    try {
        const bookmark = await prisma.bookmark.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!bookmark) {
            return res.status(404).json({ error: 'المحفوظ غير موجود' });
        }
        await prisma.bookmark.delete({ where: { id: req.params.id } });
        res.json({ message: 'تم حذف المحفوظ' });
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ في حذف المحفوظ' });
    }
});

module.exports = router;
