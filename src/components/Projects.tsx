'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiExternalLink, FiGithub } from 'react-icons/fi'
import { getFeaturedProjects } from '../data/projects'

const featuredProjects = getFeaturedProjects()

export default function Projects() {
  return (
    <section id="projects" className="w-full py-24 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="px-6 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white">Featured Projects</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Some highlights from my recent work</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2, type: 'spring' }}
              viewport={{ once: true }}
              className="p-5 transition-transform border border-gray-200 shadow-xl bg-white/10 backdrop-blur-xl dark:bg-white/5 rounded-3xl dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-2xl">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">{project.title}</h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    Live
                  </Link>
                )}
                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:underline"
                  >
                    <FiGithub className="w-4 h-4" />
                    Code
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Link
            href="/projects"
            className="inline-block px-6 py-3 text-white transition-colors bg-black rounded-full dark:bg-white dark:text-black hover:bg-opacity-80"
          >
            View All Projects →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
