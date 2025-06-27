export interface Project {
  title: string
  description: string
  image: string
  tags: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
}

export const projects: Project[] = [
  {
    title: 'Cryp2Sale',
    description: 'A global e-commerce platform focused on cryptocurrency products, trusted by over 100+ daily international users for secure and seamless transactions, offering an intuitive and user-friendly shopping experience.',
    image: '/projects/Cryp2ale.png',
    tags: ['E-commerce',"Wordpress","Elementor","Payment Gateway",'Cryptocurrency'],
    liveUrl: 'https://cryp2sale.com',
    githubUrl: 'https://github.com/Adityaa2227',
    featured: true,
  },
  {
    title: 'Frontend Code Editor',
    description: 'An interactive frontend code editor that enables real-time HTML, CSS, and JavaScript preview. The tool has received positive feedback from over 100 users, supporting their coding practice sessions.',
    image: '/projects/Frontend Code Editor.png',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
    liveUrl: 'https://code-editor-demo.vercel.app',
    githubUrl: 'https://github.com/yourusername/code-editor',
    featured: true,
  },
  {
    title: 'Jeevandan',
    description: 'An intuitive online platform for BIT Mesra students, providing 50+ users easy access to a vast collection of study materials across different branches and academic years. Completed in just three weeks.',
    image: '/projects/Jeevandan.png',
    tags: ['React', 'Node.js', 'MongoDB', 'Education'],
    liveUrl: 'https://jeevandan.vercel.app',
    githubUrl: 'https://github.com/yourusername/jeevandan',
    featured: true,
  },
  {
    title: 'Portfolio Website',
    description: 'A fully responsive personal website to showcase web development projects, using HTML, CSS, JavaScript, and Bootstrap. Optimized for performance and user experience.',
    image: '/projects/Portfolio Website.png',
    tags: ['React', 'Tailwind CSS','HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://adityaagarwalportfolio.vercel.app/',
    githubUrl: 'https://github.com/Adityaa2227/Portfolio',
    featured: false,
  },
  {
    title: 'Leetcode-Replica',
    description: 'A web-based platform inspired by LeetCode, built for practicing coding problems interactively. It features algorithm challenges, a real-time code editor, and instant solution validation. Developed using HTML, CSS, and JavaScript, its ideal for beginners to enhance their coding skills. Created during a hackathon — and won.',
    image: '/projects/Leetcode-Replica.png',
    tags: ['HTML', 'CSS', 'JavaScript','Bootstrap'],
    liveUrl: 'https://leetcode-replica.vercel.app/Dashboard.html',
    githubUrl: 'https://github.com/Adityaa2227/Leetcode-Replica',
    featured: false,
  },
   {
    title: 'Simon Says Game',
    description: 'A fun and interactive Simon Says Game built using HTML, CSS, and JavaScript. This memory game challenges users to repeat a randomly generated sequence of button presses. Perfect for beginners looking to practice DOM manipulation and game logic.',
    image: '/projects/Simon Says Game.png',
    tags: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://adityaa2227.github.io/Simon-Says-Game/',
    githubUrl: 'https://github.com/Adityaa2227/Simon-Says-Game',
    featured: false,
  },
  {
    title: 'Dice Roll Simulator',
    description: 'A simple and interactive Dice Roll Simulator built using HTML, CSS, and JavaScript. This project allows users to simulate rolling dice with a click, making it a fun tool for games, learning, or just passing the time.',
    image: '/projects/Dice Roll Simulator.png',
    tags: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://adityaa2227.github.io/Dice-Roll-Simulator/',
    githubUrl: 'https://github.com/Adityaa2227/Dice-Roll-Simulator',
    featured: false,
  },
    {
      title: 'New Year Countdown',
      description: 'This is a simple and beautiful New Year Countdown web application built using HTML, CSS, and JavaScript. It features a countdown timer that displays the time remaining until the New Year, along with a festive design.',
      image: '/projects/New Year Countdown.png',
      tags: ['HTML', 'CSS', 'JavaScript'],
      liveUrl: 'https://adityaa2227.github.io/New-Year-CountDown/',
      githubUrl: 'https://github.com/Adityaa2227/New-Year-Countdown',
      featured: false,
    },{
    title: 'Guess the Number',
    description: 'A fun and interactive number guessing game built with HTML, CSS, and JavaScript. Try to guess the secret number between 1 and 100 in just 10 attempts!',
    image: '/projects/Guess the Number.png',
    tags: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://adityaa2227.github.io/Guess-The-Number/',
    githubUrl: 'https://github.com/Adityaa2227/Guess-The-Number',
    featured: false,
  },{
  title: 'Digital Clock',
    description: 'A simple and elegant Digital Clock web application built with HTML, CSS, and JavaScript. This project displays the current time in real-time with a clean and responsive interface.',
    image: '/projects/Digital Clock.png',
    tags: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://adityaa2227.github.io/Digital-Clock/',
    githubUrl: 'https://github.com/Adityaa2227/Digital-Clock',
    featured: false,
  },{
  title: 'BMI Calculator',
    description: 'A simple and user-friendly Body Mass Index (BMI) Calculator web application built with HTML, CSS, and JavaScript. Instantly calculate your BMI and determine your health category with a clean, responsive interface.',
    image: '/projects/BMI Calculator.png',
    tags: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://adityaa2227.github.io/BMI-Calculator/',
    githubUrl: 'https://github.com/Adityaa2227/BMI-Calculator',
    featured: false,
  },{
    title: 'Random Color Generator',
    description: 'A fun and interactive web application that generates random RGB colors on button click. Built using HTML, CSS, and JavaScript, this project is perfect for beginners looking to strengthen their DOM manipulation skills.',
    image: '/projects/Random Color Generator.png',
    tags: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://adityaa2227.github.io/Random-Color-Generator/',
    githubUrl: 'https://github.com/Adityaa2227/Random-Color-Generator',
    featured: false,
  },
  {
    title: 'Cat Facts & Dog Images Generator',
    description: 'A simple and delightful web application that displays random cat facts and cute dog images using public APIs. Built using HTML, CSS, and JavaScript (with Axios for API requests).',
    image: '/projects/Cat Facts & Dog Images Generator.png',
    tags: ['HTML', 'CSS', 'JavaScript', "Axios", "API"],
    liveUrl: 'https://adityaa2227.github.io/Cat-Fact-Dog-Image/',
    githubUrl: 'https://github.com/Adityaa2227/Cat-Fact-Dog-Image',
    featured: false,
  },
]
export const getFeaturedProjects = () => projects.filter(project => project.featured)