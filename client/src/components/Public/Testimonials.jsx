import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { Quote, Star, User, Send, X, Plus, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const [formData, setFormData] = useState({
        name: '', role: '', message: '', rating: 5
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { fetchTestimonials(); }, []);

    useEffect(() => {
        if (testimonials.length <= 1 || isPaused) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 4000);
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

    const slideVariants = {
        enter: { x: 200, opacity: 0, scale: 0.95 },
        center: { x: 0, opacity: 1, scale: 1 },
        exit: { x: -200, opacity: 0, scale: 0.95 }
    };

    return (
        <section id="testimonials" className="py-20 relative overflow-hidden bg-background">
            {/* Background glows */}
            <div className="absolute top-20 left-0 w-96 h-96 bg-orange-500/[0.04] rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/[0.03] rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-white">
                            Client <span className="gradient-text-orange">Stories</span>
                        </h2>
                        <div className="section-divider !mx-0 mt-4" />
                        <p className="text-gray-500 mt-6 max-w-md">
                            See what others are saying about their experience working with me.
                        </p>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-white/[0.03] hover:bg-orange-500/10 border border-white/[0.06] hover:border-orange-500/30 px-6 py-3 rounded-full text-white hover:text-orange-400 transition-all duration-300 backdrop-blur-md font-medium text-sm"
                    >
                        <Plus size={16} />
                        Write a Review
                    </motion.button>
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
                                    {/* Quote decorations */}
                                    <Quote className="absolute top-6 left-6 text-orange-500/10" size={50} />
                                    <Quote className="absolute bottom-6 right-6 text-orange-500/10 rotate-180" size={50} />

                                    <div className="flex flex-col items-center text-center relative z-10">
                                        {/* Stars */}
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

                                        {/* Message */}
                                        <p className="text-lg md:text-xl font-light text-gray-300 mb-8 italic leading-relaxed max-w-2xl">
                                            "{testimonials[currentIndex].message}"
                                        </p>

                                        {/* Author */}
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
                            No testimonials yet. Be the first to review!
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
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-surface border border-white/[0.06] rounded-2xl p-8 max-w-md w-full relative shadow-2xl"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={22} />
                            </button>

                            <h3 className="text-2xl font-bold text-white mb-1 font-heading">Leave a Review</h3>
                            <p className="text-gray-500 mb-6 text-sm">Share your experience working with me.</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Rating */}
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2 font-medium">Rating</label>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => handleRating(star)}
                                                className="transition-transform hover:scale-110 focus:outline-none"
                                            >
                                                <Star
                                                    size={26}
                                                    fill={star <= formData.rating ? "#ff6a00" : "none"}
                                                    className={star <= formData.rating ? "text-orange-500" : "text-gray-700"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Name & Role */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2 font-medium">Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 text-gray-600" size={16} />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-2.5 pl-10 pr-4 text-white transition-all duration-300"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2 font-medium">Role</label>
                                        <input
                                            type="text"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-2.5 px-4 text-white transition-all duration-300"
                                            placeholder="CEO, Company"
                                        />
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2 font-medium">Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white transition-all duration-300 resize-none"
                                        placeholder="Tell me about your experience..."
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-glow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Sending...' : (
                                        <>Submit Review <Send size={16} /></>
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
