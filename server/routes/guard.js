const express = require('express');
const router = express.Router();
const Guard = require('../models/Guard');
const { auth } = require('../middleware/auth');

// Get all guards
router.get('/all', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    try {
        const guards = await Guard.find().sort({ createdAt: -1 });
        res.json(guards);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Add new guard
router.post('/add', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    
    const { name, phone, shift, dutyArea, joiningDate } = req.body;
    try {
        const newGuard = new Guard({ name, phone, shift, dutyArea, joiningDate });
        await newGuard.save();
        res.status(201).json({ msg: 'Guard added successfully', guard: newGuard });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update guard
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    
    const { name, phone, shift, dutyArea, joiningDate } = req.body;
    try {
        const updateData = { name, phone, shift, dutyArea, joiningDate };
        const guard = await Guard.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!guard) return res.status(404).json({ msg: 'Guard not found' });
        
        res.json({ msg: 'Guard updated successfully', guard });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete guard
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    
    try {
        const guard = await Guard.findByIdAndDelete(req.params.id);
        if (!guard) return res.status(404).json({ msg: 'Guard not found' });
        
        res.json({ msg: 'Guard deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
