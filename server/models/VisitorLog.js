// Visitor Log model
const mongoose = require('mongoose');

const VisitorLogSchema = new mongoose.Schema({
    visitorName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    flatNo: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: ['Delivery', 'Guest', 'Maintenance', 'Cab', 'Other'],
        required: true
    },
    inTime: {
        type: Date,
        default: Date.now
    },
    outTime: {
        type: Date,
        default: null
    },
    guardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('VisitorLog', VisitorLogSchema);
