import React, { useEffect, useRef } from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import experienceData from '../../data/experience.json';
import useScrollAnimations from '../../hooks/useScrollAnimations';
import gsap from 'gsap';

const Experience = () => {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const listRef = useRef(null);
    const { revealText, revealStagger } = useScrollAnimations();

    useEffect(() => {
        const ctx = gsap.context(() => {
            revealText(headerRef.current);
            const items = listRef.current.querySelectorAll('.experience-item');
            revealStagger(items, listRef.current);
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="experience" className="py-20 relative text-white overflow-hidden" ref={sectionRef}>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/[0.03] rounded-full blur-[130px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500/[0.02] rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-6">
                <div
                    ref={headerRef}
                    className="mb-12 text-center opacity-0"
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-2">
                        My <span className="gradient-text-orange">Experience</span>
                    </h2>
                    <div className="section-divider" />
                    <p className="text-gray-500 max-w-2xl mx-auto mt-6">
                        My professional journey and working history.
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto" ref={listRef}>
                    {/* Timeline Line */}
                    <div className="absolute left-[20px] md:left-1/2 md:-ml-[1px] w-[2px] h-full bg-gradient-to-b from-orange-500/30 via-orange-500/10 to-transparent" />

                    <div className="space-y-12">
                        {experienceData.map((exp, index) => (
                            <div
                                key={exp._id || index}
                                className={`experience-item relative flex flex-col md:flex-row gap-8 opacity-0 ${
                                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                }`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 z-10 mt-1.5">
                                    <div className="w-4 h-4 bg-orange-500 rounded-full border-[3px] border-background shadow-glow-sm" />
                                </div>

                                {/* Content Card */}
                                <div className="ml-12 md:ml-0 md:w-[calc(50%-40px)] glass-card p-6 rounded-xl group">
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <div className="p-1.5 rounded-md bg-orange-500/10">
                                            <Briefcase size={16} className="text-orange-400" />
                                        </div>
                                        <span className="font-semibold text-orange-400 text-sm">{exp.company}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 font-heading">{exp.role}</h3>

                                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                        <Calendar size={14} />
                                        <span>{exp.duration}</span>
                                    </div>

                                    <p className="text-gray-400 text-sm leading-relaxed mb-5">
                                        {exp.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {exp.skills.map(skill => (
                                            <span
                                                key={skill}
                                                className="text-xs px-3 py-1 bg-orange-500/[0.08] text-orange-400/80 rounded-full border border-orange-500/10"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Empty side for balance */}
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
