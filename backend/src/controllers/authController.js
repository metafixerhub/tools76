const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a user (First time setup or manual admin creation)
// @route   POST /api/auth/register
// @access  Public (Should be protected or removed in production after initial setup)
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password, // NOTE: In production, password should be hashed with bcrypt!
            role
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id)
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Login user with simple passkey
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { passkey } = req.body;

        if (!passkey) {
            return res.status(400).json({ success: false, error: 'Please provide a passkey' });
        }

        // Check if passkey matches the provided key 'nur1438nur'
        if (passkey !== 'nur1438nur') {
            return res.status(401).json({ success: false, error: 'Invalid passkey' });
        }

        // We use a dummy ID since there is no actual user document needed anymore
        const adminId = 'admin_001';

        res.status(200).json({
            success: true,
            token: generateToken(adminId),
            user: {
                id: adminId,
                name: 'Admin',
                role: 'admin'
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        // Return dummy admin since we are using a single passkey system
        res.status(200).json({
            success: true,
            data: {
                id: 'admin_001',
                name: 'Admin',
                role: 'admin'
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
