const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const ChatMessage = require('../models/ChatMessage');
const { generateComplaintSummary, generateComplaintReply } = require('../services/geminiService');
const { sendComplaintResolvedEmail } = require('../services/emailService');
const { auth, authGuard, authResident } = require('../middleware/auth');

// Create complaint
router.post('/', auth, async (req, res) => {
    try {
        const complaint = new Complaint({
            ...req.body,
            raisedBy: req.user.id,
            aiSummary: 'Pending AI Summary'
        });
        await complaint.save();
        res.json(complaint);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Admin only: generate summary
router.post('/:id/generate-summary', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).send('Not authorized');
        const complaint = await Complaint.findById(req.params.id);
        const summary = await generateComplaintSummary(complaint.description);
        complaint.aiSummary = summary;
        await complaint.save();
        res.json(complaint);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Admin only: generate AI reply
router.post('/:id/ai-reply', auth, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        const replyText = await generateComplaintReply(complaint.title, complaint.description);

        const chatMsg = new ChatMessage({
            complaintId: complaint._id,
            sender: req.user.id,
            message: replyText,
            isAI: true
        });
        await chatMsg.save();

        const populatedMsg = await ChatMessage.findById(chatMsg._id).populate('sender', 'name role');
        req.io.to(complaint._id.toString()).emit('new_chat_message', populatedMsg);

        res.json(populatedMsg);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update complaint
router.put('/:id', auth, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (req.user.id !== complaint.raisedBy.toString() || complaint.status !== 'Open') {
            return res.status(403).send('Not authorized');
        }
        const updated = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete complaint
router.delete('/:id', auth, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (req.user.id !== complaint.raisedBy.toString() || complaint.status !== 'Open') {
            return res.status(403).send('Not authorized');
        }
        await Complaint.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get chat messages
router.get('/:id/chat', auth, async (req, res) => {
    try {
        const messages = await ChatMessage.find({ complaintId: req.params.id }).populate('sender', 'name role').sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Add chat message
router.post('/:id/chat', auth, async (req, res) => {
    try {
        const msg = new ChatMessage({
            complaintId: req.params.id,
            sender: req.user.id,
            message: req.body.message
        });
        await msg.save();

        const populatedMsg = await ChatMessage.findById(msg._id).populate('sender', 'name role');
        req.io.to(req.params.id).emit('new_chat_message', populatedMsg);
        res.json(populatedMsg);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update status
router.put('/:id/status', auth, async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('raisedBy');
        if (req.body.status === 'Resolved' && complaint.raisedBy && complaint.raisedBy.email) {
            await sendComplaintResolvedEmail(complaint.raisedBy.email, complaint.title);
        }
        res.json(complaint);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get all
router.get('/all', auth, async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('raisedBy', 'name flatNo').sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get my complaints
router.get('/my', auth, async (req, res) => {
    try {
        const complaints = await Complaint.find({ raisedBy: req.user.id }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;