const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const path = require('path');
const fs = require('fs');

// @desc    Get all projects (Public view - filter by published)
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ isPublished: true }).sort({ createdAt: -1 });
  res.json(projects);
});

// @desc    Get all projects (Admin view - all)
// @route   GET /api/projects/admin
// @access  Private
const getAdminProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({}).sort({ createdAt: -1 });
  res.json(projects);
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { title, description, technologies, tags, githubLink, liveLink, youtubeVideoUrl } = req.body;
  
  let projectImage = null;
  if (req.file) {
    projectImage = `/uploads/${req.file.filename}`;
  }

  // Parse arrays if they come as strings from FormData
  let parsedTech = technologies;
  let parsedTags = tags;
  if (typeof technologies === 'string') parsedTech = technologies.split(',').map(t => t.trim());
  if (typeof tags === 'string') parsedTags = tags.split(',').map(t => t.trim());

  const project = new Project({
    title,
    description,
    technologies: parsedTech,
    tags: parsedTags,
    githubLink,
    liveLink,
    youtubeVideoUrl: youtubeVideoUrl || null,
    projectImage,
    isPublished: false // Default to draft
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const { title, description, technologies, tags, githubLink, liveLink, youtubeVideoUrl, isFeatured, isPublished } = req.body;

  const project = await Project.findById(req.params.id);

  if (project) {
    project.title = title || project.title;
    project.description = description || project.description;
    project.githubLink = githubLink || project.githubLink;
    project.liveLink = liveLink || project.liveLink;
    project.youtubeVideoUrl = youtubeVideoUrl !== undefined ? youtubeVideoUrl : project.youtubeVideoUrl;
    
    // Arrays
    if (technologies) {
        project.technologies = typeof technologies === 'string' ? technologies.split(',').map(t => t.trim()) : technologies;
    }
    if (tags) {
        project.tags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;
    }

    // Booleans (check for string 'true'/'false' if formData)
    if (isFeatured !== undefined) project.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (isPublished !== undefined) project.isPublished = isPublished === 'true' || isPublished === true;

    if (req.file) {
      // Delete old image if exists
      if (project.projectImage) {
        // implementation detail: remove local file. 
        // const oldPath = path.join(__dirname, '..', project.projectImage);
        // if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      project.projectImage = `/uploads/${req.file.filename}`;
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
  // Use findByIdAndDelete or findById then remove
  const project = await Project.findById(req.params.id);

  if (project) {
     if (project.projectImage) {
        // Optional: delete file
     }
    await Project.deleteOne({ _id: project._id });
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

module.exports = {
  getProjects,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject
};
