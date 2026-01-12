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
      // Create transporter
      const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: true, // true for 465, false for other ports
          auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
          }
      });

      // Send mail
      await transporter.sendMail({
          from: `"${name}" <${email}>`, // sender address
          to: process.env.ADMIN_EMAIL, // receiver
          subject: `Portfolio Contact: ${name}`,
          text: message,
          html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`
      });

      console.log(`Email sent from ${email}`);
  } catch (error) {
      console.error('Email send error:', error);
      // We don't fail the request if email fails, but we might want to log it
  }

  res.status(201).json({ message: 'Message sent successfully', contact });
});

// @route   GET /api/contact (Admin)
const getMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
  res.json(messages);
});

module.exports = { submitContact, getMessages };
