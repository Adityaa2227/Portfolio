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
                
                // Animate each project section individually
                const sections = gridRef.current.querySelectorAll('.project-section');
                sections.forEach((section, index) => {
                    const image = section.querySelector('img').parentElement;
                    const info = section.querySelector('.project-info');

                    // Image Parallax/Reveal
                    gsap.fromTo(image, 
                        { opacity: 0, scale: 0.8, x: index % 2 === 0 ? -50 : 50 },
                        { 
                            opacity: 1, 
                            scale: 1, 
                            x: 0, 
                            duration: 1.2, 
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: section,
                                start: 'top 70%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );

                    // Text Slide In
                    gsap.fromTo(info,
                        { opacity: 0, x: index % 2 === 0 ? 50 : -50 }, // Opposite side of image
                        { 
                            opacity: 1, 
                            x: 0, 
                            duration: 1, 
                            delay: 0.2,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: section,
                                start: 'top 70%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );
                });

            }, sectionRef);
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

                <div ref={gridRef} className="space-y-32">
                    {projects.slice(0, 3).map((project, index) => (
                        <div 
                            key={project._id}
                            className={`project-section relative flex flex-col lg:flex-row gap-12 items-center ${
                                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                            }`}
                        >
                            {/* Visual Side */}
                            <div className="w-full lg:w-3/5 group perspective-1000">
                                <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-gray-900 aspect-video transform transition-transform duration-700 hover:scale-[1.02] hover:rotate-1">
                                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-20 transition-opacity z-10" />
                                    <img
                                        src={project.projectImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop"}
                                        alt={project.title}
                                        className="object-cover w-full h-full transform transition-transform duration-1000 group-hover:scale-110"
                                    />
                                </div>
                            </div>
                            
                            {/* Content Side */}
                            <div className="w-full lg:w-2/5 flex flex-col justify-center">
                                <div className="project-info opacity-0 translate-y-10">
                                    <span className="text-blue-500 font-mono text-sm tracking-wider mb-2 block">
                                        0{index + 1} — {project.category || 'Featured Project'}
                                    </span>
                                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                        {project.description}
                                    </p>
                                    
                                    <div className="space-y-4 mb-8">
                                        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Technologies</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, i) => (
                                                <span 
                                                    key={i} 
                                                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white hover:border-blue-500/50 transition-colors cursor-default"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <a 
                                            href={project.liveLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-2 text-lg font-semibold text-white hover:text-blue-400 transition-colors"
                                        >
                                            <Globe className="group-hover:animate-spin-slow" size={22} />
                                            <span>Live Demo</span>
                                            <ExternalLink size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </a>
                                        <a 
                                            href={project.githubLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-lg font-semibold text-gray-500 hover:text-white transition-colors"
                                        >
                                            <Github size={22} />
                                            <span>Source Code</span>
                                        </a>
                                    </div>
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
