const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Guard = require('../models/Guard');
const Bill = require('../models/Bill');
const Complaint = require('../models/Complaint');
const { auth } = require('../middleware/auth');

router.get('/stats', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });

    try {
        const totalResidents = await User.countDocuments({ role: 'resident' });
        const totalGuards = await Guard.countDocuments();
        
        const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' }); // Adjust if status is different
        
        // Active bills (unpaid)
        const activeBills = await Bill.countDocuments({ status: 'Pending' });

        // Monthly Revenue (sum of paid bills for current month, or just total paid for simplicity)
        const paidBills = await Bill.find({ status: 'Paid' });
        const monthlyRevenue = paidBills.reduce((acc, bill) => acc + (bill.amount || 0), 0);

        res.json({
            totalResidents,
            activeBills,
            pendingComplaints,
            monthlyRevenue,
            totalGuards
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
