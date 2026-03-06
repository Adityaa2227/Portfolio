import React from 'react';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-background py-12 border-t border-white/[0.04]">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <h2 className="text-xl font-heading font-bold tracking-tight mb-1.5">
                            Aditya<span className="text-orange-500">Agarwal</span>
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Built with <Heart size={12} className="inline text-orange-500/60 fill-orange-500/60" /> using React & TailwindCSS
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6">
                        <a href="https://leetcode.com/aditya2227" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-400 transition-colors duration-300 text-sm font-medium">
                            LeetCode
                        </a>
                        <a href="#" className="text-gray-600 hover:text-orange-400 transition-colors duration-300 text-sm font-medium">
                            Codeforces
                        </a>
                        <a href="#" className="text-gray-600 hover:text-orange-400 transition-colors duration-300 text-sm font-medium">
                            CodeChef
                        </a>
                    </div>

                    {/* Copyright */}
                    <p className="text-gray-700 text-sm">
                        © {new Date().getFullYear()} All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
