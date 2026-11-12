const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true }, // GitHub, LinkedIn, etc.
  url: { type: String, required: true },
  icon: { type: String, required: true }, // URL or classname
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SocialLink', socialLinkSchema);
