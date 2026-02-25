require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const companyRoutes = require('./routes/companies');
const categoryRoutes = require('./routes/categories');
const planRoutes = require('./routes/plans');
const bookmarkRoutes = require('./routes/bookmarks');
const adminRoutes = require('./routes/admin');
const submissionRoutes = require('./routes/submissions');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security ──────────────────────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            frameSrc: ["'self'", "https:"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        },
    },
}));
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// ── Rate Limiting ─────────────────────────────────────────────
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: { error: 'تجاوزت الحد المسموح من الطلبات. حاول لاحقًا.' },
});

const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: 'محاولات كثيرة. حاول بعد دقيقة.' },
});

// ── Static Files ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '..')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/products', apiLimiter, productRoutes);
app.use('/api/v1/companies', apiLimiter, companyRoutes);
app.use('/api/v1/categories', apiLimiter, categoryRoutes);
app.use('/api/v1/plans', apiLimiter, planRoutes);
app.use('/api/v1/me/bookmarks', apiLimiter, bookmarkRoutes);
app.use('/api/v1/admin', apiLimiter, adminRoutes);
app.use('/api/v1/submissions', rateLimit({ windowMs: 60 * 1000, max: 10, message: { error: 'محاولات كثيرة. حاول بعد دقيقة.' } }), submissionRoutes);

// ── SPA Fallback ──────────────────────────────────────────────
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'المسار غير موجود' });
    }
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ── Error Handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('❌ خطأ:', err.message);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'حدث خطأ في الخادم' : err.message,
    });
});

app.listen(PORT, () => {
    console.log(`🚀 SoftMarket يعمل على http://localhost:${PORT}`);
});

module.exports = app;
