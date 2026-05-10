const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const { auth, authGuard, authResident } = require('../middleware/auth');

router.post('/trigger', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const alertMessage = `SOS Alert from Flat ${user.flatNo} (${user.name})`;

        const staff = await User.find({ role: { $in: ['admin', 'guard'] } });

        const notifications = staff.map(st => ({
            userId: st._id,
            flatNo: user.flatNo,
            message: alertMessage,
            type: 'sos',
            link: '#'
        }));
        await Notification.insertMany(notifications);

        req.io.emit('new_sos_alert', { flatNo: user.flatNo, message: alertMessage });

        res.json({ msg: 'SOS triggered' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
