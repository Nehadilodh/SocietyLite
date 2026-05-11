const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'guard', 'resident'], required: true },
    flatNo: { type: String, required: function() { return this.role === 'resident'; } }, // Only required for residents
    phone: { type: String, required: true, match: /^[0-9]{10}$/ },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
