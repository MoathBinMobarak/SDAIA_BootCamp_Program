const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const router = express.Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
    email: z.string().email('بريد إلكتروني غير صالح'),
    password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
    name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
});

const loginSchema = z.object({
    email: z.string().email('بريد إلكتروني غير صالح'),
    password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

function generateTokens(user) {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
}

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
    try {
        const data = registerSchema.parse(req.body);
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            return res.status(409).json({ error: 'البريد الإلكتروني مسجل مسبقًا' });
        }

        const passwordHash = await bcrypt.hash(data.password, 12);
        const user = await prisma.user.create({
            data: { email: data.email, passwordHash, name: data.name },
        });

        const tokens = generateTokens(user);
        await prisma.refreshToken.create({
            data: {
                token: tokens.refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        res.status(201).json({
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            ...tokens,
        });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.errors[0].message });
        }
        res.status(500).json({ error: 'حدث خطأ في التسجيل' });
    }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
    try {
        const data = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) {
            return res.status(401).json({ error: 'بريد إلكتروني أو كلمة مرور غير صحيحة' });
        }

        const valid = await bcrypt.compare(data.password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({ error: 'بريد إلكتروني أو كلمة مرور غير صحيحة' });
        }

        const tokens = generateTokens(user);
        await prisma.refreshToken.create({
            data: {
                token: tokens.refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        res.json({
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            ...tokens,
        });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.errors[0].message });
        }
        res.status(500).json({ error: 'حدث خطأ في تسجيل الدخول' });
    }
});

// POST /api/v1/auth/refresh
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'رمز التحديث مطلوب' });
        }

        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            return res.status(401).json({ error: 'رمز التحديث غير صالح أو منتهي' });
        }

        // Verify JWT
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Delete old token and create new pair
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });
        const tokens = generateTokens(storedToken.user);
        await prisma.refreshToken.create({
            data: {
                token: tokens.refreshToken,
                userId: storedToken.user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        res.json(tokens);
    } catch (err) {
        res.status(401).json({ error: 'رمز التحديث غير صالح' });
    }
});

// POST /api/v1/auth/logout
router.post('/logout', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
        }
        res.json({ message: 'تم تسجيل الخروج بنجاح' });
    } catch (err) {
        res.json({ message: 'تم تسجيل الخروج' });
    }
});

module.exports = router;
