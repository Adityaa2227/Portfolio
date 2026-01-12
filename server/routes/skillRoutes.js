const express = require('express');
const router = express.Router();
const { getSkills, getAdminSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getSkills).post(protect, createSkill);
router.route('/admin').get(protect, getAdminSkills);
router.route('/:id').put(protect, updateSkill).delete(protect, deleteSkill);

module.exports = router;
