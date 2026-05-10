const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { auth } = require('../middleware/auth');

// Get all notices
router.get('/all', auth, async (req, res) => {
    try {
        const notices = await Notice.find().sort({ date: -1 }).populate('createdBy', 'name');
        res.json(notices);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Add new notice
router.post('/add', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    
    const { title, description, type, priority } = req.body;
    try {
        const newNotice = new Notice({
            title,
            description,
            type,
            priority,
            createdBy: req.user.id
        });
        const notice = await newNotice.save();
        res.status(201).json({ msg: 'Notice added successfully', notice });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update notice
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    
    const { title, description, type, priority } = req.body;
    try {
        const updateData = { title, description, type, priority };
        const notice = await Notice.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('createdBy', 'name');
        if (!notice) return res.status(404).json({ msg: 'Notice not found' });
        
        res.json({ msg: 'Notice updated successfully', notice });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete notice
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    
    try {
        const notice = await Notice.findByIdAndDelete(req.params.id);
        if (!notice) return res.status(404).json({ msg: 'Notice not found' });
        
        res.json({ msg: 'Notice deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
