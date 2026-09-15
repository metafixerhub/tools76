const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        console.error('CRITICAL ERROR: MONGODB_URI is not set in Vercel Environment Variables!');
        return;
    }
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        // Removed process.exit(1) because it crashes Vercel Serverless Functions immediately
    }
};

module.exports = connectDB;
