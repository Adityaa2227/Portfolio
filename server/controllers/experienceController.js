const Experience = require('../models/Experience');

exports.getExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find().sort({ order: 1 });
        res.status(200).json(experiences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createExperience = async (req, res) => {
    try {
        const experience = new Experience(req.body);
        const savedExperience = await experience.save();
        res.status(201).json(savedExperience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateExperience = async (req, res) => {
    try {
        const updatedExperience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedExperience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteExperience = async (req, res) => {
    try {
        await Experience.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Experience deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
