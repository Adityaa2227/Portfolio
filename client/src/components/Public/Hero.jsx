import React, { useLayoutEffect, useRef } from 'react';
import { ArrowRight, Github, Linkedin, Code2, Mail, ChevronDown, Briefcase, CalendarClock } from 'lucide-react';
import { TextPlugin } from 'gsap/TextPlugin';
import { gsap } from '../../lib/motion';
import { scrollToId } from '../../lib/smooth';

gsap.registerPlugin(TextPlugin);

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/Adityaa2227', Icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/aditya2227/', Icon: Linkedin },
  { label: 'LeetCode', href: 'https://leetcode.com/u/aditya2227/', Icon: Code2 },
  { label: 'Email', href: 'mailto:adityaagar324@gmail.com', Icon: Mail },
];

const STATS = [
  { Icon: CalendarClock, value: 1, suffix: '+ yr', label: 'Experience' },
  { Icon: Code2, value: 1000, suffix: '+', label: 'DSA Problems' },
  { Icon: Briefcase, value: 3, suffix: '', label: 'Internships' },
];

const GREETING = 'Hey, I’m';

/** Workspace illustration used as the hero background. */
export const WorkspaceBackdrop = ({ className = '', priority = false, position = 'object-[72%_center]' }) => (
  <picture className={`block ${className}`}>
    <source media="(max-width: 768px)" srcSet="/hero-workspace-sm.webp" type="image/webp" />
    <source srcSet="/hero-workspace.webp" type="image/webp" />
    <img
      src="/hero-workspace.jpg"
      alt=""
      width="1672"
      height="941"
      fetchpriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={`h-full w-full object-cover ${position}`}
    />
  </picture>
);

export const Hero = ({ ready = true }) => {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (!ready) return undefined;
    const el = root.current;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power4.out' } })
          .fromTo('.hero-bg', { scale: 1.15, autoAlpha: 0 }, { scale: 1.04, autoAlpha: 1, duration: 1.8, ease: 'expo.out' })
          // Typewriter greeting, then the name and the rest of the copy
          .set('.type-line', { text: '' }, 0.4)
          .to('.type-line', { text: GREETING, duration: 0.7, ease: 'none' }, 0.5)
          .from('.h-stagger', { y: 40, autoAlpha: 0, duration: 1, stagger: 0.08 }, '-=0.05')
          .from('.hero-cue', { autoAlpha: 0, y: -10, duration: 0.6 }, '-=0.3');

        gsap.to('.caret', { autoAlpha: 0, duration: 0.5, repeat: -1, yoyo: true, ease: 'steps(1)' });

        // Scroll parallax
        gsap.to('.hero-bg', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to('.hero-copy', { y: -80, autoAlpha: 0.2, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom 30%', scrub: true } });
        gsap.to('.hero-cue', { y: 8, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 });
      });

      // Mouse parallax on the scene / framed picture
      mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
        const x = gsap.quickTo('.hero-bg-inner', 'x', { duration: 1, ease: 'power3.out' });
        const y = gsap.quickTo('.hero-bg-inner', 'y', { duration: 1, ease: 'power3.out' });
        const move = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          x(nx * -24); y(ny * -14);
        };
        window.addEventListener('pointermove', move);
        return () => window.removeEventListener('pointermove', move);
      });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section id="home" ref={root} className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20">
      {/* Dark theme: full-bleed scene */}
      <div aria-hidden className="hero-bg absolute inset-0 -z-10 origin-[70%_50%]">
        <div className="hero-bg-inner absolute -inset-6">
          <WorkspaceBackdrop className="h-full w-full" priority />
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-background/90 via-background/80 to-background/50 md:bg-gradient-to-r md:from-background md:via-background/70 md:to-transparent md:via-35%" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="page-wrap grid w-full items-center gap-12 lg:grid-cols-2">
        <div className={`hero-copy max-w-xl ${ready ? '' : 'invisible'}`}>
          <h1 className="font-heading font-bold leading-[1.05] tracking-tight">
            <span className="sr-only">{GREETING} Aditya Agarwal</span>
            <span aria-hidden className="block text-4xl sm:text-5xl lg:text-6xl text-foreground">
              <span className="type-line">{GREETING}</span>
              <span className="caret ml-1 inline-block h-[0.8em] w-[3px] translate-y-[0.08em] rounded-full bg-accent" />
            </span>
            <span aria-hidden className="h-stagger mt-1 block pb-2 pr-2 text-5xl sm:text-6xl lg:text-[4rem] sm:whitespace-nowrap font-extrabold italic text-gradient drop-shadow-[0_4px_30px_rgb(var(--c-accent)/0.45)]">
              Aditya Agarwal
            </span>
          </h1>

          <p className="h-stagger mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-base sm:text-lg font-semibold text-foreground">
            <span>SDE</span>
            <span className="h-4 w-px bg-border-strong" aria-hidden />
            <span>Backend Developer</span>
            <span className="h-4 w-px bg-border-strong" aria-hidden />
            <span>Problem Solver</span>
          </p>

          <p className="h-stagger mt-5 max-w-[44ch] text-base sm:text-lg leading-relaxed text-text-muted">
            I build scalable web applications, explore distributed systems, and love turning ideas into real products.
          </p>

          <div className="h-stagger mt-8 flex flex-wrap gap-3">
            <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToId('projects'); }} className="btn-primary magnetic group">
              View Projects <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
            </a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact'); }} className="btn-outline backdrop-blur-sm">
              Contact Me
            </a>
          </div>

          <ul className="h-stagger mt-8 flex gap-3">
            {SOCIALS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  aria-label={label}
                  title={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl glass text-text-muted transition-all hover:-translate-y-0.5 hover:border-accent hover:text-foreground hover:glow"
                >
                  <Icon size={18} aria-hidden />
                </a>
              </li>
            ))}
          </ul>

          {/* Stats strip */}
          <dl className="h-stagger mt-9 grid grid-cols-3 gap-3 rounded-2xl glass p-3">
            {STATS.map(({ Icon, value, suffix, label }) => (
              <div key={label} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5">
                <Icon size={20} className="shrink-0 text-accent-dark" aria-hidden />
                <div>
                  <dd className="font-heading text-lg font-bold leading-none text-foreground tabular-nums">
                    <span data-count={value}>{value}</span>{suffix}
                  </dd>
                  <dt className="mt-1 text-[11px] text-text-muted">{label}</dt>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <a
        href="#about"
        onClick={(e) => { e.preventDefault(); scrollToId('about'); }}
        className="hero-cue absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs text-text-muted hover:text-foreground md:flex"
      >
        Scroll
        <ChevronDown size={18} aria-hidden />
      </a>
    </section>
  );
};

export default Hero;
