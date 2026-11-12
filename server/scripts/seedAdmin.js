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
      username: 'aa',
      password: 'aa@a', // Initial password
    });

    await admin.save();

    console.log('Admin user created successfully');
    console.log('Username: aa');
    console.log('Password: aa@a');
    
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
