const mongoose = require('mongoose');

const bioSchema = new mongoose.Schema({
  name: { type: String, default: 'Aditya Agarwal' },
  headline: { type: String, default: 'Software Engineer & Systems Builder' },
  greeting: { type: String, default: 'Who I Am' },
  introduction: { type: String, required: true },
  bioDescription: { type: String, required: true },
  location: { type: String, default: 'Garhwa, Jharkhand, India' },
  email: { type: String, default: 'adityaagar324@gmail.com' },
  phone: { type: String, default: '+91 9508664027' },
  availabilityStatus: { type: String, default: 'Incoming SWE Intern @ PayPal' },
  profileImage: { type: String, default: null },
  education: { type: String, default: 'B.Tech in Computer Science & Engineering, BIT Mesra (2023 - 2027)' },
  cgpa: { type: String, default: '8.7 / 10' },
  stats: [{
      label: { type: String },
      value: { type: String },
      icon: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Bio', bioSchema);
