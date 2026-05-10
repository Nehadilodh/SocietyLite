const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { auth, authGuard, authResident } = require('../middleware/auth');

router.get('/my', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.put('/:id/read', auth, async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ msg: 'Marked as read' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
