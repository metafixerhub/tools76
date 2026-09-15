const Submission = require('../models/Submission');

// @desc    Create new submission
// @route   POST /api/submissions
// @access  Public
exports.createSubmission = async (req, res) => {
    try {
        const submission = await Submission.create(req.body);
        res.status(201).json({
            success: true,
            data: submission
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private
exports.getSubmissions = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;

        // Build query
        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Stringify query string
        let queryStr = JSON.stringify(reqQuery);
        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        let query = Submission.find(JSON.parse(queryStr));

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        query = query.skip(skip).limit(limit);

        // Execute query
        const submissions = await query;
        const total = await Submission.countDocuments(JSON.parse(queryStr));

        res.status(200).json({
            success: true,
            count: submissions.length,
            pagination: {
                page,
                limit,
                total
            },
            data: submissions
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get single submission
// @route   GET /api/submissions/:id
// @access  Private
exports.getSubmission = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ success: false, error: 'Submission not found' });
        }
        res.status(200).json({
            success: true,
            data: submission
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private
exports.deleteSubmission = async (req, res) => {
    try {
        const submission = await Submission.findByIdAndDelete(req.params.id);
        if (!submission) {
            return res.status(404).json({ success: false, error: 'Submission not found' });
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
