import React, { useEffect, useState, useRef } from 'react';
import { Github, ExternalLink, Code2, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import useScrollAnimations from '../../hooks/useScrollAnimations';
import gsap from 'gsap';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const gridRef = useRef(null);
    const { revealText, revealStagger } = useScrollAnimations();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await api.get('/projects');
                setProjects(data.filter(p => p.isPublished !== false));
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchProjects();
    }, []);

    // ANIMATION
    useEffect(() => {
        let ctx;
        if (projects.length > 0) {
            ctx = gsap.context(() => {
                revealText(headerRef.current);
                const items = gridRef.current.querySelectorAll('.project-card');
                revealStagger(items, gridRef.current);
            }, sectionRef); // Scope to section
        }
        return () => ctx && ctx.revert();
    }, [projects]);

    return (
        <section id="projects" className="py-20 bg-[#0B1120] relative" ref={sectionRef}>
            <div className="container mx-auto px-6">
                <div 
                    ref={headerRef}
                    className="mb-16 text-center opacity-0"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Featured <span className="text-blue-500">Projects</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A showcase of my recent work, side projects, and open source contributions.
                    </p>
                </div>

                <div 
                    ref={gridRef}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {projects.slice(0, 3).map((project) => (
                        <div 
                            key={project._id}
                            className="project-card bg-[#1e293b] border border-gray-700/50 rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors group flex flex-col h-full opacity-0"
                        >
                            <div className="p-8 flex flex-col h-full">
                                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">{project.title}</h3>
                                <p className="text-gray-400 mb-6 leading-relaxed flex-grow line-clamp-3">
                                    {project.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {project.technologies.slice(0, 4).map((tech, i) => (
                                        <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full border border-blue-500/20">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies.length > 4 && (
                                         <span className="px-3 py-1 bg-gray-700/50 text-gray-400 text-xs font-medium rounded-full border border-gray-600">
                                            +{project.technologies.length - 4}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-6 mt-auto">
                                    <a 
                                        href={project.liveLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-white hover:text-blue-400 font-medium transition-colors"
                                    >
                                        <Globe size={18} />
                                        Live Demo
                                    </a>
                                    <a 
                                        href={project.githubLink}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Github size={18} />
                                        Source
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-16 text-center">
                    <Link to="/projects" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-colors">
                        View All Projects <ExternalLink size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Projects;
