const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Bill = require('../models/Bill');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

// Razorpay instance - agar keys nahi hai to error nahi dega
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
}

// GET /api/bill/my - Resident ke bills
router.get('/my', auth, async (req, res) => {
    try {
        const bills = await Bill.find({ userId: req.user.id }).sort({ dueDate: -1 });
        res.json(bills);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/bill/all - Admin ke liye sare bills
router.get('/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
        const bills = await Bill.find().populate('userId', 'name flatNo email').sort({ dueDate: -1 });
        res.json(bills);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/bill/generate - Admin bill generate kare
router.post('/generate', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Not authorized' });
    }

    const { userId, month, amount, dueDate } = req.body;

    try {
        // Check if bill already exists for this user+month
        const existing = await Bill.findOne({ userId, month });
        if (existing) return res.status(400).json({ msg: 'Bill already exists for this month' });

        const newBill = new Bill({ userId, month, amount, dueDate });
        const bill = await newBill.save();

        // Create notification for the specific user
        const user = await User.findById(userId);
        const notification = new Notification({
            userId,
            flatNo: user.flatNo,
            message: `New maintenance bill for ${month}. Amount: ₹${amount}. Due: ${new Date(dueDate).toLocaleDateString()}`,
            type: 'bill',
            link: '/resident/bills'
        });
        await notification.save();

        // Emit socket notification to the specific user's room
        req.io.to(userId.toString()).emit('new_notification', notification);

        res.json(bill);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/bill/pay - Create Razorpay order
router.post('/pay', auth, async (req, res) => {
    const { billId, amount } = req.body;

    try {
        if (!razorpay) {
            // Dummy order agar keys nahi hai
            return res.json({
                orderId: 'dummy_order_' + Date.now(),
                amount: amount,
                key: 'rzp_test_dummy'
            });
        }

        const options = {
            amount: amount * 100, // Razorpay takes paise
            currency: "INR",
            receipt: `bill_${billId}`
        };

        const order = await razorpay.orders.create(options);
        res.json({
            orderId: order.id,
            amount: order.amount,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/bill/verify - Verify payment and update status
router.post('/verify', auth, async (req, res) => {
    const { billId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    try {
        let bill = await Bill.findById(billId);
        if (!bill) return res.status(404).json({ msg: 'Bill not found' });

        // Verify signature if real Razorpay
        if (razorpay && razorpaySignature) {
            const body = razorpayOrderId + "|" + razorpayPaymentId;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');

            if (expectedSignature !== razorpaySignature) {
                return res.status(400).json({ msg: 'Payment verification failed' });
            }
        }

        bill.status = 'Paid';
        bill.razorpayOrderId = razorpayOrderId;
        bill.razorpayPaymentId = razorpayPaymentId || 'dummy_payment_' + Date.now();
        bill.paidAt = Date.now();
        await bill.save();

        // Notify admin about payment
        const notification = new Notification({
            userId: req.user.id,
            flatNo: req.user.flatNo,
            message: `Payment received for ${bill.month} bill: ₹${bill.amount}`,
            type: 'bill',
            link: '/admin/bills'
        });
        await notification.save();

        res.json(bill);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// PUT /api/bill/:id - Update bill details
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) return res.status(404).json({ msg: 'Bill not found' });
        if (bill.status !== 'Unpaid') return res.status(400).json({ msg: 'Only unpaid bills can be edited' });

        bill.amount = req.body.amount || bill.amount;
        bill.dueDate = req.body.dueDate || bill.dueDate;
        
        await bill.save();
        res.json({ msg: 'Bill updated successfully', bill });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /api/bill/:id - Delete a bill
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });

    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) return res.status(404).json({ msg: 'Bill not found' });
        if (bill.status !== 'Unpaid') return res.status(400).json({ msg: 'Only unpaid bills can be deleted' });

        await bill.deleteOne();
        res.json({ msg: 'Bill deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;