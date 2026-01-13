const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Project = require('../models/Project');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const projectsData = [
  {
    title: 'Cryp2Sale',
    description: 'A global e-commerce platform focused on cryptocurrency products, trusted by over 100+ daily international users for secure and seamless transactions, offering an intuitive and user-friendly shopping experience.',
    projectImage: '/projects/Cryp2ale.png',
    technologies: ['E-commerce', "Wordpress", "Elementor", "Payment Gateway", 'Cryptocurrency'],
    category: 'E-commerce',
    tags: ['E-commerce', "Wordpress", "Elementor", "Payment Gateway", 'Cryptocurrency'],
    liveLink: 'https://cryp2sale.com',
    githubLink: 'https://github.com/Adityaa2227',
    isFeatured: true,
    order: 0
  },
  {
    title: 'Frontend Code Editor',
    description: 'An interactive frontend code editor that enables real-time HTML, CSS, and JavaScript preview. The tool has received positive feedback from over 100 users, supporting their coding practice sessions.',
    projectImage: '/projects/Frontend Code Editor.png',
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
    category: 'Tool',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
    liveLink: 'https://code-editor-demo.vercel.app',
    githubLink: 'https://github.com/yourusername/code-editor',
    isFeatured: true,
    order: 1
  },
  {
    title: 'Jeevandan',
    description: 'An intuitive online platform for BIT Mesra students, providing 50+ users easy access to a vast collection of study materials across different branches and academic years. Completed in just three weeks.',
    projectImage: '/projects/Jeevandan.png',
    technologies: ['React', 'Node.js', 'MongoDB', 'Education'],
    category: 'Full Stack',
    tags: ['React', 'Node.js', 'MongoDB', 'Education'],
    liveLink: 'https://jeevandan.vercel.app',
    githubLink: 'https://github.com/yourusername/jeevandan',
    isFeatured: true,
    order: 2
  },
  {
    title: 'Portfolio Website',
    description: 'A fully responsive personal website to showcase web development projects, using HTML, CSS, JavaScript, and Bootstrap. Optimized for performance and user experience.',
    projectImage: '/projects/Portfolio Website.png',
    technologies: ['React', 'Tailwind CSS', 'HTML', 'CSS', 'JavaScript'],
    category: 'Frontend',
    tags: ['React', 'Tailwind CSS', 'HTML', 'CSS', 'JavaScript'],
    liveLink: 'https://adityaagarwalportfolio.vercel.app/',
    githubLink: 'https://github.com/Adityaa2227/Portfolio',
    isFeatured: false,
    order: 3
  },
  {
    title: 'Leetcode-Replica',
    description: 'A web-based platform inspired by LeetCode, built for practicing coding problems interactively. It features algorithm challenges, a real-time code editor, and instant solution validation. Developed using HTML, CSS, and JavaScript, its ideal for beginners to enhance their coding skills. Created during a hackathon — and won.',
    projectImage: '/projects/Leetcode-Replica.png',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    category: 'Full Stack',
    tags: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    liveLink: 'https://leetcode-replica.vercel.app/Dashboard.html',
    githubLink: 'https://github.com/Adityaa2227/Leetcode-Replica',
    isFeatured: false,
    order: 4
  },
  {
    title: 'Simon Says Game',
    description: 'A fun and interactive Simon Says Game built using HTML, CSS, and JavaScript. This memory game challenges users to repeat a randomly generated sequence of button presses. Perfect for beginners looking to practice DOM manipulation and game logic.',
    projectImage: '/projects/Simon Says Game.png',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    category: 'Game',
    tags: ['HTML', 'CSS', 'JavaScript'],
    liveLink: 'https://adityaa2227.github.io/Simon-Says-Game/',
    githubLink: 'https://github.com/Adityaa2227/Simon-Says-Game',
    isFeatured: false,
    order: 5
  },
  {
    title: 'Dice Roll Simulator',
    description: 'A simple and interactive Dice Roll Simulator built using HTML, CSS, and JavaScript. This project allows users to simulate rolling dice with a click, making it a fun tool for games, learning, or just passing the time.',
    projectImage: '/projects/Dice Roll Simulator.png',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    category: 'Game',
    tags: ['HTML', 'CSS', 'JavaScript'],
    liveLink: 'https://adityaa2227.github.io/Dice-Roll-Simulator/',
    githubLink: 'https://github.com/Adityaa2227/Dice-Roll-Simulator',
    isFeatured: false,
    order: 6
  },
  {
    title: 'New Year Countdown',
    description: 'This is a simple and beautiful New Year Countdown web application built using HTML, CSS, and JavaScript. It features a countdown timer that displays the time remaining until the New Year, along with a festive design.',
    projectImage: '/projects/New Year Countdown.png',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    category: 'Mini Project',
    tags: ['HTML', 'CSS', 'JavaScript'],
    liveLink: 'https://adityaa2227.github.io/New-Year-CountDown/',
    githubLink: 'https://github.com/Adityaa2227/New-Year-Countdown',
    isFeatured: false,
    order: 7
  },
  {
    title: 'Guess the Number',
    description: 'A fun and interactive number guessing game built with HTML, CSS, and JavaScript. Try to guess the secret number between 1 and 100 in just 10 attempts.',
    projectImage: '/projects/Guess the Number.png',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    category: 'Game',
    tags: ['HTML', 'CSS', 'JavaScript'],
    liveLink: 'https://adityaa2227.github.io/Guess-The-Number/',
    githubLink: 'https://github.com/Adityaa2227/Guess-The-Number',
    isFeatured: false,
    order: 8
  },
  {
    title: 'Digital Clock',
    description: 'A simple and elegant Digital Clock web application built with HTML, CSS, and JavaScript. This project displays the current time in real-time with a clean and responsive interface.',
    projectImage: '/projects/Digital Clock.png',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    category: 'Mini Project',
    tags: ['HTML', 'CSS', 'JavaScript'],
    liveLink: 'https://adityaa2227.github.io/Digital-Clock/',
    githubLink: 'https://github.com/Adityaa2227/Digital-Clock',
    isFeatured: false,
    order: 9
  },
  {
    title: 'BMI Calculator',
    description: 'A simple and user-friendly Body Mass Index (BMI) Calculator web application built with HTML, CSS, and JavaScript. Instantly calculate your BMI and determine your health category with a clean, responsive interface.',
    projectImage: '/projects/BMI Calculator.png',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    category: 'Tool',
    tags: ['HTML', 'CSS', 'JavaScript'],
    liveLink: 'https://adityaa2227.github.io/BMI-Calculator/',
    githubLink: 'https://github.com/Adityaa2227/BMI-Calculator',
    isFeatured: false,
    order: 10
  },
  {
    title: 'Random Color Generator',
    description: 'A fun and interactive web application that generates random RGB colors on button click. Built using HTML, CSS, and JavaScript, this project is perfect for beginners looking to strengthen their DOM manipulation skills.',
    projectImage: '/projects/Random Color Generator.png',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    category: 'Mini Project',
    tags: ['HTML', 'CSS', 'JavaScript'],
    liveLink: 'https://adityaa2227.github.io/Random-Color-Generator/',
    githubLink: 'https://github.com/Adityaa2227/Random-Color-Generator',
    isFeatured: false,
    order: 11
  },
  {
    title: 'Cat Facts & Dog Images Generator',
    description: 'A simple and delightful web application that displays random cat facts and cute dog images using public APIs. Built using HTML, CSS, and JavaScript (with Axios for API requests).',
    projectImage: '/projects/Cat Facts & Dog Images Generator.png',
    technologies: ['HTML', 'CSS', 'JavaScript', "Axios", "API"],
    category: 'API Integration',
    tags: ['HTML', 'CSS', 'JavaScript', "Axios", "API"],
    liveLink: 'https://adityaa2227.github.io/Cat-Fact-Dog-Image/',
    githubLink: 'https://github.com/Adityaa2227/Cat-Fact-Dog-Image',
    isFeatured: false,
    order: 12
  }
];

const seedProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing projects
    await Project.deleteMany({});
    console.log('Cleared existing projects');

    // Insert new projects
    await Project.insertMany(projectsData);
    console.log('Projects Seeding Success!');

    process.exit();
  } catch (error) {
    console.error('Error with seeding projects:', error);
    process.exit(1);
  }
};

seedProjects();
