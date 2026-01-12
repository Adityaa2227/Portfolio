const mongoose = require('mongoose');

const CodingProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    handle: { type: String, required: true },
    stats: { type: String, required: true },
    desc: { type: String },
    icon: { type: String }, // URL or class
    link: { type: String, required: true },
    color: { type: String } // Tailwind class for text color
}, { timestamps: true });

module.exports = mongoose.model('CodingProfile', CodingProfileSchema);
