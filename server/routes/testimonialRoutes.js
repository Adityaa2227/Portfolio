const express = require('express');
const router = express.Router();
const { getTestimonials, createTestimonial, getAdminTestimonials, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTestimonials)
  .post(createTestimonial);

router.route('/admin')
  .get(protect, getAdminTestimonials);

router.route('/:id')
  .put(protect, updateTestimonial)
  .delete(protect, deleteTestimonial);

module.exports = router;
