const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/plans
router.get('/', async (req, res) => {
    try {
        const plans = await prisma.subscriptionPlan.findMany({
            orderBy: { tier: 'asc' },
        });
        res.json(plans);
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ في جلب الخطط' });
    }
});

module.exports = router;
