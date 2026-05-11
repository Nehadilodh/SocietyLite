const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Get all residents
router.get('/all', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    try {
        const users = await User.find({ role: 'resident' }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Add new resident
router.post('/add', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    
    const { name, email, phone, flatNo, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, phone, flatNo, password: hashedPassword, role: 'resident' });
        await user.save();
        res.status(201).json({ msg: 'Resident added successfully', user: { _id: user._id, name: user.name, email: user.email, flatNo: user.flatNo, phone: user.phone } });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email already registered" });
        }
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update resident profile
router.put('/profile', auth, async (req, res) => {
    const { name, phone, password } = req.body;
    try {
        let updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Fix: Use req.user.id instead of req.user._id because auth middleware decoded payload stores it as user.id
        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        res.json({ msg: 'Profile updated successfully', user });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email already registered" });
        }
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update resident
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    
    const { name, email, phone, flatNo, password } = req.body;
    try {
        let updateData = { name, email, phone, flatNo };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        res.json({ msg: 'Resident updated successfully', user });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email already registered" });
        }
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete resident
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        res.json({ msg: 'Resident deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;