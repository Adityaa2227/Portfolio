const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  // Identification
  visitorId: { type: String, required: true, index: true }, // Client-generated UUID or Fingerprint
  socketId: { type: String },
  ipHash: { type: String }, // Anonymized IP

  // Demographics
  country: { type: String, default: 'Unknown' },
  city: { type: String, default: 'Unknown' },
  deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet', 'unknown'], default: 'unknown' },
  os: { type: String },
  browser: { type: String },

  // Session Data
  startTime: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  duration: { type: Number, default: 0 }, // in seconds
  
  // Interaction
  pagesVisited: [{
    path: String,
    timestamp: { type: Date, default: Date.now },
    stayDuration: Number // seconds
  }],
  pageCount: { type: Number, default: 0 },

  // Status
  isOnline: { type: Boolean, default: true }, // For quick queries
  endedAt: { type: Date }
}, { timestamps: true });

// Optimize for analytics queries
sessionSchema.index({ createdAt: -1 });
sessionSchema.index({ country: 1 });
sessionSchema.index({ deviceType: 1 });

module.exports = mongoose.model('Session', sessionSchema);
