const nodemailer = require('nodemailer');

exports.sendComplaintResolvedEmail = async (to, title) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: `Complaint Resolved: ${title}`,
            text: `Hello, your complaint "${title}" is resolved.\nRegards,\nSocietyLite`
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email error:', error);
    }
};
