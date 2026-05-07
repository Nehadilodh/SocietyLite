const mongoose = require('mongoose');
const visitorSchema = new mongoose.Schema({
    visitorName: { type: String, required: true },
    phone: { type: String, required: true },
    flatNo: { type: String, required: true },
    purpose: { type: String, enum: ['Delivery', 'Guest', 'Maintenance', 'Cab', 'Other'], required: true },
    entryTime: { type: Date, default: Date.now },
    exitTime: { type: Date, default: null },
    status: { type: String, enum: ['Pending', 'Approved', 'Denied', 'NotHome'], default: 'Pending' },
    guardId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
module.exports = mongoose.model('Visitor', visitorSchema);

