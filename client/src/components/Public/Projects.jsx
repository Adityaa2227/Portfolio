import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ExternalLink, Github, ArrowRight } from 'lucide-react';
import Section, { SectionHeading } from './Section';
import { gsap } from '../../lib/motion';
import { FALLBACK_IMAGE, isRealLink, slugOf } from '../../lib/projects';

const wrap = (n, len) => {
  let o = n;
  if (o > len / 2) o -= len;
  if (o < -len / 2) o += len;
  return o;
};

const Card = ({ project, active }) => (
  <article className="tilt-card h-full overflow-hidden rounded-3xl glass-strong shadow-[0_30px_80px_-30px_rgb(var(--c-accent)/0.6)]">
    <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-surface-muted">
      <img
        src={project.projectImage || FALLBACK_IMAGE}
        alt=""
        loading="lazy"
        draggable={false}
        className="h-full w-full object-cover object-top"
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent" />
    </div>
    <div className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">{project.title}</h3>
        <div className="flex shrink-0 gap-1.5">
          {isRealLink(project.githubLink) && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={active ? 0 : -1}
              aria-label={`${project.title} source code`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-accent/15 hover:text-foreground"
            >
              <Github size={17} aria-hidden />
            </a>
          )}
          {isRealLink(project.liveLink) && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={active ? 0 : -1}
              aria-label={`${project.title} live site`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-accent/15 hover:text-foreground"
            >
              <ExternalLink size={17} aria-hidden />
            </a>
          )}
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-muted">{project.shortDescription || project.description}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <ul className="flex flex-wrap gap-1.5">
          {(project.technologies || []).slice(0, 4).map((t) => (
            <li key={t} className="rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent-dark">{t}</li>
          ))}
        </ul>
        <Link
          to={`/projects/${slugOf(project)}`}
          tabIndex={active ? 0 : -1}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-foreground hover:text-accent-dark"
        >
          Details <ArrowRight size={14} aria-hidden />
        </Link>
      </div>
    </div>
  </article>
);

export const Projects = ({ projects = [] }) => {
  const published = projects.filter((p) => p.isPublished !== false);
  const featured = published.filter((p) => p.isFeatured);
  // Homepage shows exactly the projects starred (Featured) in Admin -> Projects, in that order.
  // With nothing starred, it falls back to the first 5.
  const list = featured.length > 0 ? featured : published.slice(0, 5);
  const [index, setIndex] = useState(0);
  const stage = useRef(null);
  const drag = useRef(null);
  const dragged = useRef(false); // true right after a swipe, so it isn't treated as a click
  const navigate = useNavigate();

  const go = useCallback((dir) => setIndex((i) => (i + dir + list.length) % list.length), [list.length]);

  // Position every card around the active one (coverflow).
  useLayoutEffect(() => {
    const cards = stage.current?.querySelectorAll('.cf-card');
    if (!cards) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const narrow = window.innerWidth < 640;
    cards.forEach((card, i) => {
      const o = wrap(i - index, list.length);
      const a = Math.abs(o);
      gsap.to(card, {
        xPercent: -50 + o * (narrow ? 88 : 62),
        rotateY: o * -32,
        z: -a * 140,
        scale: 1 - a * 0.12,
        autoAlpha: a > 2 ? 0 : 1 - a * 0.35,
        zIndex: 10 - a,
        duration: reduce ? 0 : 0.8,
        ease: 'power3.out',
      });
      card.dataset.active = o === 0 ? 'true' : 'false';
      card.setAttribute('aria-hidden', o === 0 ? 'false' : 'true');
    });
  }, [index, list.length]);

  // 3D tilt on the active card
  useEffect(() => {
    const el = stage.current;
    if (!el || !window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return undefined;
    const move = (e) => {
      const card = el.querySelector('.cf-card[data-active="true"] .tilt-card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      const inside = e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
      const x = inside ? (e.clientX - r.left) / r.width - 0.5 : 0;
      const y = inside ? (e.clientY - r.top) / r.height - 0.5 : 0;
      gsap.to(card, { rotateY: x * 10, rotateX: -y * 10, duration: 0.5, ease: 'power3.out', transformPerspective: 900 });
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', move);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', move); };
  }, []);

  const onPointerDown = (e) => { drag.current = e.clientX; dragged.current = false; };
  const onPointerUp = (e) => {
    if (drag.current === null) return;
    const dx = e.clientX - drag.current;
    drag.current = null;
    dragged.current = Math.abs(dx) > 8;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  if (!list.length) return null;

  return (
    <Section id="projects" className="overflow-hidden">
      <SectionHeading center eyebrow="Featured projects" title="Some Things I've Built" />

      <div
        className="relative mt-14"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(1);
          if (e.key === 'ArrowLeft') go(-1);
        }}
      >
        <div
          ref={stage}
          className="relative mx-auto h-[470px] sm:h-[520px] touch-pan-y select-none"
          style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { drag.current = null; }}
        >
          {list.map((p, i) => (
            <div
              key={p._id || p.title}
              className="cf-card absolute left-1/2 top-0 w-[84vw] max-w-[540px]"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${list.length}: ${p.title}`}
              onClick={(e) => {
                if (dragged.current) return;
                if (i !== index) { setIndex(i); return; } // side card: bring it to the front
                if (e.target.closest('a, button')) return; // its own links handle themselves
                navigate(`/projects/${slugOf(p)}`); // front card: open the project
              }}
              style={{ transformStyle: 'preserve-3d', cursor: 'pointer' }}
            >
              <Card project={p} active={i === index} />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="absolute left-0 top-[38%] z-20 inline-flex h-12 w-12 items-center justify-center rounded-full glass-strong text-foreground transition hover:border-accent hover:glow sm:left-4"
        >
          <ChevronLeft size={20} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className="absolute right-0 top-[38%] z-20 inline-flex h-12 w-12 items-center justify-center rounded-full glass-strong text-foreground transition hover:border-accent hover:glow sm:right-4"
        >
          <ChevronRight size={20} aria-hidden />
        </button>

        <div className="mt-2 flex justify-center gap-2" role="tablist" aria-label="Choose project">
          {list.map((p, i) => (
            <button
              key={p.title}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={p.title}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-7 bg-accent' : 'w-2 bg-border-strong hover:bg-text-subtle'}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link to="/projects" className="btn-outline">
          View all {published.length} projects <ArrowRight size={15} aria-hidden />
        </Link>
      </div>
    </Section>
  );
};

export default Projects;
