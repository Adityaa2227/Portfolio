const express = require('express');
const router = express.Router();
const { getResume, uploadResume, getAllResumes, setActiveResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getResume)
  .post(protect, upload.single('resume'), uploadResume);

router.route('/all')
  .get(protect, getAllResumes);

router.route('/:id/active')
  .put(protect, setActiveResume);

module.exports = router;
