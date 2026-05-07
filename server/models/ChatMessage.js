const mongoose = require('mongoose');
const ChatMessageSchema = new mongoose.Schema({
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  isAI: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
