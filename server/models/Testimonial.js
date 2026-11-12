const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
