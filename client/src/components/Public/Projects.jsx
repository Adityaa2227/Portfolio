import React, { useEffect, useState, useRef } from 'react';
import { Github, ExternalLink, Globe, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import useScrollAnimations from '../../hooks/useScrollAnimations';
import gsap from 'gsap';

const Projects = () => {
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

    // GSAP animations
    useEffect(() => {
        let ctx;
        if (projects.length > 0) {
            ctx = gsap.context(() => {
                revealText(headerRef.current);

                const sections = gridRef.current.querySelectorAll('.project-section');
                sections.forEach((section, index) => {
                    const image = section.querySelector('img').parentElement;
                    const info = section.querySelector('.project-info');

                    gsap.fromTo(image,
                        { opacity: 0, scale: 0.9, x: index % 2 === 0 ? -40 : 40 },
                        {
                            opacity: 1, scale: 1, x: 0,
                            duration: 1, ease: 'power3.out',
                            scrollTrigger: {
                                trigger: section,
                                start: 'top 75%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );

                    gsap.fromTo(info,
                        { opacity: 0, x: index % 2 === 0 ? 40 : -40 },
                        {
                            opacity: 1, x: 0,
                            duration: 0.8, delay: 0.15,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: section,
                                start: 'top 75%',
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
        <section id="projects" className="py-20 bg-background relative overflow-hidden" ref={sectionRef}>
            {/* Background glow */}
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[150px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div
                    ref={headerRef}
                    className="mb-14 text-center opacity-0"
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-2 text-white">
                        Featured <span className="gradient-text-orange">Projects</span>
                    </h2>
                    <div className="section-divider" />
                    <p className="text-gray-500 max-w-2xl mx-auto mt-6">
                        A showcase of my recent work, side projects, and open source contributions.
                    </p>
                </div>

                <div ref={gridRef} className="space-y-20">
                    {projects.slice(0, 3).map((project, index) => (
                        <div
                            key={project._id}
                            className={`project-section relative flex flex-col lg:flex-row gap-10 lg:gap-16 items-center ${
                                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                            }`}
                        >
                            {/* Image Side */}
                            <div className="w-full lg:w-3/5 group">
                                <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] shadow-2xl bg-surface aspect-video">
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                                    {project.youtubeVideoUrl ? (
                                        <iframe
                                            src={getYoutubeEmbedUrl(project.youtubeVideoUrl)}
                                            title={project.title}
                                            className="w-full h-full border-none relative z-20"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <img
                                            src={project.projectImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop"}
                                            alt={project.title}
                                            className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full lg:w-2/5 flex flex-col justify-center">
                                <div className="project-info opacity-0 translate-y-10">
                                    <span className="text-orange-400 font-mono text-sm tracking-wider mb-3 block">
                                        0{index + 1} — {project.category || 'Featured Project'}
                                    </span>

                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight font-heading">
                                        {project.title}
                                    </h3>

                                    <p className="text-gray-400 text-base leading-relaxed mb-8">
                                        {project.description}
                                    </p>

                                    {/* Tech Stack */}
                                    <div className="space-y-3 mb-8">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Technologies</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-gray-400 hover:text-orange-400 hover:border-orange-500/30 transition-colors duration-300 cursor-default"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Links */}
                                    <div className="flex items-center gap-6">
                                        <a
                                            href={project.liveLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/link flex items-center gap-2 text-base font-semibold text-white hover:text-orange-400 transition-colors duration-300"
                                        >
                                            <Globe size={20} />
                                            <span>Live Demo</span>
                                            <ArrowUpRight size={16} className="opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" />
                                        </a>
                                        <a
                                            href={project.githubLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-base font-semibold text-gray-500 hover:text-white transition-colors duration-300"
                                        >
                                            <Github size={20} />
                                            <span>Source Code</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-14 text-center">
                    <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/[0.03] hover:bg-orange-500/10 border border-white/[0.06] hover:border-orange-500/30 rounded-full text-white hover:text-orange-400 transition-all duration-300 font-medium"
                    >
                        View All Projects
                        <ArrowUpRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Projects;
