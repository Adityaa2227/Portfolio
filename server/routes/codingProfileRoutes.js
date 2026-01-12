const express = require('express');
const router = express.Router();
const { getProfiles, createProfile, updateProfile, deleteProfile } = require('../controllers/codingProfileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProfiles);
router.post('/', protect, createProfile);
router.put('/:id', protect, updateProfile);
router.delete('/:id', protect, deleteProfile);

module.exports = router;
