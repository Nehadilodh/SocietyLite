// Visitor Log routes
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const VisitorLog = require('../models/VisitorLog');
const Notification = require('../models/Notification');

// @route   GET /api/visitorlog/today
// @desc    Get today's visitor logs
// @access  Private
router.get('/today', auth, async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const logs = await VisitorLog.find({ inTime: { $gte: startOfDay } })
            .populate('guardId', 'name')
            .sort({ inTime: -1 });

        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/visitorlog
// @desc    Create new visitor log
// @access  Private
router.post('/', auth, async (req, res) => {
    const { visitorName, phone, flatNo, purpose } = req.body;

    try {
        const newLog = new VisitorLog({
            visitorName,
            phone,
            flatNo,
            purpose,
            guardId: req.user.id
        });

        const log = await newLog.save();

        // Auto create notification for the resident of that flat
        const notification = new Notification({
            flatNo,
            message: `A visitor (${visitorName}) has arrived at the gate for ${purpose}.`
        });
        await notification.save();

        res.json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/visitorlog/:id/out
// @desc    Update out time for a visitor
// @access  Private
router.put('/:id/out', auth, async (req, res) => {
    try {
        let log = await VisitorLog.findById(req.params.id);

        if (!log) {
            return res.status(404).json({ msg: 'Log not found' });
        }

        log.outTime = Date.now();
        await log.save();

        res.json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
