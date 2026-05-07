const mongoose = require('mongoose');
const complaintSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    photo: { type: String },
    aiSummary: { type: String, default: 'Pending AI Summary' },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' }
}, { timestamps: true });
module.exports = mongoose.model('Complaint', complaintSchema);
