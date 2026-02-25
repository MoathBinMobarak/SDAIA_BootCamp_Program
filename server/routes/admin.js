const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');
const { z } = require('zod');

const router = express.Router();
const prisma = new PrismaClient();

// All admin routes require admin role
router.use(authenticate);
router.use(requireRole('admin'));

// ── Product CRUD ──────────────────────────────────────────────

const productSchema = z.object({
    companyId: z.string().uuid(),
    categoryId: z.string().uuid(),
    nameAr: z.string().min(2),
    nameEn: z.string().optional(),
    slug: z.string().min(2),
    taglineAr: z.string().optional(),
    descriptionAr: z.string().optional(),
    logoUrl: z.string().optional(),
    screenshots: z.any().optional(),
    website: z.string().url().optional().or(z.literal('')),
    demoUrl: z.string().url().optional().or(z.literal('')),
    demoVideoUrl: z.string().url().optional().or(z.literal('')),
    previewType: z.enum(['iframe', 'video', 'screenshots', 'none']).optional(),
    isFeatured: z.boolean().optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
});

router.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = Math.min(parseInt(limit), 100);
        const where = status ? { status } : {};

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take,
                include: {
                    company: { select: { nameAr: true, slug: true } },
                    category: { select: { nameAr: true, slug: true } },
                },
                orderBy: { updatedAt: 'desc' },
            }),
            prisma.product.count({ where }),
        ]);
        res.json({ data: products, meta: { total, page: parseInt(page), limit: take, totalPages: Math.ceil(total / take) } });
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ في جلب المنتجات' });
    }
});

router.post('/products', async (req, res) => {
    try {
        const data = productSchema.parse(req.body);
        const product = await prisma.product.create({ data });
        res.status(201).json(product);
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
        if (err.code === 'P2002') return res.status(409).json({ error: 'الاسم المختصر مستخدم مسبقًا' });
        res.status(500).json({ error: 'حدث خطأ في إنشاء المنتج' });
    }
});

router.put('/products/:id', async (req, res) => {
    try {
        const data = productSchema.partial().parse(req.body);
        const product = await prisma.product.update({ where: { id: req.params.id }, data });
        res.json(product);
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
        if (err.code === 'P2025') return res.status(404).json({ error: 'المنتج غير موجود' });
        res.status(500).json({ error: 'حدث خطأ في تحديث المنتج' });
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        await prisma.product.delete({ where: { id: req.params.id } });
        res.json({ message: 'تم حذف المنتج' });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'المنتج غير موجود' });
        res.status(500).json({ error: 'حدث خطأ في حذف المنتج' });
    }
});

// ── Company CRUD ──────────────────────────────────────────────

const companySchema = z.object({
    nameAr: z.string().min(2),
    nameEn: z.string().optional(),
    slug: z.string().min(2),
    logoUrl: z.string().optional(),
    descriptionAr: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    country: z.string().optional(),
    foundedYear: z.number().int().optional(),
    isVerified: z.boolean().optional(),
});

router.get('/companies', async (req, res) => {
    try {
        const companies = await prisma.company.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ في جلب الشركات' });
    }
});

router.post('/companies', async (req, res) => {
    try {
        const data = companySchema.parse(req.body);
        const company = await prisma.company.create({ data });
        res.status(201).json(company);
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
        if (err.code === 'P2002') return res.status(409).json({ error: 'الاسم المختصر مستخدم مسبقًا' });
        res.status(500).json({ error: 'حدث خطأ في إنشاء الشركة' });
    }
});

router.put('/companies/:id', async (req, res) => {
    try {
        const data = companySchema.partial().parse(req.body);
        const company = await prisma.company.update({ where: { id: req.params.id }, data });
        res.json(company);
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
        if (err.code === 'P2025') return res.status(404).json({ error: 'الشركة غير موجودة' });
        res.status(500).json({ error: 'حدث خطأ في تحديث الشركة' });
    }
});

router.delete('/companies/:id', async (req, res) => {
    try {
        await prisma.company.delete({ where: { id: req.params.id } });
        res.json({ message: 'تم حذف الشركة' });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'الشركة غير موجودة' });
        res.status(500).json({ error: 'حدث خطأ في حذف الشركة' });
    }
});

// ── Category CRUD ─────────────────────────────────────────────

const categorySchema = z.object({
    nameAr: z.string().min(2),
    nameEn: z.string().optional(),
    slug: z.string().min(2),
    parentId: z.string().uuid().optional().nullable(),
    icon: z.string().optional(),
    sortOrder: z.number().int().optional(),
});

router.post('/categories', async (req, res) => {
    try {
        const data = categorySchema.parse(req.body);
        const category = await prisma.category.create({ data });
        res.status(201).json(category);
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
        if (err.code === 'P2002') return res.status(409).json({ error: 'الاسم المختصر مستخدم مسبقًا' });
        res.status(500).json({ error: 'حدث خطأ في إنشاء التصنيف' });
    }
});

router.put('/categories/:id', async (req, res) => {
    try {
        const data = categorySchema.partial().parse(req.body);
        const category = await prisma.category.update({ where: { id: req.params.id }, data });
        res.json(category);
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
        if (err.code === 'P2025') return res.status(404).json({ error: 'التصنيف غير موجود' });
        res.status(500).json({ error: 'حدث خطأ في تحديث التصنيف' });
    }
});

router.delete('/categories/:id', async (req, res) => {
    try {
        await prisma.category.delete({ where: { id: req.params.id } });
        res.json({ message: 'تم حذف التصنيف' });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'التصنيف غير موجود' });
        res.status(500).json({ error: 'حدث خطأ في حذف التصنيف' });
    }
});

// ── Subscription Plan CRUD ────────────────────────────────────

const planSchema = z.object({
    nameAr: z.string().min(2),
    nameEn: z.string().optional(),
    tier: z.number().int().min(0),
});

router.post('/plans', async (req, res) => {
    try {
        const data = planSchema.parse(req.body);
        const plan = await prisma.subscriptionPlan.create({ data });
        res.status(201).json(plan);
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
        res.status(500).json({ error: 'حدث خطأ في إنشاء الخطة' });
    }
});

router.put('/plans/:id', async (req, res) => {
    try {
        const data = planSchema.partial().parse(req.body);
        const plan = await prisma.subscriptionPlan.update({ where: { id: req.params.id }, data });
        res.json(plan);
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
        if (err.code === 'P2025') return res.status(404).json({ error: 'الخطة غير موجودة' });
        res.status(500).json({ error: 'حدث خطأ في تحديث الخطة' });
    }
});

// ── Product Plan CRUD ─────────────────────────────────────────

const productPlanSchema = z.object({
    productId: z.string().uuid(),
    planId: z.string().uuid(),
    priceMonthly: z.number().optional(),
    priceYearly: z.number().optional(),
    currency: z.string().default('SAR'),
    features: z.any().optional(),
    isPopular: z.boolean().optional(),
});

router.post('/product-plans', async (req, res) => {
    try {
        const data = productPlanSchema.parse(req.body);
        const productPlan = await prisma.productPlan.create({ data });
        res.status(201).json(productPlan);
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
        res.status(500).json({ error: 'حدث خطأ في إنشاء تسعير المنتج' });
    }
});

router.put('/product-plans/:id', async (req, res) => {
    try {
        const data = productPlanSchema.partial().parse(req.body);
        const productPlan = await prisma.productPlan.update({ where: { id: req.params.id }, data });
        res.json(productPlan);
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
        if (err.code === 'P2025') return res.status(404).json({ error: 'تسعير المنتج غير موجود' });
        res.status(500).json({ error: 'حدث خطأ في تحديث تسعير المنتج' });
    }
});

router.delete('/product-plans/:id', async (req, res) => {
    try {
        await prisma.productPlan.delete({ where: { id: req.params.id } });
        res.json({ message: 'تم حذف تسعير المنتج' });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'تسعير المنتج غير موجود' });
        res.status(500).json({ error: 'حدث خطأ في حذف تسعير المنتج' });
    }
});

// ── User Management ───────────────────────────────────────────

router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, name: true, role: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ في جلب المستخدمين' });
    }
});

router.put('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'vendor', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'الدور غير صالح' });
        }
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { role },
            select: { id: true, email: true, name: true, role: true },
        });
        res.json(user);
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'المستخدم غير موجود' });
        res.status(500).json({ error: 'حدث خطأ في تحديث الدور' });
    }
});

module.exports = router;
