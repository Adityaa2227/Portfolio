const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

dotenv.config(); // defaults to .env in cwd

const seedAdmin = async () => {
  await connectDB();

  try {
    await Admin.deleteMany(); // Clear existing admins

    const admin = new Admin({
      username: 'aditya',
      password: 'Aditya@2227', // Initial password
    });

    await admin.save();

    console.log('Admin user created successfully');
    console.log('Username: aditya');
    console.log('Password: Aditya@2227');
    
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
