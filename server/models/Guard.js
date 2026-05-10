const mongoose = require('mongoose');

const guardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    shift: { type: String, required: true },
    dutyArea: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Guard', guardSchema);
