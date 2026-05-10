const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const { authGuard, authResident } = require('../middleware/auth');

// Guard - Naya visitor entry add karna + Realtime notify
router.post('/guard/entry', authGuard, async (req, res) => {
  try {
    const { visitorName, phone, flatNo, purpose } = req.body;
    if (!visitorName || !phone || !flatNo || !purpose) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    const visitor = await Visitor.create({
      visitorName,
      phone,
      flatNo,
      purpose,
      guardId: req.user.id,
      status: 'Pending'
    });

    // CHUNK 4: REALTIME - Resident ko notify karo
    req.io.to(flatNo).emit('visitor_request', visitor);
    req.io.to(flatNo).emit('new_visitor_entry', visitor); // Stats refresh ke liye

    res.status(201).json({ success: true, data: visitor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Guard - Visitor history lena
router.get('/guard/history', authGuard, async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ entryTime: -1 });
    res.status(200).json({ success: true, data: visitors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Guard - Today's visitors
router.get('/today', authGuard, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const visitors = await Visitor.find({
      entryTime: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ entryTime: -1 });

    res.status(200).json({ success: true, data: visitors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Guard - Mark visitor as out
router.put('/:id/out', authGuard, async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { exitTime: new Date(), status: 'Exited' },
      { new: true }
    );
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found' });
    }
    res.status(200).json({ success: true, data: visitor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// ===== RESIDENT ROUTES START =====

// 1. RESIDENT - Pending visitors
router.get('/resident/pending', authResident, async (req, res) => {
  try {
    const pending = await Visitor.find({
      flatNo: req.user.flatNo,
      status: 'Pending'
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: pending });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 2. RESIDENT - Approve/Deny/Not Home - ROUTE FIX KIYA
router.put('/resident/respond/:id', authResident, async (req, res) => {
  try {
    const { status } = req.body; // 'Approved', 'Denied', 'Not Home'
    const visitor = await Visitor.findOneAndUpdate(
      { _id: req.params.id, flatNo: req.user.flatNo },
      {
        status,
        approvedBy: req.user.name,
        entryTime: status === 'Approved' ? new Date() : undefined
      },
      { new: true }
    );

    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found' });
    }

    // Guard ko update bhejo - 2 event bhej rahe
    req.io.emit('visitor_updated', visitor);
    req.io.emit('visitor_status_update', {
      visitorName: visitor.visitorName,
      status,
      flatNo: visitor.flatNo
    });

    res.json({ success: true, data: visitor });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 3. RESIDENT - History
router.get('/resident/history', authResident, async (req, res) => {
  try {
    const history = await Visitor.find({
      flatNo: req.user.flatNo
    }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 4. RESIDENT - SOS Alert
router.post('/resident/sos', authResident, async (req, res) => {
  try {
    const sosData = {
      flatNo: req.user.flatNo,
      name: req.user.name,
      time: new Date(),
      message: 'EMERGENCY SOS ALERT FROM RESIDENT'
    };
    req.io.emit('new_sos_alert', sosData);
    res.json({ success: true, msg: 'SOS sent to all guards' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;