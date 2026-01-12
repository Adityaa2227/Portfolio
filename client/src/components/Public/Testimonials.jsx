import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { Quote, Star, User, Send, X, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        message: '',
        rating: 5
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    // Auto-slide effect
    useEffect(() => {
        if (testimonials.length <= 1 || isPaused) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 2000); // 2 seconds per slide
        return () => clearInterval(interval);
    }, [testimonials.length, isPaused]);

    const fetchTestimonials = async () => {
        try {
            const { data } = await api.get('/testimonials');
            setTestimonials(data);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRating = (r) => {
        setFormData({ ...formData, rating: r });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/testimonials', formData);
            toast.success('Review submitted successfully! Pending approval.');
            setIsModalOpen(false);
            setFormData({ name: '', role: '', message: '', rating: 5 });
        } catch (error) {
            toast.error('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Variants for slider
    const slideVariants = {
        enter: { x: 300, opacity: 0, scale: 0.9 },
        center: { x: 0, opacity: 1, scale: 1 },
        exit: { x: -300, opacity: 0, scale: 0.9 }
    };

    return (
        <section id="testimonials" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#0B1120] to-black">
             {/* Dynamic Background Elements */}
             <div className="absolute top-20 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
             <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />

             <div className="container mx-auto px-6 relative z-10">
                 <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                     <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                     >
                         <h2 className="text-4xl md:text-5xl font-bold font-heading text-white">
                            Client <span className="text-blue-500">Stories</span>
                         </h2>
                         <p className="text-gray-400 mt-4 max-w-md">
                            See what others are saying about their experience working with me.
                         </p>
                     </motion.div>

                     <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-full text-white transition-all hover:scale-105 backdrop-blur-md font-medium"
                     >
                         <Plus size={18} />
                         Write a Review
                     </motion.button>
                 </div>

                 {/* Premium Slider */}
                 <div 
                    className="relative h-[400px] flex items-center justify-center"
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
                                <div className="glass-card p-10 md:p-14 rounded-3xl relative mx-auto bg-black/40 border border-white/5 shadow-2xl backdrop-blur-xl">
                                    <Quote className="absolute top-8 left-8 text-blue-500/20" size={60} />
                                    <Quote className="absolute bottom-8 right-8 text-blue-500/20 rotate-180" size={60} />
                                    
                                    <div className="flex flex-col items-center text-center">
                                        <div className="flex gap-1 mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    size={22} 
                                                    fill={i < testimonials[currentIndex].rating ? "#eab308" : "none"} 
                                                    className={i < testimonials[currentIndex].rating ? "text-yellow-500" : "text-gray-600"} 
                                                />
                                            ))}
                                        </div>

                                        <p className="text-xl md:text-2xl font-light text-gray-200 mb-8 italic leading-relaxed">
                                            "{testimonials[currentIndex].message}"
                                        </p>

                                        <div className="flex items-center gap-4 mt-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                                {testimonials[currentIndex].name.charAt(0)}
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-bold text-white text-lg">{testimonials[currentIndex].name}</h4>
                                                <p className="text-blue-400 text-sm">{testimonials[currentIndex].role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <div className="text-center text-gray-500">No testimonials yet. Be the first to review!</div>
                    )}
                 </div>

                 {/* Pagination Dots */}
                 {testimonials.length > 1 && (
                     <div className="flex justify-center gap-3 mt-8">
                         {testimonials.map((_, i) => (
                             <button 
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'}`}
                             />
                         ))}
                     </div>
                 )}
             </div>

             {/* Review Modal */}
             <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full relative shadow-2xl"
                        >
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <h3 className="text-2xl font-bold text-white mb-2">Leave a Review</h3>
                            <p className="text-gray-400 mb-6 text-sm">Share your experience working with me.</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 text-sm mb-2 font-medium">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => handleRating(star)}
                                                className="transition-transform hover:scale-110 focus:outline-none"
                                            >
                                                <Star 
                                                    size={28} 
                                                    fill={star <= formData.rating ? "#eab308" : "none"} 
                                                    className={star <= formData.rating ? "text-yellow-500" : "text-gray-600"} 
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 text-sm mb-2 font-medium">Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 text-gray-500" size={16} />
                                            <input 
                                                type="text" 
                                                name="name"
                                                required
                                                value={formData.name} 
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm mb-2 font-medium">Role (Optional)</label>
                                        <input 
                                            type="text" 
                                            name="role"
                                            value={formData.role} 
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                            placeholder="CEO, Company"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm mb-2 font-medium">Message</label>
                                    <textarea 
                                        name="message"
                                        required
                                        value={formData.message} 
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                                        placeholder="Tell me about your experience..."
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Sending...' : (
                                        <>
                                            Submit Review <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
             </AnimatePresence>
        </section>
    );
};

export default Testimonials;
