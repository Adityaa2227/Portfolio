const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  category: { type: String, required: true, default: 'Other' },
  tags: [{ type: String }],
  githubLink: { type: String },
  liveLink: { type: String },
  youtubeVideoUrl: { type: String, default: null },
  projectImage: { type: String, default: null }, // URL
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
