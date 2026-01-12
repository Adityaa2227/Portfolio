const mongoose = require('mongoose');
const Resume = require('./models/Resume');
require('dotenv').config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const active = await Resume.findOne({ isActive: true });
        console.log('Active Resume:', active);
        const all = await Resume.find({});
        console.log('Total Resumes:', all.length);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
checkDB();
