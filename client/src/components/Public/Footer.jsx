import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Github, Linkedin, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
    
    const socials = [
        { _id: '1', platform: 'LeetCode', url: 'https://leetcode.com/aditya2227', icon: 'code' },
        { _id: '2', platform: 'Codeforces', url: '#', icon: 'code' },
        { _id: '3', platform: 'CodeChef', url: '#', icon: 'code' },
    ];

    // Mapped simply, ideally would use specific icons but user didn't specify urls for all, just profiles.
    // I will use some generic icons if needed, or text.

    return (
        <footer className="bg-black py-12 border-t border-white/10">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                     <h2 className="text-2xl font-bold tracking-tighter mb-2">Aditya<span className="text-primary">Agarwal</span></h2>
                     <p className="text-gray-500 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
                </div>

                <div className="flex gap-6">
                    <a href="https://leetcode.com/aditya2227" target="_blank" className="hover:text-primary transition-colors">LeetCode</a>
                    <a href="#" className="hover:text-primary transition-colors">Codeforces</a>
                    <a href="#" className="hover:text-primary transition-colors">CodeChef</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
