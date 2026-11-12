const express = require('express');
const router = express.Router();
const { getSocials, getAllSocials, updateSocial, createSocial, deleteSocial } = require('../controllers/socialController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getSocials)
    .post(protect, createSocial);

router.route('/admin')
    .get(protect, getAllSocials);

router.route('/:id')
    .put(protect, updateSocial)
    .delete(protect, deleteSocial);

module.exports = router;
