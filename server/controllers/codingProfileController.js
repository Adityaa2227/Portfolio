const CodingProfile = require('../models/CodingProfile');

exports.getProfiles = async (req, res) => {
    try {
        const profiles = await CodingProfile.find();
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createProfile = async (req, res) => {
    try {
        const profile = new CodingProfile(req.body);
        const savedProfile = await profile.save();
        res.status(201).json(savedProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updatedProfile = await CodingProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        await CodingProfile.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Profile deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
