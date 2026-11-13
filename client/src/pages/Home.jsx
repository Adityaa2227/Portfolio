import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Public/Navbar';
import Hero from '../components/Public/Hero';
import About from '../components/Public/About';
import Skills from '../components/Public/Skills';
import Projects from '../components/Public/Projects';
import Experience from '../components/Public/Experience';
import Testimonials from '../components/Public/Testimonials';
import Contact from '../components/Public/Contact';
import Footer from '../components/Public/Footer';
import usePortfolioData from '../hooks/usePortfolioData';
import { useSiteMotion, ScrollTrigger } from '../lib/motion';
import { startSmoothScroll, scrollToId } from '../lib/smooth';
import { useIntroDone } from '../lib/intro';
import { usePageMeta } from '../lib/pageMeta';
import { useSectionTracking } from '../lib/analytics';

const TRACKED_SECTIONS = ['about', 'skills', 'projects', 'experience', 'reviews', 'contact'];

// Three.js is heavy, so the star field loads after the page shell.
const Starfield = lazy(() => import('../components/Common/Starfield'));

export const Home = () => {
  const { projects, experience, resume } = usePortfolioData();
  usePageMeta({ path: '/' });
  const ready = useIntroDone();
  const scope = useRef(null);
  const { hash } = useLocation();
  const resumeUrl = resume?.fileUrl || '/resume.pdf';

  useEffect(() => startSmoothScroll(), []);

  useEffect(() => {
    if (!ready) return;
    ScrollTrigger.refresh();
    if (hash) requestAnimationFrame(() => scrollToId(hash.slice(1)));
  }, [ready, hash]);

  useSiteMotion(scope, [ready, projects.length]);
  useSectionTracking(TRACKED_SECTIONS, ready);

  return (
    <>
      <Suspense fallback={null}>
        <Starfield />
      </Suspense>

      <div ref={scope} className="relative min-h-screen text-foreground overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] btn-primary"
        >
          Skip to content
        </a>
        <Navbar activeResumeUrl={resumeUrl} />
        <main id="main">
          <Hero ready={ready} />
          <About />
          <Skills />
          <Projects projects={projects} />
          <Experience experiences={experience} />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;
