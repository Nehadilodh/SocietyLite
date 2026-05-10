const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flatNo: String,
  message: { type: String, required: true },
  type: { type: String, enum: ['visitor', 'alert', 'complaint', 'bill', 'sos'], required: true },
  read: { type: Boolean, default: false },
  link: String
}, { timestamps: true });
module.exports = mongoose.model('Notification', NotificationSchema);
