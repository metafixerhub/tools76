const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const app = express();

// Database Connection Middleware for Vercel
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to connect to database. Please check Vercel Environment Variables and MongoDB IP Access List.'
        });
    }
});

// Security middleware
app.use(helmet());
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Route files
const submissions = require('./routes/submissions');
const auth = require('./routes/auth');
const stats = require('./routes/stats');

// Mount routers
app.use('/api/submissions', submissions);
app.use('/api/auth', auth);
app.use('/api/stats', stats);
app.use('/api/health', (req, res) => res.status(200).json({ success: true, message: 'API is running' }));

// Custom error handling middleware
// TODO: Add error handler

const PORT = process.env.PORT || 5000;

// Export the app for Vercel Serverless Functions
module.exports = app;

// Only listen locally if not in Vercel
if (process.env.NODE_ENV !== 'production' || process.env.LISTEN_LOCALLY === 'true') {
    const server = app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
        console.log(`Error: ${err.message}`);
        // Close server & exit process
        server.close(() => process.exit(1));
    });
}
