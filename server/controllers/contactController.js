const asyncHandler = require('express-async-handler');
const ContactMessage = require('../models/ContactMessage');
const nodemailer = require('nodemailer');

// @route   POST /api/contact
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
// Visitor input goes into an HTML email, so escape it.
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const submitContact = asyncHandler(async (req, res) => {
  const name = str(req.body.name, 100);
  const email = str(req.body.email, 200);
  const phone = str(req.body.phone, 30);     // optional
  const subject = str(req.body.subject, 120); // optional
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please add your name, email and a message.' });
  }

  // Save to DB
  const contact = await ContactMessage.create({ name, email, phone, subject, message });

  // Send Email
  try {
      console.log('Attempting to send email via:', process.env.SMTP_HOST);
      // Create transporter
      const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT, // Back to 465 (SSL) which was verified working
          secure: true, // true for 465
          auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000
      });

      // Send mail
      await transporter.sendMail({
          from: process.env.SMTP_USER,
          replyTo: email,
          to: process.env.ADMIN_EMAIL,
          subject: `Portfolio Contact: ${name}${subject ? ` (${subject})` : ''}`,
          text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nSubject: ${subject || '-'}\n\n${message}`,
          html: `<p><strong>Name:</strong> ${esc(name)}</p><p><strong>Email:</strong> ${esc(email)}</p>`
            + `<p><strong>Phone:</strong> ${esc(phone) || '-'}</p><p><strong>Subject:</strong> ${esc(subject) || '-'}</p>`
            + `<p><strong>Message:</strong><br/>${esc(message).replace(/\n/g, '<br/>')}</p>`
      });

      console.log(`Email successfully sent from ${email}`);
      res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (error) {
      console.error('CRITICAL: Email send error:', error.message);
      // Still return 201 because message is saved in DB, but notify about email failure
      res.status(201).json({ 
          message: 'Message saved but email notification failed', 
          contact,
          warning: 'Email notification failed' 
      });
  }
});

// @route   GET /api/contact (Admin)
const getMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
  res.json(messages);
});

module.exports = { submitContact, getMessages };
