'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import api from '../../api/axios'

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

  // Use state data or fallbacks
  const greeting = data?.greeting || 'Who I Am';
  const intro = data?.introduction || "I'm a Software Engineer and Full Stack Developer...";
  const description = data?.bioDescription || "I actively participate in coding contests...";

  return (
    <section id="about" className="py-20 bg-black text-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
        >
            <h2 className="text-3xl font-bold sm:text-4xl font-heading text-white">
            About Me
            </h2>
            <div className="w-20 h-1 mx-auto mt-4 rounded-full bg-white" />
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
            >
            <h3 className="text-2xl font-semibold font-heading text-white">
                {greeting}
            </h3>
            <p className="text-gray-400 font-bold">
                {intro}
            </p>
            <div 
                className="text-gray-400 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br />') }}
            />
            </motion.div>

            <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
            >
            <h3 className="text-2xl font-semibold font-heading text-white">
                What I Do
            </h3>
            <div className="space-y-4">
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg shadow-md hover:border-zinc-600 transition-colors">
                <h4 className="font-semibold font-heading text-white mb-2">💻 Software Development</h4>
                <p className="text-gray-400">Writing clean, optimized, and scalable code in C++, Java, and JavaScript</p>
                </div>
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg shadow-md hover:border-zinc-600 transition-colors">
                <h4 className="font-semibold font-heading text-white mb-2">🌐 Full Stack Web Development</h4>
                <p className="text-gray-400">Building full-stack applications using React, Node.js, and MongoDB</p>
                </div>
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg shadow-md hover:border-zinc-600 transition-colors">
                <h4 className="font-semibold font-heading text-white mb-2">📊 DSA & Competitive Programming</h4>
                <p className="text-gray-400">Solved 300+ DSA problems & participated in regular contests on LeetCode, Codeforces, Codechef etc.</p>
                </div>
            </div>
            </motion.div>
        </div>
      </div>
    </section>
  )
}
