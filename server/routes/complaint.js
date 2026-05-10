const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const ChatMessage = require('../models/ChatMessage');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { generateComplaintSummary, generateComplaintReply } = require('../services/geminiService');
const { sendComplaintResolvedEmail } = require('../services/emailService');
const { auth } = require('../middleware/auth');

// Create complaint - CHUNK 5 FIX: Pehle Resident ka msg, fir AI reply
router.post('/', auth, async (req, res) => {
    try {
        const complaint = new Complaint({
            ...req.body,
            raisedBy: req.user.id,
            aiSummary: 'Pending AI Summary'
        });
        await complaint.save();

        // 1. PEHLA MSG: Resident ki complaint chat me right side dikhegi
        const residentMsg = new ChatMessage({
            complaintId: complaint._id,
            sender: req.user.id,
            message: `Complaint: ${complaint.title}\n\n${complaint.description}`,
            isAI: false
        });
        await residentMsg.save();
        let populatedMsg = await ChatMessage.findById(residentMsg._id).populate('sender', 'name role');
        req.io.to(complaint._id.toString()).emit('new_chat_message', populatedMsg);

        // 2. DUSRA MSG: AI ka auto reply left side
        const replyText = await generateComplaintReply(complaint.title, complaint.description);
        const aiMsg = new ChatMessage({
            complaintId: complaint._id,
            sender: req.user.id,
            message: replyText,
            isAI: true
        });
        await aiMsg.save();
        populatedMsg = await ChatMessage.findById(aiMsg._id).populate('sender', 'name role');
        req.io.to(complaint._id.toString()).emit('new_chat_message', populatedMsg);

        res.json(complaint);
    } catch (err) {
        console.log(err);
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

// Admin only: manual AI reply
router.post('/:id/ai-reply', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).send('Not authorized');
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
            message: req.body.message,
            isAI: false
        });
        await msg.save();

        const populatedMsg = await ChatMessage.findById(msg._id).populate('sender', 'name role');
        req.io.to(req.params.id).emit('new_chat_message', populatedMsg);
        res.json(populatedMsg);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update status - CHUNK 5 FIX: AI MSG + NOTIFICATION + EMAIL
router.put('/:id/status', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).send('Not authorized');

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        ).populate('raisedBy', 'name email flatNo');

        // 1. CHAT ME AI SYSTEM MESSAGE - Left side dikhega
        const systemMsg = new ChatMessage({
            complaintId: complaint._id,
            sender: req.user.id,
            message: `Admin has changed your complaint status to ${req.body.status}`,
            isAI: true
        });
        await systemMsg.save();

        const populatedMsg = await ChatMessage.findById(systemMsg._id).populate('sender', 'name role');
        req.io.to(complaint._id.toString()).emit('new_chat_message', populatedMsg);

        // 2. NOTIFICATION TABLE ME ENTRY - Dashboard pe dikhega
        const notif = new Notification({
            userId: complaint.raisedBy._id,
            flatNo: complaint.raisedBy.flatNo,
            message: `Your complaint "${complaint.title}" status updated to ${req.body.status}`,
            type: 'complaint',
            link: `/resident/complaints/${complaint._id}`
        });
        await notif.save();

        // 3. SOCKET SE REALTIME NOTIFICATION
        req.io.to(complaint.raisedBy._id.toString()).emit('new_notification', notif);
        req.io.to(complaint.raisedBy._id.toString()).emit('complaint_status_update', {
            complaintId: complaint._id,
            title: complaint.title,
            status: req.body.status
        });

        // 4. EMAIL BHEJO - In Progress + Resolved dono pe
        if (complaint.raisedBy && complaint.raisedBy.email) {
            if (req.body.status === 'In Progress' || req.body.status === 'Resolved') {
                await sendComplaintResolvedEmail(
                    complaint.raisedBy.email,
                    `${complaint.title} - Status: ${req.body.status}`
                );
            }
        }

        res.json(complaint);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

// Get all - Admin only
router.get('/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).send('Not authorized');
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