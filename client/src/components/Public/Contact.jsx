import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { Send, Mail, MapPin, Phone, Github, Linkedin, Twitter, Instagram, ArrowUpRight } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMessage('');
        try {
            await api.post('/contact', formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    const contactInfo = [
        {
            icon: <Mail size={22} />,
            title: 'Email',
            value: 'Adityaagar324@gmail.com',
            href: 'mailto:Adityaagar324@gmail.com',
        },
        {
            icon: <Phone size={22} />,
            title: 'Phone',
            value: '+91 95086 64027',
            href: 'tel:+919508664027',
        },
        {
            icon: <MapPin size={22} />,
            title: 'Location',
            value: 'Garhwa, Jharkhand, India',
        },
    ];

    const socials = [
        { icon: Github, href: '#', label: 'GitHub' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Instagram, href: '#', label: 'Instagram' },
    ];

    return (
        <section id="contact" className="py-20 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[150px]" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-2">
                        Get In <span className="gradient-text-orange">Touch</span>
                    </h2>
                    <div className="section-divider" />
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
                    {/* Info Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-2xl font-bold mb-4 text-white font-heading">Let's Connect</h3>
                        <p className="text-gray-500 mb-10 leading-relaxed">
                            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                        </p>

                        <div className="space-y-5">
                            {contactInfo.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-4 group"
                                >
                                    <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 transition-colors duration-300 flex-shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-sm mb-0.5">{item.title}</h4>
                                        {item.href ? (
                                            <a href={item.href} className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                                                {item.value}
                                            </a>
                                        ) : (
                                            <p className="text-gray-400">{item.value}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Socials */}
                        <div className="mt-12">
                            <h4 className="font-semibold text-gray-400 text-sm uppercase tracking-wider mb-4">Follow Me</h4>
                            <div className="flex gap-3">
                                {socials.map(({ icon: Icon, href, label }, idx) => (
                                    <a
                                        key={idx}
                                        href={href}
                                        aria-label={label}
                                        className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:text-orange-400 hover:border-orange-500/30 hover:bg-orange-500/10 transition-all duration-300"
                                    >
                                        <Icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Form Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 text-white transition-all duration-300 placeholder:text-gray-600"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 text-white transition-all duration-300 placeholder:text-gray-600"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                                <textarea
                                    required
                                    rows="5"
                                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 text-white transition-all duration-300 resize-none placeholder:text-gray-600"
                                    placeholder="Tell me about your project..."
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-glow-md disabled:opacity-50"
                            >
                                {status === 'sending' ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    <>
                                        Send Message
                                        <Send size={18} />
                                    </>
                                )}
                            </button>

                            {status === 'success' && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-green-400 text-center text-sm"
                                >
                                    ✓ Message sent successfully!
                                </motion.p>
                            )}
                            {status === 'error' && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-400 text-center text-sm"
                                >
                                    {errorMessage}
                                </motion.p>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
