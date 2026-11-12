const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectByIdOrSlug,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMemoryMiddleware');

router.route('/')
  .get(getProjects)
  .post(protect, upload.single('image'), createProject);

router.route('/reorder')
  .put(protect, reorderProjects);

router.route('/admin')
  .get(protect, getAdminProjects);

router.route('/:id')
  .get(getProjectByIdOrSlug)
  .put(protect, upload.single('image'), updateProject)
  .delete(protect, deleteProject);

module.exports = router;
