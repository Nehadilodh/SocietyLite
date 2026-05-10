const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

router.get('/all', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    const users = await User.find({ role: 'resident' }).select('name flatNo email');
    res.json(users);
});

module.exports = router;