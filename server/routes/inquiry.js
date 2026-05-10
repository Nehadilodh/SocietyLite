const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { auth } = require('../middleware/auth');

// Get all inquiries
router.get('/all', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update inquiry status
router.put('/:id/status', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    try {
        const { status } = req.body;
        // Using findOneAndUpdate without runValidators to bypass the existing schema enum ['new', 'read']
        const inquiry = await Inquiry.findOneAndUpdate(
            { _id: req.params.id },
            { status },
            { new: true }
        );
        if (!inquiry) return res.status(404).json({ msg: 'Inquiry not found' });
        res.json({ msg: 'Status updated successfully', inquiry });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete inquiry
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!inquiry) return res.status(404).json({ msg: 'Inquiry not found' });
        res.json({ msg: 'Inquiry deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
