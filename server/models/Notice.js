const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['meeting', 'rule', 'event', 'general'], default: 'general' },
    priority: { type: String, enum: ['Normal', 'Urgent'], default: 'Normal' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notice', noticeSchema);
