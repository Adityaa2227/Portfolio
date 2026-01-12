import React from 'react';
import Navbar from '../components/Public/Navbar';
import Hero from '../components/Public/Hero';
import About from '../components/Public/About';
import CodingProfiles from '../components/Public/CodingProfiles';
import Skills from '../components/Public/Skills';
import Experience from '../components/Public/Experience';
import Projects from '../components/Public/Projects';
import Footer from '../components/Public/Footer';
import Testimonials from '../components/Public/Testimonials';
import Contact from '../components/Public/Contact';

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
        <Navbar />
        <Hero />
        <About />
        <CodingProfiles />
        <Skills />
        <Experience />
        <Projects />
        <Testimonials />
        <Contact />
        <Footer />
    </div>
  );
};

export default Home;
