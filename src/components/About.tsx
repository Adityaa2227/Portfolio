'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl font-heading text-secondary dark:text-white">
            About Me
          </h2>
          <div className="w-20 h-1 mx-auto mt-4 rounded-full bg-primary" />
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold font-heading text-secondary dark:text-white">
              Who I Am
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
             I'm a Software Engineer and Full Stack Developer with a strong command of Data Structures and Algorithms (DSA) and hands-on experience in developing real-world web projects.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
             I actively participate in coding contests on platforms like LeetCode, Codeforces, CodeChef, and others, constantly sharpening my problem-solving abilities. My work ranges from scalable backend services to dynamic frontend interfaces, using technologies like React, Node.js, MongoDB, and more.
             <br />

I believe in writing clean, efficient, and maintainable code that makes a measurable impact.


            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold font-heading text-secondary dark:text-white">
              What I Do
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-700">
                <h4 className="font-semibold font-heading text-primary">💻 Software Development</h4>
                <p className="text-gray-600 dark:text-gray-300">Writing clean, optimized, and scalable code in C++, Java, and JavaScript</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-700">
                <h4 className="font-semibold font-heading text-primary">🌐 Full Stack Web Development</h4>
                <p className="text-gray-600 dark:text-gray-300">Building full-stack applications using React, Node.js, and MongoDB</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-700">
                <h4 className="font-semibold font-heading text-primary">📊 DSA & Competitive Programming</h4>
                <p className="text-gray-600 dark:text-gray-300">Solved 300+ DSA problems & participated in regular contests on LeetCode, Codeforces, Codechef etc.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}