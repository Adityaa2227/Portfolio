const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const path = require('path');
const fs = require('fs');
const imagekit = require('../utils/imagekit');

// @desc    Get all projects (Public view - filter by published)
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ isPublished: true }).sort({ order: 1, createdAt: -1 });
  res.json(projects);
});

// @desc    Get single project by ID or Slug (Public)
// @route   GET /api/projects/:idOrSlug
// @access  Public
const getProjectByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  let project = null;

  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    project = await Project.findById(idOrSlug);
  }

  if (!project) {
    project = await Project.findOne({ slug: idOrSlug });
  }

  if (!project) {
    const all = await Project.find({});
    project = all.find(p => {
      const computedSlug = p.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
      return computedSlug === idOrSlug.toLowerCase();
    });
  }

  if (project) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Get all projects (Admin view - all)
// @route   GET /api/projects/admin
// @access  Private
const getAdminProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
  res.json(projects);
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    description,
    shortDescription,
    problem,
    solution,
    features,
    metrics,
    technologies,
    category,
    tags,
    githubLink,
    liveLink,
    youtubeVideoUrl,
    projectImage: directImage,
    isFeatured,
    isPublished,
    order
  } = req.body;
  
  let projectImage = directImage || null;
  if (req.file) {
    if (!imagekit) {
        res.status(500);
        throw new Error('ImageKit is not configured in environment variables');
    }
    const response = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/portfolio/projects"
    });
    projectImage = response.url;
  }

  // Parse arrays if they come as strings from FormData
  let parsedTech = technologies;
  let parsedTags = tags;
  let parsedFeatures = features;
  if (typeof technologies === 'string') parsedTech = technologies.split(',').map(t => t.trim());
  if (typeof tags === 'string') parsedTags = tags.split(',').map(t => t.trim());
  if (typeof features === 'string') parsedFeatures = features.split('\n').map(f => f.trim()).filter(Boolean);

  const project = new Project({
    title,
    slug: slug || undefined,
    description,
    shortDescription: shortDescription || (description ? description.slice(0, 160) : ''),
    problem: problem || '',
    solution: solution || '',
    features: parsedFeatures || [],
    metrics: metrics || '',
    technologies: parsedTech || [],
    category: category || 'Full Stack',
    tags: parsedTags || [],
    githubLink: githubLink || '',
    liveLink: liveLink || '',
    youtubeVideoUrl: youtubeVideoUrl || null,
    projectImage,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isPublished: isPublished !== undefined ? (isPublished === 'true' || isPublished === true) : true,
    order: order ? Number(order) : 0
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    description,
    shortDescription,
    problem,
    solution,
    features,
    metrics,
    technologies,
    category,
    tags,
    githubLink,
    liveLink,
    youtubeVideoUrl,
    projectImage: directImage,
    isFeatured,
    isPublished,
    order
  } = req.body;

  const project = await Project.findById(req.params.id);

  if (project) {
    if (title !== undefined) project.title = title;
    if (slug !== undefined) project.slug = slug;
    if (description !== undefined) project.description = description;
    if (shortDescription !== undefined) project.shortDescription = shortDescription;
    if (problem !== undefined) project.problem = problem;
    if (solution !== undefined) project.solution = solution;
    if (metrics !== undefined) project.metrics = metrics;
    if (category !== undefined) project.category = category;
    if (githubLink !== undefined) project.githubLink = githubLink;
    if (liveLink !== undefined) project.liveLink = liveLink;
    if (youtubeVideoUrl !== undefined) project.youtubeVideoUrl = youtubeVideoUrl;
    if (directImage !== undefined) project.projectImage = directImage;
    if (order !== undefined) project.order = Number(order);
    
    // Arrays
    if (technologies !== undefined) {
      project.technologies = typeof technologies === 'string' ? technologies.split(',').map(t => t.trim()) : technologies;
    }
    if (tags !== undefined) {
      project.tags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;
    }
    if (features !== undefined) {
      project.features = typeof features === 'string' ? features.split('\n').map(f => f.trim()).filter(Boolean) : features;
    }

    // Booleans
    if (isFeatured !== undefined) project.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (isPublished !== undefined) project.isPublished = isPublished === 'true' || isPublished === true;

    if (req.file) {
      if (!imagekit) {
          res.status(500);
          throw new Error('ImageKit is not configured in environment variables');
      }
      const response = await imagekit.upload({
          file: req.file.buffer,
          fileName: req.file.originalname,
          folder: "/portfolio/projects"
      });
      project.projectImage = response.url;
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Reorder projects
// @route   PUT /api/projects/reorder
// @access  Private
const reorderProjects = asyncHandler(async (req, res) => {
  const { items } = req.body; // Array of { _id, order }
  
  if (!items || !Array.isArray(items)) {
    res.status(400);
    throw new Error('Invalid items array');
  }

  const bulkOps = items.map(item => ({
    updateOne: {
      filter: { _id: item._id },
      update: { $set: { order: item.order } }
    }
  }));

  if (bulkOps.length > 0) {
    await Project.bulkWrite(bulkOps);
  }

  res.json({ message: 'Projects reordered' });
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await Project.deleteOne({ _id: project._id });
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

module.exports = {
  getProjects,
  getProjectByIdOrSlug,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects
};
