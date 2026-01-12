'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  SiOpenjdk,
  SiCplusplus,
  SiC,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiPython,
  SiReact,
  SiGit,
  SiGithub,
  SiRedux,
  SiBootstrap,
  SiTailwindcss,
  SiFigma,
  SiWordpress,
  SiPostman,
  SiElementor,  
  SiHoppscotch ,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiFirebase,
  SiSocketdotio,
   SiWebrtc,
   SiMongoose ,
   SiNextdotjs,
    SiVercel,
    SiNetlify,
     SiHeroku,
} from 'react-icons/si'
import { FaJava } from "react-icons/fa";
import { VscCode } from 'react-icons/vsc'
import {
  HiOutlineLightBulb,
  HiOutlineCode,
  HiOutlineDesktopComputer,
  HiDatabase,
  HiServer,
  HiOutlineKey,
  HiOutlineShieldCheck,
  
} from 'react-icons/hi'

import { skills } from '../../data/personal'

const skillIcons = {
  'C++': SiCplusplus,
  'C': SiC,
  'HTML': SiHtml5,
  'CSS': SiCss3,
  'JavaScript': SiJavascript,
  'Python': SiPython,
  'React': SiReact,
  'VS Code': VscCode,
  'Git': SiGit,
  'GitHub': SiGithub,
  'Bootstrap': SiBootstrap,
  'Tailwind CSS': SiTailwindcss,
  'Figma': SiFigma,
  'WordPress': SiWordpress,
  'Redux': SiRedux,
  'Postman': SiPostman,
  'Hoppscotch': SiHoppscotch,
  'Elementor': SiElementor,
   'Node.js': SiNodedotjs,
  'Express.js': SiExpress,
  'MongoDB': SiMongodb,
  'MySQL': SiMysql,
  'Java': FaJava,
  'JWT': HiOutlineShieldCheck,
  'OAuth': HiOutlineKey,                  
  'Firebase': SiFirebase,
  'Mongoose': SiMongoose,
  'Socket.io': SiSocketdotio,
  'WebRTC': SiWebrtc,
  'Next.js': SiNextdotjs,
  'Vercel': SiVercel,
  'Netlify': SiNetlify,
  'Heroku': SiHeroku,
  
}

const skillColors = {
 
  'C++': 'text-[#00599C]',
  'C': 'text-[#A8B9CC]',
  'HTML': 'text-[#E34F26]',
  'CSS': 'text-[#1572B6]',
  'JavaScript': 'text-[#F7DF1E]',
  'Python': 'text-[#3776AB]',
  'React': 'text-[#61DAFB]',
  'VS Code': 'text-[#007ACC]',
  'Git': 'text-[#F05032]',
  'GitHub': 'text-white',
  'Bootstrap': 'text-[#7952B3]',
  'Tailwind CSS': 'text-[#06B6D4]',
  'Figma': 'text-[#F24E1E]',
  'WordPress': 'text-[#21759B]',
  
  'Redux': 'text-[#764ABC]',
  'Postman': 'text-[#FF6C37]',
  'Hoppscotch': 'text-[#FF6C37]',
  'Elementor': 'text-[#FF6C37]',
  'Node.js': 'text-[#339933]',
  'Express.js': 'text-white',
  'MongoDB': 'text-[#47A248]',
  'MySQL': 'text-[#4479A1]',
  'Java': 'text-[#007396]',
  'JWT': 'text-yellow-600',
  'OAuth': 'text-blue-600',
  'Firebase': 'text-[#FFCA28]',
  'Mongoose': 'text-red-600',
  'Socket.io': 'text-white',
  'WebRTC': 'text-[#F37C20]',
   'Next.js': 'text-white',
    'Vercel': 'text-white',
  'Netlify': 'text-[#00C7B7]',
  'Heroku': 'text-[#430098]',
}

const categoryIcons = {
'Languages': HiOutlineLightBulb,              // 💡 Symbolizes core concepts
  'Frontend': HiOutlineCode,                    // </> Frontend coding
  'Backend': HiServer,                          // 🖥️ Server-side logic
  'Database': HiDatabase,                       // 🗃️ Database icon
  'Tools & Platforms': HiOutlineDesktopComputer // 🧰 Tools/platforms
};

// Adjusted category colors to be more distinct/visible on black
const categoryColors = {
  'Languages': 'text-yellow-500',         
  'Frontend': 'text-blue-400',            
  'Backend': 'text-green-500',            
  'Database': 'text-rose-500',            
  'Tools & Platforms': 'text-purple-500', 
}

import { skills as staticSkills } from '../../data/personal' // Keep import for icon mapping logic if needed, but we fetch dynamic data
import api from '../../api/axios'; // Import axios instance

// ... (keep icon mappings) ...

export default function Skills() {
  const [skills, setSkills] = React.useState([]);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  React.useEffect(() => {
    const fetchSkills = async () => {
        try {
            const { data } = await api.get('/skills');
            // Transform DB data to Component structure
            // DB: [{ category: 'Languages', name: 'C++' }, ...]
            // Component: [{ category: 'Languages', items: ['C++', ...] }]
            const grouped = data.reduce((acc, skill) => {
                const found = acc.find(g => g.category === skill.category);
                if (found) {
                    found.items.push(skill.name);
                } else {
                    acc.push({ category: skill.category, items: [skill.name] });
                }
                return acc;
            }, []);
            
            // Sort categories custom order
            const order = ['Languages', 'Frontend', 'Backend', 'Database', 'Tools & Platforms'];
            
            grouped.sort((a, b) => {
                const indexA = order.indexOf(a.category);
                const indexB = order.indexOf(b.category);
                // If not found in order array, put at the end
                return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
            });

            setSkills(grouped);
        } catch (error) {
            console.error(error);
            // Fallback to static if fail (optional, but requested to remove hardcoded)
        }
    };
    fetchSkills();
  }, []);

  // ... (rest of component uses `skills` state)
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    // Changed bg to black
    <section id="skills" className="py-20 bg-black text-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl font-heading text-white">
            Skills & Expertise
          </h2>
          
    
          <div className="w-20 h-1 mx-auto mt-4 rounded-full bg-white" />
          
  
        </motion.div>

        <div className="space-y-16">
          {skills.map((skillCategory, index) => (
            <div key={skillCategory.category}>
              <div className="flex items-center justify-center gap-3 mb-8">
                {categoryIcons[skillCategory.category] && React.createElement(categoryIcons[skillCategory.category], {
                  className: `w-6 h-6 ${categoryColors[skillCategory.category] || 'text-white'}`
                })}
                <h3 className="text-2xl font-semibold text-center font-heading text-white">
                  {skillCategory.category}
                </h3>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5"
              >
                {skillCategory.items.map((skill) => (
                  <motion.div
                    key={skill}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    // Card styling: Dark gray/zinc background, subtle border
                    className="relative flex flex-col items-center p-6 transition-all duration-300 bg-zinc-900 border border-zinc-800 shadow-lg group rounded-xl hover:shadow-xl hover:border-zinc-600"
                  >
                    <div className="absolute inset-0 transition-transform transform bg-white/5 rounded-xl group-hover:scale-95" />
                    {skillIcons[skill] ? React.createElement(skillIcons[skill], {
                      // Using the specific skill color
                      className: `w-12 h-12 ${skillColors[skill] || 'text-white'} mb-4 relative z-10`
                    }) : (
                      <HiOutlineLightBulb className="relative z-10 w-12 h-12 mb-4 text-white" />
                    )}
                    <span className="relative z-10 font-medium text-center text-gray-200">{skill}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
