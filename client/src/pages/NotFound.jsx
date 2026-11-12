import React, { Suspense, lazy, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/Public/Navbar';
import { gsap } from '../lib/motion';

const Starfield = lazy(() => import('../components/Common/Starfield'));

/** Simple astronaut drawn in SVG. */
const Astronaut = () => (
  <svg viewBox="0 0 200 220" className="h-full w-full" aria-hidden>
    <defs>
      <linearGradient id="visor" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#c4b5fd" />
        <stop offset="1" stopColor="#4c1d95" />
      </linearGradient>
    </defs>
    {/* backpack */}
    <rect x="58" y="86" width="84" height="74" rx="18" fill="#cbd5e1" />
    {/* body */}
    <rect x="66" y="92" width="68" height="78" rx="24" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
    <rect x="84" y="118" width="32" height="20" rx="5" fill="#ddd6fe" />
    <circle cx="92" cy="128" r="3" fill="#8b5cf6" /><circle cx="104" cy="128" r="3" fill="#d946ef" />
    {/* arms */}
    <rect x="34" y="98" width="38" height="20" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" transform="rotate(-35 53 108)" />
    <rect x="128" y="104" width="38" height="20" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" transform="rotate(20 147 114)" />
    {/* legs */}
    <rect x="72" y="158" width="22" height="36" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
    <rect x="106" y="158" width="22" height="36" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
    {/* helmet */}
    <circle cx="100" cy="64" r="42" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
    <rect x="70" y="44" width="60" height="42" rx="21" fill="url(#visor)" />
    <ellipse cx="86" cy="56" rx="8" ry="5" fill="#fff" opacity="0.6" />
    <text x="100" y="78" textAnchor="middle" fontFamily="Poppins, sans-serif" fontStyle="italic" fontWeight="800" fontSize="16" fill="#f5f3ff">AA</text>
  </svg>
);

const NotFound = () => {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.nf-in', { y: 40, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out' });
        gsap.from('.nf-404', { scale: 0.6, autoAlpha: 0, duration: 1.1, ease: 'back.out(1.6)' });
        gsap.to('.nf-astro', { y: -18, rotate: 8, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to('.nf-ring', { rotate: 360, duration: 40, ease: 'none', repeat: -1 });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Suspense fallback={null}><Starfield /></Suspense>
      <Navbar />
      <main ref={root} className="page-wrap grid min-h-screen items-center gap-10 pt-28 pb-16 lg:grid-cols-2">
        <div>
          <p className="nf-404 font-heading text-[clamp(6rem,18vw,11rem)] font-extrabold italic leading-none text-gradient">404</p>
          <h1 className="nf-in mt-4 font-heading text-3xl sm:text-4xl font-bold">Oops! Page Not Found</h1>
          <p className="nf-in mt-3 max-w-[42ch] text-text-muted">
            The page you&rsquo;re looking for might have been moved, deleted, or never existed. Let&rsquo;s get you back to Earth.
          </p>
          <div className="nf-in mt-8 flex flex-wrap gap-3">
            <Link to="/" className="btn-primary magnetic">Go Back Home <ArrowRight size={16} aria-hidden /></Link>
            <Link to="/projects" className="btn-outline">See my projects</Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[420px]" aria-hidden>
          <div className="absolute inset-[18%] rounded-full bg-accent/30 blur-3xl" />
          {/* planet */}
          <div
            className="absolute bottom-0 left-1/2 h-[46%] w-[46%] -translate-x-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle at 35% 30%, #ede9fe, #a78bfa 40%, #5b21b6 85%)', boxShadow: '0 0 60px rgb(139 92 246 / 0.6)' }}
          />
          <svg className="nf-ring absolute bottom-[3%] left-1/2 h-[42%] w-[90%] -translate-x-1/2" viewBox="0 0 400 160">
            <ellipse cx="200" cy="80" rx="190" ry="40" fill="none" stroke="rgb(var(--c-accent-strong) / 0.5)" strokeWidth="2" strokeDasharray="4 10" />
          </svg>
          <div className="nf-astro absolute left-[22%] top-[2%] w-[56%]">
            <Astronaut />
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
