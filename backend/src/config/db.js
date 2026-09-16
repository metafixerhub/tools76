const mongoose = require('mongoose');

// Vercel Serverless Connection Caching
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not set in Vercel Environment Variables!');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
        }).then((mongoose) => {
            console.log('MongoDB Connected successfully');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error(`MongoDB Connection Error: ${e.message}`);
        throw e;
    }

    return cached.conn;
};

module.exports = connectDB;
