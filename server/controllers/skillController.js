const asyncHandler = require('express-async-handler');
const Skill = require('../models/Skill');

const getSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({}).sort({ order: 1 });
  res.json(skills);
});

const getAdminSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({}).sort({ order: 1 });
  res.json(skills);
});

const createSkill = asyncHandler(async (req, res) => {
  const { category, name, icon, order } = req.body;
  const skill = await Skill.create({ category, name, icon, order });
  res.status(201).json(skill);
});

const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (skill) {
    skill.category = req.body.category || skill.category;
    skill.name = req.body.name || skill.name;
    skill.icon = req.body.icon || skill.icon;
    skill.order = req.body.order || skill.order;
    if (req.body.isPublished !== undefined) skill.isPublished = req.body.isPublished;
    
    const updated = await skill.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Skill not found');
  }
});

const reorderSkills = asyncHandler(async (req, res) => {
  const { skills } = req.body; // Expects array of { _id, order }

  if (!skills || !Array.isArray(skills)) {
      res.status(400);
      throw new Error('Invalid input data');
  }

  const bulkOps = skills.map((skill) => ({
      updateOne: {
          filter: { _id: skill._id },
          update: { $set: { order: skill.order } }
      }
  }));

  if (bulkOps.length > 0) {
      await Skill.bulkWrite(bulkOps);
  }

  res.json({ message: 'Skills reordered successfully' });
});

const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (skill) {
    await Skill.deleteOne({ _id: skill._id });
    res.json({ message: 'Skill removed' });
  } else {
    res.status(404);
    throw new Error('Skill not found');
  }
});

module.exports = {
  getSkills,
  getAdminSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills
};
