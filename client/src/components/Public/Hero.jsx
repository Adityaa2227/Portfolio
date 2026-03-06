import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { FileText, Mail, ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-scroll';

const Hero = () => {
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
        try {
            const { data } = await api.get('/resume');
            setResume(data);
        } catch (error) {
            console.log('No active resume');
        }
    };
    fetchResume();
  }, []);

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-background">
        {/* Primary orange glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-500/[0.07] rounded-full blur-[150px]" />
        {/* Secondary warm glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/[0.04] rounded-full blur-[120px]" />
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 text-left">
            <div className="flex-1 max-w-2xl">
              {/* Status Badge */}
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 border border-orange-500/20 rounded-full bg-orange-500/[0.06] backdrop-blur-sm text-sm text-orange-400 font-medium tracking-wide">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  Available for Work
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 tracking-tight text-white leading-[1.05]"
              >
                Hi, I'm{' '}
                <span className="gradient-text-orange">Aditya</span>
                <br />
                <span className="gradient-text-orange">Agarwal</span>
              </motion.h1>

              {/* Subheading */}
              <motion.h2
                variants={itemVariants}
                className="text-lg md:text-xl text-gray-400 mb-6 font-normal leading-relaxed"
              >
                <span className="text-white font-medium">Full Stack Web Developer</span> & Software Engineer
              </motion.h2>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-gray-500 text-base md:text-lg max-w-xl mb-10 leading-relaxed"
              >
                I build robust, scalable web applications and write efficient code to solve real-world problems. From frontend to backend and data structures to algorithms, I bring logic and performance together.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <Link
                  to="projects"
                  smooth={true}
                  duration={500}
                  className="group px-8 py-3.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-xl hover:shadow-glow-md transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  View My Work
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                {resume && (() => {
                  const BASE_URL = import.meta.env.PROD ? 'https://portfolio-backend-ha1q.onrender.com' : 'http://localhost:5000';
                  return (
                    <a
                      href={`${BASE_URL}${resume.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3.5 bg-transparent border border-orange-500/30 text-orange-400 font-semibold rounded-xl hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-300 flex items-center gap-2"
                    >
                      <FileText size={18} />
                      View Resume
                    </a>
                  );
                })()}

                <Link
                  to="contact"
                  smooth={true}
                  duration={500}
                  className="px-8 py-3.5 bg-transparent border border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/5 hover:border-white/20 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <Mail size={18} />
                  Contact Me
                </Link>
              </motion.div>
            </div>

            {/* Avatar Side */}
            <motion.div
              variants={itemVariants}
              className="flex-1 flex justify-center md:justify-end relative"
            >
              <div className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px]">
                {/* Glow behind avatar */}
                <div className="absolute inset-0 bg-orange-500/15 rounded-full blur-[80px] animate-pulse-glow" />
                {/* Avatar ring */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-orange-500/20 to-transparent" />
                <img
                  src="https://ui-avatars.com/api/?name=Aditya+Agarwal&background=random&size=512"
                  alt="Aditya Agarwal"
                  className="relative w-full h-full object-cover rounded-full border-2 border-orange-500/20 shadow-2xl z-10"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-orange-500/40"
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
