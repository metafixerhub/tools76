const express = require('express');
// No auth
const Submission = require('../models/Submission');

const router = express.Router();

// @desc    Get dashboard statistics
// @route   GET /api/stats
// @access  Private
router.get('/', async (req, res) => {
    try {
        const totalSubmissions = await Submission.countDocuments();
        
        // Calculate today's submissions
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const todaySubmissions = await Submission.countDocuments({
            createdAt: { $gte: startOfToday }
        });

        // Calculate this week's submissions
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const weekSubmissions = await Submission.countDocuments({
            createdAt: { $gte: startOfWeek }
        });

        // Calculate this month's submissions
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const monthSubmissions = await Submission.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        res.status(200).json({
            success: true,
            data: {
                total: totalSubmissions,
                today: todaySubmissions,
                week: weekSubmissions,
                month: monthSubmissions
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
