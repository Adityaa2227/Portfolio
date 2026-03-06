'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import api from '../../api/axios'
import { Code2, Globe, Cpu } from 'lucide-react'

export default function About() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchBio = async () => {
      try {
        const { data } = await api.get('/bio');
        setData(data);
      } catch (error) {
        console.error('Error fetching bio:', error);
      }
    };
    fetchBio();
  }, []);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const greeting = data?.greeting || 'Who I Am';
  const intro = data?.introduction || "I'm a Software Engineer and Full Stack Developer...";
  const description = data?.bioDescription || "I actively participate in coding contests...";

  const whatIDo = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: 'Software Development',
      desc: 'Writing clean, optimized, and scalable code in C++, Java, and JavaScript',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Full Stack Web Development',
      desc: 'Building full-stack applications using React, Node.js, and MongoDB',
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: 'DSA & Competitive Programming',
      desc: 'Solved 300+ DSA problems & participated in regular contests on LeetCode, Codeforces, Codechef etc.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section id="about" className="py-20 bg-background text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[150px]" />

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl font-heading text-white">
            About Me
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left - Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold font-heading text-white">
              {greeting}
            </h3>
            <p className="text-orange-400/80 font-medium text-lg">
              {intro}
            </p>
            <div
              className="text-gray-400 leading-relaxed text-base"
              dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br />') }}
            />
          </motion.div>

          {/* Right - What I Do cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-4"
          >
            <h3 className="text-2xl font-semibold font-heading text-white mb-6">
              What I Do
            </h3>
            {whatIDo.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="glass-card p-6 rounded-xl group cursor-default"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 transition-colors duration-300 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold font-heading text-white mb-1.5 text-lg">{item.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
