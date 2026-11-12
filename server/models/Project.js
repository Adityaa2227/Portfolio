const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, sparse: true, index: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  problem: { type: String },
  solution: { type: String },
  features: [{ type: String }],
  metrics: { type: String },
  technologies: [{ type: String }],
  category: { type: String, required: true, default: 'Other' },
  tags: [{ type: String }],
  githubLink: { type: String },
  liveLink: { type: String },
  youtubeVideoUrl: { type: String, default: null },
  projectImage: { type: String, default: null }, // URL
  galleryImages: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Auto-generate slug before saving if not provided
projectSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  if (next) next();
});

module.exports = mongoose.model('Project', projectSchema);
