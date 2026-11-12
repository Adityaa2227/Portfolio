const asyncHandler = require('express-async-handler');
const Resume = require('../models/Resume');
const path = require('path');
const fs = require('fs');
const imagekit = require('../utils/imagekit');

// @desc    Get active resume
// @route   GET /api/resume
// @access  Public
const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ isActive: true });
  if (resume) {
    res.json(resume);
  } else {
    // Return default active resume info pointing to public PDF
    res.json({
      fileName: 'Aditya Agarwal Resume.pdf',
      fileUrl: '/resume.pdf',
      isActive: true
    });
  }
});

// @desc    Download active resume
// @route   GET /api/resume/download
// @access  Public
const downloadResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ isActive: true });
  if (resume && resume.fileUrl) {
    if (resume.fileUrl.startsWith('http')) {
      return res.redirect(resume.fileUrl);
    }
    const cleanPath = resume.fileUrl.replace(/^\//, '');
    const candidatePaths = [
      path.join(__dirname, '..', cleanPath),
      path.join(__dirname, '../uploads', path.basename(cleanPath)),
      path.join(__dirname, '../../client/public/resume.pdf'),
      path.join(__dirname, '../../client/public', path.basename(cleanPath))
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        return res.download(p, resume.fileName || 'Aditya_Agarwal_Resume.pdf');
      }
    }
  }
  const fallback = path.join(__dirname, '../../client/public/resume.pdf');
  if (fs.existsSync(fallback)) {
    return res.download(fallback, 'Aditya_Agarwal_Resume.pdf');
  }
  res.status(404).json({ message: 'Resume file not found' });
});

// @desc    Upload new resume
// @route   POST /api/resume
// @access  Private
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Choose a PDF file to upload.' });
  }
  if (req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({ message: 'The resume must be a PDF.' });
  }
  if (!imagekit) {
    return res.status(500).json({ message: 'ImageKit is not configured on the server (IMAGEKIT_* env vars).' });
  }

  // Store on ImageKit so the file survives server restarts.
  const uploaded = await imagekit.upload({
    file: req.file.buffer,
    fileName: req.file.originalname.replace(/[^\w.-]+/g, '_'),
    folder: '/portfolio/resume',
    useUniqueFileName: true,
  });

  const resume = new Resume({
    fileUrl: uploaded.url,
    fileName: req.file.originalname,
    isActive: true,
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
  downloadResume,
  uploadResume,
  getAllResumes,
  setActiveResume
};
