require('dotenv').config();
const mongoose = require('mongoose');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Experience = require('./models/Experience');
const CodingProfile = require('./models/CodingProfile');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');
        
        const sCount = await Skill.countDocuments({});
        const pCount = await Project.countDocuments({});
        const eCount = await Experience.countDocuments({});
        const cCount = await CodingProfile.countDocuments({});
        
        console.log(`Skills: ${sCount}`);
        console.log(`Projects: ${pCount}`);
        console.log(`Experience: ${eCount}`);
        console.log(`CodingProfiles: ${cCount}`);
        
        // Check one skill
        if (sCount > 0) {
            const skill = await Skill.findOne({});
            console.log('Sample skill:', skill);
        }

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
check();
