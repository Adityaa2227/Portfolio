import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { Send, Mail, MapPin, Phone, Github, Linkedin, Twitter, Instagram } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await api.post('/contact', formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="py-20 relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Get In <span className="text-white">Touch</span></h2>
                    <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Info Side */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6 text-white">Let's Connect</h3>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-900/30 rounded-lg text-blue-500">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Email</h4>
                                    <p className="text-gray-400">Adityaagar324@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-900/30 rounded-lg text-blue-500">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Phone</h4>
                                    <p className="text-gray-400">+91 95086 64027</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-900/30 rounded-lg text-blue-500">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Location</h4>
                                    <p className="text-gray-400">Garhwa, Jharkhand, India</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h4 className="font-bold text-white mb-4">Follow Me</h4>
                            <div className="flex gap-4">
                                {[Github, Linkedin, Twitter, Instagram].map((Icon, idx) => (
                                    <a key={idx} href="#" className="text-gray-400 hover:text-white transition-colors">
                                        <Icon size={24} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-[#1F2937] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                <input 
                                    type="email" 
                                    required
                                    className="w-full bg-[#1F2937] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                                <textarea 
                                    required
                                    className="w-full bg-[#1F2937] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors min-h-[150px]"
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={status === 'sending'}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                {status === 'sending' ? 'Sending...' : 'Send Message'}
                            </button>
                            {status === 'success' && <p className="text-green-500 text-center">Message sent successfully!</p>}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
