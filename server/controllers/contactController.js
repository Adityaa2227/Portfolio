const asyncHandler = require('express-async-handler');
const ContactMessage = require('../models/ContactMessage');
const nodemailer = require('nodemailer');

// @route   POST /api/contact
const submitContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  // Save to DB
  const contact = await ContactMessage.create({ name, email, message });

  // Send Email
  try {
      console.log('Attempting to send email via:', process.env.SMTP_HOST);
      // Create transporter
      const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: 587, // More reliable for cloud hosting than 465
          secure: false, // Use STARTTLS
          auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
          },
          connectionTimeout: 10000, // 10 seconds timeout
          greetingTimeout: 10000
      });

      // Send mail
      await transporter.sendMail({
          from: process.env.SMTP_USER,
          replyTo: email,
          to: process.env.ADMIN_EMAIL,
          subject: `Portfolio Contact: ${name}`,
          text: message,
          html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`
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
