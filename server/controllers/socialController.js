const asyncHandler = require('express-async-handler');
const SocialLink = require('../models/SocialLink');

// Get active
const getSocials = asyncHandler(async (req, res) => {
  const links = await SocialLink.find({ isActive: true });
  res.json(links);
});

// Admin All
const getAllSocials = asyncHandler(async (req, res) => {
  const links = await SocialLink.find({});
  res.json(links);
});

// Update
const updateSocial = asyncHandler(async (req, res) => {
  const link = await SocialLink.findById(req.params.id);
  // Implementation for update / toggle active
  if (link) {
      if (req.body.url) link.url = req.body.url;
      if (req.body.isActive !== undefined) link.isActive = req.body.isActive;
      await link.save();
      res.json(link);
  } else {
      res.status(404);
      throw new Error('Link not found');
  }
});

const createSocial = asyncHandler(async (req, res) => {
    const { platform, url, icon } = req.body;
    const link = await SocialLink.create({ platform, url, icon });
    res.status(201).json(link);
});

const deleteSocial = asyncHandler(async (req, res) => {
    const link = await SocialLink.findById(req.params.id);
    if (link) {
        await SocialLink.deleteOne({ _id: link._id });
        res.json({ message: 'Link removed' });
    } else {
        res.status(404);
        throw new Error('Link not found');
    }
});

module.exports = { getSocials, getAllSocials, updateSocial, createSocial, deleteSocial };
