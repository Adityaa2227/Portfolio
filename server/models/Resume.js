const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Ensure only one structure is active (we'll handle this in logic or hook)
resumeSchema.pre('save', async function () {
  if (this.isActive) {
    await this.constructor.updateMany({ _id: { $ne: this._id } }, { isActive: false });
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
