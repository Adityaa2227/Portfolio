import React, { useEffect, useState, useRef } from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import api from '../../api/axios';
import useScrollAnimations from '../../hooks/useScrollAnimations';
import gsap from 'gsap';

const Experience = () => {
    const [experiences, setExperiences] = useState([]);
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const listRef = useRef(null);
    const { revealSection, revealText, revealStagger } = useScrollAnimations();

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const { data } = await api.get('/experience');
                setExperiences(data);
            } catch (error) {
                console.error('Error fetching experience:', error);
            }
        };
        fetchExperience();
    }, []);

    // ANIMATION TRIGGER
    useEffect(() => {
        let ctx;
        if (experiences.length > 0) {
            ctx = gsap.context(() => {
                // Reveal Header
                revealText(headerRef.current);
                
                // Reveal List Items 
                const items = listRef.current.querySelectorAll('.experience-item');
                revealStagger(items, listRef.current);
            }, sectionRef);
        }
        return () => ctx && ctx.revert();
    }, [experiences]); // Rerun when data loads

    return (
        <section id="experience" className="py-20 relative text-white" ref={sectionRef}>
             {/* Background blur similar to other sections */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-6">
                <div 
                    ref={headerRef}
                    className="mb-16 text-center opacity-0" // Start hidden for GSAP
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">My <span className="text-blue-500">Experience</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        My professional journey and working history.
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto" ref={listRef}>
                    {/* Vertical Line */}
                    <div className="absolute left-[20px] md:left-1/2 md:-ml-0.5 w-0.5 h-full bg-gray-800" />

                    <div className="space-y-12">
                        {experiences.map((exp, index) => (
                            <div 
                                key={exp._id}
                                className={`experience-item relative flex flex-col md:flex-row gap-8 opacity-0 ${ // Start hidden
                                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                }`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-[#0B1120] z-10 mt-1.5" />

                                {/* Content Card */}
                                <div className="ml-12 md:ml-0 md:w-[calc(50%-40px)] bg-[#111827] border border-gray-800 p-6 rounded-xl hover:border-blue-500/50 transition-colors shadow-lg group">
                                    <div className="flex items-center gap-3 mb-2 text-blue-400">
                                        <Briefcase size={18} />
                                        <span className="font-semibold">{exp.company}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{exp.role}</h3>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                        <Calendar size={14} />
                                        <span>{exp.duration}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                        {exp.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {exp.skills.map(skill => (
                                            <span key={skill} className="text-xs px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Empty side for timeline balance */}
                                <div className="hidden md:block md:w-[calc(50%-40px)]" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
