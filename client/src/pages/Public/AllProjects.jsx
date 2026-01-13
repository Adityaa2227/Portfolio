import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Globe, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import PublicNavbar from '../../components/Public/Navbar'; // Assuming we can reuse or create a simple one

const AllProjects = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await api.get('/projects'); 
                setProjects(data);
                setFilteredProjects(data);

                // Extract unique categories
                const uniqueCategories = ['All', ...new Set(data.map(p => p.category || 'Other'))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        console.log('Filtering for:', activeCategory);
        let result = [];
        if (activeCategory === 'All') {
            result = projects;
        } else {
            result = projects.filter(p => (p.category || 'Other') === activeCategory);
        }
        console.log('Found results:', result.length);
        setFilteredProjects(result);
    }, [activeCategory, projects]);

    return (
        <div className="bg-[#0B1120] min-h-screen text-white">
            {/* Simple Navbar for this page */}
            <nav className="fixed top-0 left-0 right-0 py-4 px-6 bg-[#0B1120]/80 backdrop-blur-md z-50 border-b border-gray-800">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold font-heading">
                        <span className="text-blue-500">Aditya</span>.dev
                    </Link>
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={18} /> Back to Home
                    </Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">All <span className="text-blue-500">Projects</span></h1>
                    <p className="text-gray-400 max-w-2xl">
                        A complete collection of my works, including side projects, experiments, and open-source contributions.
                    </p>
                </motion.div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                activeCategory === cat 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-[#1e293b] text-gray-400 hover:text-white hover:bg-[#334155]'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="text-center py-20 bg-[#0B1120]">
                         <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : (
                    <div 
                        key={activeCategory}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredProjects.map((project) => (
                            <motion.div 
                                key={project._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-[#1e293b] border border-gray-700/50 rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors group flex flex-col h-full"
                            >
                                {project.projectImage && (
                                    <div className="h-48 overflow-hidden relative">
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs text-white font-medium z-10">
                                            {project.category || 'Project'}
                                        </div>
                                        <img 
                                            src={project.projectImage.startsWith('http') ? project.projectImage : `${import.meta.env.PROD ? 'https://portfolio-backend-ha1q.onrender.com' : 'http://localhost:5000'}${project.projectImage}`} 
                                            alt={project.title} 
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <div className="p-6 flex flex-col h-full">
                                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">{project.title}</h3>
                                    <p className="text-gray-400 mb-6 text-sm leading-relaxed flex-grow line-clamp-3">
                                        {project.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.technologies.slice(0, 5).map((tech, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full border border-blue-500/20">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4 mt-auto">
                                        {project.liveLink && (
                                            <a 
                                                href={project.liveLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-white hover:text-blue-400 text-sm font-medium transition-colors"
                                            >
                                                <Globe size={16} />
                                                Live Demo
                                            </a>
                                        )}
                                        {project.githubLink && (
                                            <a 
                                                href={project.githubLink}
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
                                            >
                                                <Github size={16} />
                                                Source
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProjects;
