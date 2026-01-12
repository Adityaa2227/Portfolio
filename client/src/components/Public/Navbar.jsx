import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-scroll';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', to: 'about' },
    { name: 'Skills', to: 'skills' },
    { name: 'Experience', to: 'experience' },
    { name: 'Projects', to: 'projects' },
    { name: 'Testimonials', to: 'testimonials' },
    { name: 'Contact', to: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter cursor-pointer flex items-center gap-1 group">
            <span className="text-white group-hover:text-blue-400 transition-colors">Aditya</span>
            <span className="text-blue-500 group-hover:text-white transition-colors">.dev</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
                <Link
                    key={link.name}
                    to={link.to}
                    smooth={true}
                    duration={500}
                    className="text-gray-400 hover:text-white cursor-pointer transition-colors text-sm font-medium tracking-wide uppercase"
                >
                    {link.name}
                </Link>
            ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Mobile Nav */}
        <AnimatePresence>
            {mobileMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-full left-0 w-full glass-card border-b border-white/10 md:hidden flex flex-col p-6 gap-4"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.to}
                            smooth={true}
                            duration={500}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-gray-400 hover:text-white cursor-pointer text-sm font-medium tracking-wide uppercase"
                        >
                            {link.name}
                        </Link>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
