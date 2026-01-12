import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { FileText, Mail, ChevronDown } from 'lucide-react';
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

  return (
    <section id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-background">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
        </div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

        <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 text-left">
                    <div className="flex-1">
                        <div className="inline-block px-3 py-1 mb-6 border border-blue-500/30 rounded-full bg-blue-500/10 backdrop-blur-sm text-sm text-blue-400 font-medium tracking-wide">
                             Available for Work
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white leading-tight">
                            Hi, I'm <span className="text-blue-500">Aditya</span>
                            <br />
                            <span className="text-blue-500">Agarwal</span>
                        </h1>
                        <h2 className="text-xl md:text-2xl text-gray-300 mb-6 font-normal">
                             Full Stack Web Developer & Software Engineer
                        </h2>
                        <p className="text-gray-400 text-lg max-w-xl mb-10 leading-relaxed font-light">
                             I build robust, scalable web applications and write efficient code to solve real-world problems. From frontend to backend and data structures to algorithms, I bring logic and performance together.
                        </p>

                        <div className="flex flex-wrap gap-4">
                                <Link 
                                    to="projects"
                                    smooth={true}
                                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                >
                                    View My Work
                                </Link>
                                {resume && (() => {
                                    const BASE_URL = import.meta.env.PROD ? 'https://portfolio-backend-ha1q.onrender.com' : 'http://localhost:5000';
                                    return (
                                    <a 
                                        href={`${BASE_URL}${resume.fileUrl}`} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-3 bg-transparent border border-blue-500 text-blue-400 font-semibold rounded-lg hover:bg-blue-500/10 transition-colors flex items-center gap-2"
                                    >
                                        <FileText size={18} />
                                        View Resume
                                    </a>
                                    );
                                })()}
                             <Link to="contact" smooth={true} duration={500} className="px-8 py-3 bg-transparent border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer">
                                <Mail size={20} />
                                Contact Me
                             </Link>
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center md:justify-end relative">
                        <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[60px]" />
                            <img 
                                src="https://ui-avatars.com/api/?name=Aditya+Agarwal&background=random&size=512" 
                                alt="Aditya Agarwal" 
                                className="relative w-full h-full object-cover rounded-full border-4 border-gray-800 shadow-2xl z-10"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500"
        >
            <ChevronDown size={24} />
        </motion.div>
    </section>
  );
};

export default Hero;
