const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },   // optional
  subject: { type: String, default: '' }, // optional, e.g. Internship / Collaboration
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
