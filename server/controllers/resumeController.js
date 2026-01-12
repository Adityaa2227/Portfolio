const asyncHandler = require('express-async-handler');
const Resume = require('../models/Resume');

// @desc    Get active resume
// @route   GET /api/resume
// @access  Public
const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ isActive: true });
  if (resume) {
    res.json(resume);
  } else {
    res.status(404).json({ message: 'No active resume found' });
  }
});

// @desc    Upload new resume
// @route   POST /api/resume
// @access  Private
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const resume = new Resume({
    fileUrl: `/uploads/${req.file.filename}`,
    fileName: req.file.originalname,
    isActive: true 
  });

  const createdResume = await resume.save();
  res.status(201).json(createdResume);
});

// @desc    Get all resumes (history - Admin)
// @route   GET /api/resume/all
// @access  Private
const getAllResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({}).sort({ createdAt: -1 });
  res.json(resumes);
});

// @desc    Toggle active resume
// @route   PUT /api/resume/:id/active
// @access  Private
const setActiveResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (resume) {
    resume.isActive = true; // Pre-save hook will disable others
    await resume.save();
    res.json(resume);
  } else {
    res.status(404);
    throw new Error('Resume not found');
  }
});

module.exports = {
  getResume,
  uploadResume,
  getAllResumes,
  setActiveResume
};
