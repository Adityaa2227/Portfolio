const express = require('express');
const router = express.Router();
const { getBio, updateBio } = require('../controllers/bioController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getBio);
router.put('/', protect, updateBio);

module.exports = router;
