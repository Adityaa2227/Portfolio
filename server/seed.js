require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Experience = require('./models/Experience');
const CodingProfile = require('./models/CodingProfile');
const SocialLink = require('./models/SocialLink');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await Admin.deleteMany({});
        await Skill.deleteMany({});
        await Project.deleteMany({});
        await Experience.deleteMany({});
        await CodingProfile.deleteMany({});
        await SocialLink.deleteMany({});
        console.log('Cleared existing data');

        // 1. Admin
        await Admin.create({
            username: 'aditya',
            password: 'aditya@2227'
        });
        console.log('Admin user created');

        // 2. Skills
        const skillsData = [
            // Languages
            { category: 'Languages', name: 'C++', icon: 'SiCplusplus' },
            { category: 'Languages', name: 'JavaScript', icon: 'SiJavascript' },
            { category: 'Languages', name: 'Java', icon: 'FaJava' },
            { category: 'Languages', name: 'Python', icon: 'SiPython' },
            { category: 'Languages', name: 'C', icon: 'SiC' },
            
            // Frontend
            { category: 'Frontend', name: 'HTML', icon: 'SiHtml5' },
            { category: 'Frontend', name: 'CSS', icon: 'SiCss3' },
            { category: 'Frontend', name: 'Bootstrap', icon: 'SiBootstrap' },
            { category: 'Frontend', name: 'Tailwind CSS', icon: 'SiTailwindcss' },
            { category: 'Frontend', name: 'React', icon: 'SiReact' },
            { category: 'Frontend', name: 'Redux', icon: 'SiRedux' },

            // Backend
            { category: 'Backend', name: 'Node.js', icon: 'SiNodedotjs' },
            { category: 'Backend', name: 'Express.js', icon: 'SiExpress' },
            { category: 'Backend', name: 'Firebase', icon: 'SiFirebase' },
            { category: 'Backend', name: 'JWT', icon: 'HiOutlineShieldCheck' },
            { category: 'Backend', name: 'OAuth', icon: 'HiOutlineKey' },
            { category: 'Backend', name: 'Socket.io', icon: 'SiSocketdotio' },
            { category: 'Backend', name: 'WebRTC', icon: 'SiWebrtc' },
            { category: 'Backend', name: 'Next.js', icon: 'SiNextdotjs' },

            // Database
            { category: 'Database', name: 'MongoDB', icon: 'SiMongodb' },
            { category: 'Database', name: 'Mongoose', icon: 'SiMongoose' },
            { category: 'Database', name: 'MySQL', icon: 'SiMysql' },

            // Tools & Platforms
            { category: 'Tools & Platforms', name: 'VS Code', icon: 'VscCode' },
            { category: 'Tools & Platforms', name: 'Git', icon: 'SiGit' },
            { category: 'Tools & Platforms', name: 'GitHub', icon: 'SiGithub' },
            { category: 'Tools & Platforms', name: 'Postman', icon: 'SiPostman' },
            { category: 'Tools & Platforms', name: 'Hoppscotch', icon: 'SiHoppscotch' },
            { category: 'Tools & Platforms', name: 'Figma', icon: 'SiFigma' },
            { category: 'Tools & Platforms', name: 'WordPress', icon: 'SiWordpress' },
            { category: 'Tools & Platforms', name: 'Elementor', icon: 'SiElementor' },
            { category: 'Tools & Platforms', name: 'Vercel', icon: 'SiVercel' },
            { category: 'Tools & Platforms', name: 'Netlify', icon: 'SiNetlify' },
            { category: 'Tools & Platforms', name: 'Heroku', icon: 'SiHeroku' }
        ];
        await Skill.insertMany(skillsData);
        console.log('Skills seeded');

        // 3. Projects
        const projectsData = [
            {
                title: 'Cryp2Sale',
                description: 'A global e-commerce platform focused on cryptocurrency products...',
                technologies: ['E-commerce', 'Wordpress', 'Elementor', 'Payment Gateway', 'Cryptocurrency'],
                tags: ['E-commerce', 'Blockchain'],
                isFeatured: true,
                liveLink: '#',
                githubLink: '#'
            },
            {
                title: 'Frontend Code Editor',
                description: 'Received positive feedback from over 100 users...',
                technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
                tags: ['Productivity', 'Tool'],
                isFeatured: true,
                liveLink: '#',
                githubLink: '#'
            },
            {
                title: 'Jeevandan',
                description: 'Study materials across different branches...',
                technologies: ['React', 'Node.js', 'MongoDB', 'Education'],
                tags: ['Education', 'Social'],
                isFeatured: true,
                liveLink: '#',
                githubLink: '#'
            }
        ];
        await Project.insertMany(projectsData);
        console.log('Projects seeded');

        // 4. Experience
        const experienceData = [
            {
                role: 'Full Stack Web Developer',
                company: 'Freelance / Self-Employed',
                duration: '2023 - Present',
                description: 'Building modern web applications using the MERN stack. Developed custom solutions for clients including e-commerce platforms and portfolio websites.',
                skills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
                order: 1
            },
            {
                role: 'Open Source Contributor',
                company: 'GitHub',
                duration: '2022 - Present',
                description: 'Actively contributing to open-source projects, resolving bugs, and improving documentation. Participating in coding contests on LeetCode and Codeforces.',
                skills: ['JavaScript', 'C++', 'Git', 'Problem Solving'],
                order: 2
            }
        ];
        await Experience.insertMany(experienceData);
        console.log('Experience seeded');

        // 5. Coding Profiles
        const profilesData = [
            {
                name: 'LeetCode',
                handle: 'aditya2227',
                stats: '300+ problems solved',
                desc: 'Active in contests and consistent daily practice.',
                icon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png', 
                color: 'text-yellow-500',
                link: 'https://leetcode.com/aditya2227'
            },
            {
                name: 'Codeforces',
                handle: 'Newbie (Max: 1134)',
                stats: 'Regular contest participant',
                desc: 'steady rating growth.',
                icon: 'https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/codeforces-512.png',
                color: 'text-blue-500',
                link: '#'
            },
            {
                name: 'CodeChef',
                handle: '2⭐ (Max: 1303)',
                stats: 'Solving problems',
                desc: 'joining monthly rated contests.',
                icon: 'https://static-00.iconduck.com/assets.00/codechef-icon-380x512-r1v87w22.png',
                color: 'text-orange-500',
                link: '#'
            }
        ];
        await CodingProfile.insertMany(profilesData);
        console.log('Coding Profiles seeded');

        // 6. Social Links
        const socialLinksData = [
            { platform: 'GitHub', url: 'https://github.com/aditya2227', icon: 'github' },
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/aditya-agarwal', icon: 'linkedin' },
            { platform: 'Twitter', url: '#', icon: 'twitter' },
            { platform: 'Instagram', url: '#', icon: 'instagram' },
        ];
        await SocialLink.insertMany(socialLinksData);
        console.log('Social Links seeded');

        console.log('Data Seeding Completed Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
