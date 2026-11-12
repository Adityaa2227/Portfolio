const asyncHandler = require('express-async-handler');
const Testimonial = require('../models/Testimonial');

const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ isApproved: true, isFeatured: true }).sort({ createdAt: -1 });
  // Logic: Public might see all approved? Or just featured? Prompt: "Only visible if admin approves"
  // "Highlight featured testimonials"
  // Let's return all approved ones.
  const allApproved = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 });
  res.json(allApproved);
});

// Public review submission. Always saved unapproved; it only shows on the site after admin approval.
const createTestimonial = asyncHandler(async (req, res) => {
  const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const name = clean(req.body.name, 60);
  const role = clean(req.body.role, 80);
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
  const rating = Math.min(5, Math.max(1, Math.round(Number(req.body.rating) || 5)));

  // Spam trap: the hidden "website" field is only filled in by bots. Pretend success.
  if (req.body.website) {
    return res.status(201).json({ message: 'Review received' });
  }

  if (!name || !role || !message) {
    return res.status(400).json({
      message: 'Please add your name, your role or company, and your review.',
    });
  }

  await Testimonial.create({ name, role, message, rating, isApproved: false, isFeatured: false });
  // Don't echo the document back: the public doesn't need ids or moderation fields.
  res.status(201).json({ message: 'Review received. It will appear once approved.' });
});

const getAdminTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
  res.json(testimonials);
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (testimonial) {
    if (req.body.isApproved !== undefined) testimonial.isApproved = req.body.isApproved;
    if (req.body.isFeatured !== undefined) testimonial.isFeatured = req.body.isFeatured;
    const updated = await testimonial.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Testimonial not found');
  }
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (testimonial) {
    await Testimonial.deleteOne({ _id: testimonial._id });
    res.json({ message: 'Testimonial removed' });
  } else {
    res.status(404);
    throw new Error('Testimonial not found');
  }
});

module.exports = {
  getTestimonials,
  createTestimonial,
  getAdminTestimonials,
  updateTestimonial,
  deleteTestimonial
};
