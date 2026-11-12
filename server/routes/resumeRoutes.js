const express = require('express');
const router = express.Router();
const { getResume, downloadResume, uploadResume, getAllResumes, setActiveResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
// Memory storage: the PDF is sent to ImageKit (Render's disk is wiped on every restart).
const upload = require('../middleware/uploadMemoryMiddleware');

router.route('/')
  .get(getResume)
  .post(protect, upload.single('resume'), uploadResume);

router.get('/download', downloadResume);

router.route('/all')
  .get(protect, getAllResumes);

router.route('/:id/active')
  .put(protect, setActiveResume);

module.exports = router;
