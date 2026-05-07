const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// GET /api/bill/my
router.get('/my', auth, async (req, res) => {
    try {
        const bills = await Bill.find({ userId: req.user.id }).sort({ dueDate: 1 });
        res.json(bills);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/bill/generate (Admin only)
router.post('/generate', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Not authorized' });
    }

    const { userId, month, amount, dueDate } = req.body;

    try {
        const newBill = new Bill({ userId, month, amount, dueDate });
        const bill = await newBill.save();

        // Create notification for the specific user
        const notification = new Notification({
            userId,
            message: `New bill generated for ${month}. Amount: ₹${amount}`,
            type: 'Bill',
            link: '/bills'
        });
        await notification.save();

        // Emit socket notification to the specific user's room
        if (req.app.get('io')) {
            const io = req.app.get('io');
            io.to(`user_${userId}`).emit('newNotification', notification);
        }

        res.json(bill);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/bill/pay
router.post('/pay', auth, async (req, res) => {
    // Generate dummy order ID for Razerpay simulation
    res.json({ orderId: 'dummy_order_id_' + Date.now(), amount: req.body.amount });
});

// POST /api/bill/verify
router.post('/verify', auth, async (req, res) => {
    const { billId, razorpayPaymentId } = req.body;

    try {
        let bill = await Bill.findById(billId);
        if (!bill) return res.status(404).json({ msg: 'Bill not found' });

        bill.status = 'Paid';
        bill.razorpayPaymentId = razorpayPaymentId;
        bill.paidAt = Date.now();
        await bill.save();

        res.json(bill);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
