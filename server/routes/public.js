const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const Inquiry = require('../models/Inquiry');
const Notification = require('../models/Notification');
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/public/notices
router.get('/notices', async (req, res) => {
    try {
        const notices = await Notice.find().sort({ date: -1 }).populate('createdBy', 'name');
        res.json(notices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/public/contact
router.post('/contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    try {
        const newInquiry = new Inquiry({ name, email, phone, subject, message });
        await newInquiry.save();
        res.json(newInquiry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/public/notices (Admin only)
router.post('/notices', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Not authorized' });
    }

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

        // Broadcast socket event 'newNotice' to all connected clients
        if (req.app.get('io')) {
            const io = req.app.get('io');
            io.emit('newNotice', notice);
        }

        // Add Notification for all residents
        const residents = await User.find({ role: 'resident' });
        const notifications = residents.map(resident => ({
            userId: resident._id,
            message: `New Notice: ${title}`,
            type: 'Notice',
            link: `/notices`
        }));
        
        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.json(notice);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
