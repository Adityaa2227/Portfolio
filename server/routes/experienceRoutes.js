const express = require('express');
const router = express.Router();
const { getExperiences, createExperience, updateExperience, deleteExperience, reorderExperience } = require('../controllers/experienceController');
const { protect } = require('../middleware/authMiddleware'); // Assuming auth middleware exists

router.get('/', getExperiences);
router.post('/', protect, createExperience);
router.put('/reorder', protect, reorderExperience);
router.put('/:id', protect, updateExperience);
router.delete('/:id', protect, deleteExperience);

module.exports = router;
