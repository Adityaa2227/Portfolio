import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Globe, ArrowLeft, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import PublicNavbar from '../../components/Public/Navbar'; // Assuming we can reuse or create a simple one

const AllProjects = () => {
    const getYoutubeEmbedUrl = (url) => {
        if (!url) return '';
        try {
            if (url.includes('youtube.com/watch')) {
                const urlObj = new URL(url);
                const v = urlObj.searchParams.get('v');
                if (v) return `https://www.youtube.com/embed/${v}`;
            }
            if (url.includes('youtu.be/')) {
                const id = url.split('youtu.be/')[1].split('?')[0];
                return `https://www.youtube.com/embed/${id}`;
            }
            return url;
        } catch {
            return url;
        }
    };

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
        <div className="bg-background min-h-screen text-white relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[150px]" />

            {/* Simple Navbar for this page */}
            <nav className="fixed top-0 left-0 right-0 py-4 px-6 bg-black/70 backdrop-blur-xl z-50 border-b border-white/[0.06]">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="text-2xl font-heading font-bold tracking-tight cursor-pointer flex items-center gap-0.5 group">
                        <span className="text-white group-hover:text-orange-400 transition-colors duration-300">Aditya</span>
                        <span className="text-orange-500 group-hover:text-white transition-colors duration-300">.dev</span>
                    </Link>
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 font-medium text-sm">
                        <ArrowLeft size={18} /> Back to Home
                    </Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading text-white">All <span className="gradient-text-orange">Projects</span></h1>
                    <p className="text-gray-400 max-w-2xl text-base leading-relaxed">
                        A complete collection of my works, including side projects, experiments, and open-source contributions.
                    </p>
                </motion.div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                activeCategory === cat 
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                                : 'bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:text-white hover:border-white/[0.1] hover:bg-white/[0.06]'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="text-center py-20 bg-transparent relative z-10">
                         <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
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
                                className="bg-surface border border-white/[0.06] rounded-2xl overflow-hidden hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all duration-500 group flex flex-col h-full relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                                
                                { (project.youtubeVideoUrl || project.projectImage) && (
                                    <div className="aspect-video overflow-hidden relative border-b border-white/[0.06] group/media">
                                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur border border-white/[0.1] px-3 py-1.5 rounded-full text-xs text-orange-400 font-medium z-20 pointer-events-none">
                                            {project.category || 'Project'}
                                        </div>
                                        {project.youtubeVideoUrl ? (
                                            <iframe
                                                src={getYoutubeEmbedUrl(project.youtubeVideoUrl)}
                                                title={project.title}
                                                className="w-full h-full border-none relative z-10"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <img
                                                src={project.projectImage.startsWith('http') ? project.projectImage : `${import.meta.env.PROD ? 'https://portfolio-backend-ha1q.onrender.com' : 'http://localhost:5000'}${project.projectImage}`} 
                                                alt={project.title} 
                                                className="w-full h-full object-contain object-center transform group-hover/media:scale-[1.03] transition-transform duration-700"
                                            />
                                        )}
                                    </div>
                                )}
                                <div className="p-6 md:p-8 flex flex-col h-full relative z-20">
                                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-orange-400 transition-colors font-heading leading-tight">{project.title}</h3>
                                    <p className="text-gray-400 mb-6 text-sm leading-relaxed flex-grow line-clamp-3">
                                        {project.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {project.technologies.slice(0, 5).map((tech, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs font-medium text-gray-400 group-hover:border-orange-500/30 group-hover:text-orange-400 transition-colors duration-300">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-6 mt-auto">
                                        {project.liveLink && (
                                            <a 
                                                href={project.liveLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="group/link flex items-center gap-2 text-sm font-semibold text-white hover:text-orange-400 transition-colors duration-300"
                                            >
                                                <Globe size={16} />
                                                <span>Live Demo</span>
                                                <ArrowUpRight size={14} className="opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" />
                                            </a>
                                        )}
                                        {project.githubLink && (
                                            <a 
                                                href={project.githubLink}
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-white transition-colors duration-300"
                                            >
                                                <Github size={16} />
                                                <span>Source Code</span>
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
