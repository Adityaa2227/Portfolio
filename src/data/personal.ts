export interface PersonalInfo {
  name: string
  location: string
  phone: string
  email: string
  links: {
    linkedin: string
    github: string
    leetcode: string
    allLinks: string
  }
  summary: string
}

export interface Skill {
  category: string
  items: string[]
}

export interface Experience {
  title: string
  company: string
  location: string
  duration: string
  description: string[]
}

export interface Education {
  degree: string
  institution: string
  field: string
  duration: string
  gpa: string
}

export interface Achievement {
  title: string
  description: string
}

export interface Activity {
  description: string
}

export const personalInfo: PersonalInfo = {
  name: 'ADITYA AGARWAL',
  location: 'Garhwa, Jharkhand',
  phone: '+91 9508664027',
  email: 'your.email@example.com', // Replace with actual email
  links: {
    linkedin: '#', // Replace with actual URL
    github: '#', // Replace with actual URL
    leetcode: '#', // Replace with actual URL
    allLinks: '#', // Replace with actual URL
  },
  summary: 'Second-year B.Tech Computer Science student at BIT Mesra with expertise in web development, data structures, and algorithms. Proficient in Java, C++, Python, and front-end technologies. Experienced in delivering user-friendly websites and projects, such as the CodeEditor. A GeeksforGeeks Campus Mantri and hackathon-winning leader, skilled in organizing events, fostering collaboration, and driving innovation.',
}

interface SkillCategory {
  category: string;
  items: string[];
}

export const skills: SkillCategory[] = [
  {
    category: "Languages",
    items: [
      "C++",
      "JavaScript",
      "Java",
      "Python",
      "C",
      
    ],
  },
  {
    category: "Frontend",
    items: [
      "HTML",
      "CSS",
      "Bootstrap",
      "Tailwind CSS",
      "React",
      "Redux",
      
    ],
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "Firebase",
      "JWT",
      "OAuth",
      "Socket.io",
      "WebRTC",
      "Next.js",
    ],
  },
  {
    category: "Database",
    items: [
      "MongoDB",
      "Mongoose",
      "MySQL",
    ],
  },
  {
    category: "Tools & Platforms",
    items: [
      "VS Code",
      "Git",
      "GitHub",
      "Postman",
      "Hoppscotch",
      "Figma",
      "WordPress",
      "Elementor",
      "Vercel",
      "Netlify",
      "Heroku",
    ],
  }
];

export const experiences: Experience[] = [
  {
    title: 'Campus Mantri',
    company: 'GeeksForGeeks',
    location: 'Remote',
    duration: 'Aug 2024 - Present',
    description: [
      'Successfully Organized and led 5+ coding events and workshops',
      'Fostering a collaborative development culture and engaging 100+ participants',
      'Enhancing technical skills and encouraging continuous learning',
    ],
  },
  {
    title: 'Freelancer',
    company: 'Self-employed',
    location: 'Remote',
    duration: 'July 2023 - Present',
    description: [
      'Successfully delivered 5+ client projects',
      'Creating user-friendly interfaces with HTML, CSS, JavaScript, and WordPress',
      'Resulted in a 30% increase in client engagement and satisfaction',
    ],
  },
  {
    title: 'Web Developer Intern',
    company: 'CodSoft',
    location: 'Remote',
    duration: 'July 2023 - Aug 2023',
    description: [
      'Build 3 websites using HTML, CSS, JS, and Bootstrap',
      'Focusing on user experience and responsiveness',
    ],
  },
]

export const education: Education = {
  degree: 'Bachelor Of Technology',
  institution: 'BIT Mesra - Patna Campus',
  field: 'Computer Science and Engineering',
  duration: '2023 - 2027',
  gpa: '8.7 CGPA (Upto 3rd Sem)',
}

export const achievements: Achievement[] = [
  {
    title: 'Team Leader at Dev Conquest Hackathon',
    description: 'Led the development of a fully functional LeetCode replica, overseeing front-end design and demonstrating leadership, innovative design skills, and effective collaboration, culminating in a winning project that showcased both technical and teamwork excellence.',
  },
  {
    title: 'Solved 300+ DSA problems',
    description: 'Solved problems on platforms like Codeforces, LeetCode, CodeChef, and HackerRank, enhancing analytical thinking and optimizing algorithms.',
  },
]

export const activities: Activity[] = [
  {
    description: 'Active NSS Volunteer, contributing to community service and social initiatives.',
  },
  {
    description: 'Team Member of Divya Club, a placement-oriented club at BIT Mesra.',
  },
  {
    description: 'Team Member of the Technical Club, organizing events and Encouraging continuous learning through technical challenges at BIT Mesra.',
  },
  {
    description: 'Won 1st Prize in Stage Drama at Technika 24.',
  },
  {
    description: 'Won 1st Prize in Nukkad Natak at Technika 24.',
  },
] 