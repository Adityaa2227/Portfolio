const asyncHandler = require('express-async-handler');
const Bio = require('../models/Bio');

// @desc    Get bio (Single record)
// @route   GET /api/bio
// @access  Public
const getBio = asyncHandler(async (req, res) => {
  let bio = await Bio.findOne();
  if (!bio) {
    // Return empty template if not found so frontend doesn't crash
    bio = {
        greeting: 'Who I Am',
        introduction: 'I am a Software Engineer...',
        bioDescription: 'Based in...',
        stats: []
    }
  }
  res.json(bio);
});

// @desc    Update or Create Bio
// @route   PUT /api/bio
// @access  Private
const updateBio = asyncHandler(async (req, res) => {
  const { greeting, introduction, bioDescription, stats } = req.body;

  let bio = await Bio.findOne();

  if (bio) {
    bio.greeting = greeting || bio.greeting;
    bio.introduction = introduction || bio.introduction;
    bio.bioDescription = bioDescription || bio.bioDescription;
    bio.stats = stats || bio.stats;
    const updatedBio = await bio.save();
    res.json(updatedBio);
  } else {
    const newBio = await Bio.create({
        greeting,
        introduction,
        bioDescription,
        stats
    });
    res.status(201).json(newBio);
  }
});

module.exports = { getBio, updateBio };
