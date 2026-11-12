const asyncHandler = require('express-async-handler');
const Bio = require('../models/Bio');

// @desc    Get bio (Single record)
// @route   GET /api/bio
// @access  Public
const getBio = asyncHandler(async (req, res) => {
  let bio = await Bio.findOne();
  if (!bio) {
    bio = {
      name: 'Aditya Agarwal',
      headline: 'Software Engineer & Systems Builder',
      greeting: 'Engineering Rigor • Product Impact',
      introduction: 'Software Engineer and Computer Science undergraduate at BIT Mesra (CGPA 8.7/10), selected as Incoming Software Engineer Intern at PayPal. Focused on high-concurrency backend services, distributed systems, resilient CI/test architecture, and full-stack web platforms.',
      bioDescription: 'I approach software engineering with an obsession for reliability, latency, and clean abstractions. From designing pay-per-use microservices marketplaces with Redis distributed locking to developing real-time transit telemetry serving hundreds of campus commuters, I build systems engineered for the real world.',
      location: 'Garhwa, Jharkhand, India / BIT Mesra',
      email: 'adityaagar324@gmail.com',
      phone: '+91 9508664027',
      availabilityStatus: 'Incoming SWE Intern @ PayPal (Bangalore)',
      education: 'B.Tech in Computer Science & Engineering, BIT Mesra (2023 - 2027)',
      cgpa: '8.7 / 10',
      stats: [
        { label: 'DSA Solved', value: '1000+', icon: 'Code' },
        { label: 'BIT Mesra CGPA', value: '8.7/10', icon: 'GraduationCap' },
        { label: 'Daily Active Users', value: '500+', icon: 'Users' },
        { label: 'Hackathons Won', value: 'Top Tier', icon: 'Trophy' }
      ]
    };
  }
  res.json(bio);
});

// @desc    Update or Create Bio
// @route   PUT /api/bio
// @access  Private
const updateBio = asyncHandler(async (req, res) => {
  const {
    name,
    headline,
    greeting,
    introduction,
    bioDescription,
    location,
    email,
    phone,
    availabilityStatus,
    profileImage,
    education,
    cgpa,
    stats
  } = req.body;

  let bio = await Bio.findOne();

  if (bio) {
    if (name !== undefined) bio.name = name;
    if (headline !== undefined) bio.headline = headline;
    if (greeting !== undefined) bio.greeting = greeting;
    if (introduction !== undefined) bio.introduction = introduction;
    if (bioDescription !== undefined) bio.bioDescription = bioDescription;
    if (location !== undefined) bio.location = location;
    if (email !== undefined) bio.email = email;
    if (phone !== undefined) bio.phone = phone;
    if (availabilityStatus !== undefined) bio.availabilityStatus = availabilityStatus;
    if (profileImage !== undefined) bio.profileImage = profileImage;
    if (education !== undefined) bio.education = education;
    if (cgpa !== undefined) bio.cgpa = cgpa;
    if (stats !== undefined) bio.stats = stats;
    const updatedBio = await bio.save();
    res.json(updatedBio);
  } else {
    const newBio = await Bio.create({
      name: name || 'Aditya Agarwal',
      headline: headline || 'Software Engineer & Systems Builder',
      greeting: greeting || 'Engineering Rigor • Product Impact',
      introduction: introduction || 'Software Engineer and Computer Science undergraduate at BIT Mesra...',
      bioDescription: bioDescription || 'I approach software engineering with an obsession for reliability...',
      location: location || 'Garhwa, Jharkhand, India',
      email: email || 'adityaagar324@gmail.com',
      phone: phone || '+91 9508664027',
      availabilityStatus: availabilityStatus || 'Incoming SWE Intern @ PayPal',
      profileImage: profileImage || null,
      education: education || 'B.Tech in Computer Science & Engineering, BIT Mesra (2023 - 2027)',
      cgpa: cgpa || '8.7 / 10',
      stats: stats || []
    });
    res.status(201).json(newBio);
  }
});

module.exports = { getBio, updateBio };
