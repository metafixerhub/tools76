const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ],
        index: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        maxlength: [20, 'Phone number cannot be longer than 20 characters'],
        index: true
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    state: {
        type: String,
        required: [true, 'State is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    pinZip: {
        type: String,
        required: [true, 'PIN/ZIP code is required']
    },
    interests: {
        type: [String],
        enum: ['Software', 'Robotics', 'AI', 'Hardware', 'Data Science', 'Other'],
        required: true
    },
    pharmacyMarket: {
        type: String,
        enum: ['Yes', 'No', 'Maybe'],
        required: [true, 'Please specify if interested in pharmacy market']
    },
    customQuestions: {
        type: Map,
        of: String
    },
    consentGiven: {
        type: Boolean,
        required: [true, 'Consent must be given to submit the form']
    },
    source: {
        type: String,
        default: 'Website Form'
    },
    utmInfo: {
        source: String,
        medium: String,
        campaign: String
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Submission', submissionSchema);
