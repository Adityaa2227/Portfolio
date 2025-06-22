'use client'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { HiDownload } from 'react-icons/hi'

export default function Hero() {
  return (
    <section className="flex items-center justify-center min-h-screen pt-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl font-heading text-secondary dark:text-white">
              Hi, I'm{' '}
              <span className="text-primary">Aditya Agarwal</span>
            </h1>
            <h2 className="mt-4 text-xl text-gray-600 sm:text-2xl dark:text-gray-300">
             Full Stack Web Developer & Software Engineer
            </h2>
            <p className="max-w-2xl mx-auto mt-6 text-gray-600 dark:text-gray-300 lg:mx-0">
            I build robust, scalable web applications and write efficient code to solve real-world problems. From frontend to backend and data structures to algorithms, I bring logic and performance together.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8 lg:justify-start">
              <a
                href="#projects"
                className="px-8 py-3 text-white transition-colors duration-200 rounded-lg bg-primary hover:bg-primary/90"
              >
                View My Work
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-3 transition-all duration-200 border rounded-lg border-primary text-primary dark:text-primary hover:bg-primary hover:text-white"
              >
                <HiDownload className="w-5 h-5" />
                <span>Resume</span>
              </a>
              <a
                href="#contact"
                className="px-8 py-3 transition-colors duration-200 border rounded-lg border-primary text-primary dark:text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
              >
                Contact Me
              </a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="max-w-md mx-auto aspect-square">
              <div className="w-full h-full overflow-hidden rounded-full bg-primary/5 dark:bg-primary/10">
                <Image
                  src="/Aditya.jpg"
                  alt="Aditya Agarwal"
                  width={500}
                  height={500}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
} 