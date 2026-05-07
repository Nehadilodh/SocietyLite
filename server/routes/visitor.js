const express = require('express')
const router = express.Router()
const Visitor = require('../models/Visitor')
const auth = require('../middleware/auth')

// Guard - Naya visitor entry add karna
router.post('/guard/entry', auth, async (req, res) => {
  try {
    const { visitorName, phone, flatNo, purpose } = req.body

    if (!visitorName || !phone || !flatNo || !purpose) {
      return res.status(400).json({ success: false, message: 'All fields required' })
    }

    const visitor = await Visitor.create({
      visitorName,
      phone,
      flatNo,
      purpose,
      guardId: req.user.id,
      status: 'Pending'
    })

    res.status(201).json({ success: true, data: visitor })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Server Error', error: error.message })
  }
})

// Guard - Visitor history lena - Saari entries
router.get('/guard/history', auth, async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ entryTime: -1 })
    res.status(200).json({ success: true, data: visitors })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// Guard - Today's visitors only - OPTIMIZED ROUTE
router.get('/today', auth, async (req, res) => {
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
    console.log(error)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
});

// Guard - Mark visitor as out
router.put('/:id/out', auth, async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      {
        exitTime: new Date(),
        status: 'Exited'
      },
      { new: true }
    );

    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found' });
    }

    res.status(200).json({ success: true, data: visitor });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
});

module.exports = router