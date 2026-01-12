const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow loading images from static folder
}));
app.use(morgan('common'));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Placeholder
if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    res.send('Portfolio API is running...');
  });
}

// Import Routes (will create these later)
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const socialRoutes = require('./routes/socialRoutes');
const contactRoutes = require('./routes/contactRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const codingProfileRoutes = require('./routes/codingProfileRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/socials', socialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/coding-profiles', codingProfileRoutes);
app.use('/api/bio', require('./routes/bioRoutes'));

// Serve static files in production
// Serve static files in production
// Frontend will be deployed separately (Vercel), so we don't serve it here.
// We only serve the API and the uploads folder.
if (process.env.NODE_ENV === 'production') {
  app.get('/', (req, res) => {
    res.send('Portfolio API is running...');
  });
}

// Error Handling Middleware
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('ERROR_LOG:', err); // Log the full error object
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    error: err.toString(), // Send string representation
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

// Connect to DB and Start Server
const connectDB = require('./config/db');
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
});
