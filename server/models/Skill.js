const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  category: { type: String, required: true }, // Languages, Frontend, Backend, Tools
  name: { type: String, required: true },
  icon: { type: String, required: true }, // URL or classname
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
