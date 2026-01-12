const express = require('express');
const router = express.Router();
const { getProjects, getAdminProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getProjects)
  .post(protect, upload.single('image'), createProject);

router.route('/admin')
  .get(protect, getAdminProjects);

router.route('/:id')
  .put(protect, upload.single('image'), updateProject)
  .delete(protect, deleteProject);

module.exports = router;
