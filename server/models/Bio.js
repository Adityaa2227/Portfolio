const mongoose = require('mongoose');

const bioSchema = new mongoose.Schema({
  greeting: { type: String, default: 'Who I Am' },
  introduction: { type: String, required: true },
  bioDescription: { type: String, required: true }, // Longer text
  stats: [{
      label: { type: String },
      value: { type: String },
      icon: { type: String } // optional icon class or name
  }]
}, { timestamps: true });

module.exports = mongoose.model('Bio', bioSchema);
