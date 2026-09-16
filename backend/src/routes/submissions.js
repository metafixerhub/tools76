const express = require('express');
const {
    createSubmission,
    getSubmissions,
    getSubmission,
    deleteSubmission
} = require('../controllers/submissionController');

const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for public submission endpoint
const submissionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 submissions per windowMs
    message: { success: false, error: 'Too many submissions from this IP, please try again after 15 minutes' }
});
router.route('/')
    .post(submissionLimiter, createSubmission) // Public route
    .get(getSubmissions); // Public route
router.route('/:id')
    .get(getSubmission) // Public route
    .delete(deleteSubmission); // Public route

module.exports = router;

