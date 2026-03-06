'use client'

import React, { useRef } from 'react'
import {
  SiOpenjdk, SiCplusplus, SiC, SiHtml5, SiCss3, SiJavascript, SiPython,
  SiReact, SiGit, SiGithub, SiRedux, SiBootstrap, SiTailwindcss, SiFigma,
  SiWordpress, SiPostman, SiElementor, SiHoppscotch, SiNodedotjs, SiExpress,
  SiMongodb, SiMysql, SiFirebase, SiSocketdotio, SiWebrtc, SiMongoose,
  SiNextdotjs, SiVercel, SiNetlify, SiHeroku,
} from 'react-icons/si'
import { FaJava } from "react-icons/fa";
import { VscCode } from 'react-icons/vsc'
import {
  HiOutlineLightBulb, HiOutlineCode, HiOutlineDesktopComputer,
  HiDatabase, HiServer, HiOutlineKey, HiOutlineShieldCheck,
} from 'react-icons/hi'

import { skills as staticSkills } from '../../data/personal'
import api from '../../api/axios';
import gsap from 'gsap';
import useScrollAnimations from '../../hooks/useScrollAnimations';

const skillIcons = {
  'C++': SiCplusplus, 'C': SiC, 'HTML': SiHtml5, 'CSS': SiCss3,
  'JavaScript': SiJavascript, 'Python': SiPython, 'React': SiReact,
  'VS Code': VscCode, 'Git': SiGit, 'GitHub': SiGithub,
  'Bootstrap': SiBootstrap, 'Tailwind CSS': SiTailwindcss, 'Figma': SiFigma,
  'WordPress': SiWordpress, 'Redux': SiRedux, 'Postman': SiPostman,
  'Hoppscotch': SiHoppscotch, 'Elementor': SiElementor, 'Node.js': SiNodedotjs,
  'Express.js': SiExpress, 'MongoDB': SiMongodb, 'MySQL': SiMysql,
  'Java': FaJava, 'JWT': HiOutlineShieldCheck, 'OAuth': HiOutlineKey,
  'Firebase': SiFirebase, 'Mongoose': SiMongoose, 'Socket.io': SiSocketdotio,
  'WebRTC': SiWebrtc, 'Next.js': SiNextdotjs, 'Vercel': SiVercel,
  'Netlify': SiNetlify, 'Heroku': SiHeroku,
}

const skillColors = {
  'C++': 'text-[#00599C]', 'C': 'text-[#A8B9CC]', 'HTML': 'text-[#E34F26]',
  'CSS': 'text-[#1572B6]', 'JavaScript': 'text-[#F7DF1E]', 'Python': 'text-[#3776AB]',
  'React': 'text-[#61DAFB]', 'VS Code': 'text-[#007ACC]', 'Git': 'text-[#F05032]',
  'GitHub': 'text-white', 'Bootstrap': 'text-[#7952B3]', 'Tailwind CSS': 'text-[#06B6D4]',
  'Figma': 'text-[#F24E1E]', 'WordPress': 'text-[#21759B]', 'Redux': 'text-[#764ABC]',
  'Postman': 'text-[#FF6C37]', 'Hoppscotch': 'text-[#FF6C37]', 'Elementor': 'text-[#FF6C37]',
  'Node.js': 'text-[#339933]', 'Express.js': 'text-white', 'MongoDB': 'text-[#47A248]',
  'MySQL': 'text-[#4479A1]', 'Java': 'text-[#007396]', 'JWT': 'text-yellow-600',
  'OAuth': 'text-blue-600', 'Firebase': 'text-[#FFCA28]', 'Mongoose': 'text-red-600',
  'Socket.io': 'text-white', 'WebRTC': 'text-[#F37C20]', 'Next.js': 'text-white',
  'Vercel': 'text-white', 'Netlify': 'text-[#00C7B7]', 'Heroku': 'text-[#430098]',
}

const categoryIcons = {
  'Languages': HiOutlineLightBulb,
  'Frontend': HiOutlineCode,
  'Backend': HiServer,
  'Database': HiDatabase,
  'Tools & Platforms': HiOutlineDesktopComputer,
};

export default function Skills() {
  const [skills, setSkills] = React.useState([]);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const { revealText, revealStagger } = useScrollAnimations();

  React.useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await api.get('/skills');
        const grouped = data.reduce((acc, skill) => {
          const found = acc.find(g => g.category === skill.category);
          if (found) {
            found.items.push(skill.name);
          } else {
            acc.push({ category: skill.category, items: [skill.name] });
          }
          return acc;
        }, []);

        const order = ['Languages', 'Frontend', 'Backend', 'Database', 'Tools & Platforms'];
        grouped.sort((a, b) => {
          const indexA = order.indexOf(a.category);
          const indexB = order.indexOf(b.category);
          return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
        });

        setSkills(grouped);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSkills();
  }, []);

  // GSAP Animations
  React.useEffect(() => {
    let ctx;
    if (skills.length > 0) {
      ctx = gsap.context(() => {
        revealText(headerRef.current);
        const categories = sectionRef.current.querySelectorAll('.skill-category-wrapper');
        categories.forEach(cat => {
          const title = cat.querySelector('h3');
          const items = cat.querySelectorAll('.skill-card');
          revealText(title);
          revealStagger(items, cat);
        });
      }, sectionRef);
    }
    return () => ctx && ctx.revert();
  }, [skills]);

  return (
    <section id="skills" className="py-20 bg-background text-white relative overflow-hidden" ref={sectionRef}>
      {/* Background glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[150px]" />

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
        <div
          ref={headerRef}
          className="mb-14 text-center opacity-0"
        >
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl font-heading text-white">
            Skills & <span className="gradient-text-orange">Expertise</span>
          </h2>
          <div className="section-divider" />
        </div>

        <div className="space-y-12">
          {skills.map((skillCategory) => (
            <div key={skillCategory.category} className="skill-category-wrapper">
              <div className="flex items-center justify-center gap-3 mb-6 opacity-0">
                {categoryIcons[skillCategory.category] && React.createElement(categoryIcons[skillCategory.category], {
                  className: `w-5 h-5 text-orange-400`
                })}
                <h3 className="text-xl font-semibold text-center font-heading text-gray-200">
                  {skillCategory.category}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
                {skillCategory.items.map((skill) => (
                  <div
                    key={skill}
                    className="skill-card glass-card relative flex flex-col items-center p-5 md:p-6 rounded-xl group cursor-default opacity-0"
                  >
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-orange-500/[0.03] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {skillIcons[skill] ? React.createElement(skillIcons[skill], {
                      className: `w-10 h-10 md:w-12 md:h-12 ${skillColors[skill] || 'text-white'} mb-3 relative z-10 transition-transform duration-300 group-hover:scale-110`
                    }) : (
                      <HiOutlineLightBulb className="relative z-10 w-10 h-10 md:w-12 md:h-12 mb-3 text-white" />
                    )}
                    <span className="relative z-10 font-medium text-center text-gray-300 text-sm">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
