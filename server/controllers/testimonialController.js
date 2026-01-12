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

const createTestimonial = asyncHandler(async (req, res) => {
  const { name, role, message, rating } = req.body;
  const testimonial = await Testimonial.create({
    name, role, message, rating,
    isApproved: false // Hidden by default
  });
  res.status(201).json(testimonial);
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
