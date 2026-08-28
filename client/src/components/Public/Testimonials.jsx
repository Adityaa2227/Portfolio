import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import testimonialsData from '../../data/testimonials.json';
import { Quote, Star, MessageSquare } from 'lucide-react';

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const testimonials = testimonialsData;

    React.useEffect(() => {
        if (testimonials.length <= 1 || isPaused) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [testimonials.length, isPaused]);

    const slideVariants = {
        enter: { x: 200, opacity: 0, scale: 0.95 },
        center: { x: 0, opacity: 1, scale: 1 },
        exit: { x: -200, opacity: 0, scale: 0.95 }
    };

    return (
        <section id="testimonials" className="py-20 relative overflow-hidden bg-background">
            <div className="absolute top-20 left-0 w-96 h-96 bg-orange-500/[0.04] rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/[0.03] rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-white">
                            Client <span className="gradient-text-orange">Stories</span>
                        </h2>
                        <div className="section-divider mt-4" />
                        <p className="text-gray-500 mt-6 max-w-md mx-auto">
                            See what others are saying about their experience working with me.
                        </p>
                    </motion.div>
                </div>

                {/* Slider */}
                <div
                    className="relative h-[380px] md:h-[350px] flex items-center justify-center"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {testimonials.length > 0 ? (
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentIndex}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="absolute w-full max-w-3xl"
                            >
                                <div className="glass-card p-10 md:p-14 rounded-2xl relative mx-auto">
                                    <Quote className="absolute top-6 left-6 text-orange-500/10" size={50} />
                                    <Quote className="absolute bottom-6 right-6 text-orange-500/10 rotate-180" size={50} />

                                    <div className="flex flex-col items-center text-center relative z-10">
                                        <div className="flex gap-1 mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={20}
                                                    fill={i < testimonials[currentIndex].rating ? "#ff6a00" : "none"}
                                                    className={i < testimonials[currentIndex].rating ? "text-orange-500" : "text-gray-700"}
                                                />
                                            ))}
                                        </div>

                                        <p className="text-lg md:text-xl font-light text-gray-300 mb-8 italic leading-relaxed max-w-2xl">
                                            "{testimonials[currentIndex].message}"
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-base">
                                                {testimonials[currentIndex].name.charAt(0)}
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-bold text-white">{testimonials[currentIndex].name}</h4>
                                                <p className="text-orange-400/70 text-sm">{testimonials[currentIndex].role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <div className="text-center text-gray-600 flex flex-col items-center gap-3">
                            <MessageSquare size={32} className="text-gray-700" />
                            No testimonials yet.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {testimonials.length > 1 && (
                    <div className="flex justify-center gap-2.5 mt-8">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    i === currentIndex
                                        ? 'w-8 bg-orange-500'
                                        : 'w-1.5 bg-gray-700 hover:bg-gray-600'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Testimonials;
