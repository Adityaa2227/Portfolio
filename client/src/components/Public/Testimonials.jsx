import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, PenLine, Quote, Star } from 'lucide-react';
import Section, { SectionHeading } from './Section';
import ReviewForm from './ReviewForm';
import { gsap } from '../../lib/motion';
import api from '../../api/axios';
import data from '../../data/testimonials.json';

const initials = (name) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export const Testimonials = () => {
  const [items, setItems] = useState(() => data.filter((t) => t.isApproved !== false));
  const [formOpen, setFormOpen] = useState(false);

  // Approved reviews from the backend (new submissions only appear after admin approval).
  useEffect(() => {
    api.get('/testimonials', { timeout: 15000 })
      .then(({ data: remote }) => {
        if (!Array.isArray(remote)) return;
        setItems((current) => {
          const seen = new Set(current.map((t) => t._id));
          const fresh = remote.filter((t) => t.isApproved && !seen.has(t._id));
          return fresh.length ? [...fresh, ...current] : current;
        });
      })
      .catch(() => { /* keep the bundled reviews */ });
  }, []);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const card = useRef(null);
  const dir = useRef(1);

  const go = useCallback((d) => {
    dir.current = d;
    setIndex((i) => (i + d + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (paused || items.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [paused, go, items.length]);

  useLayoutEffect(() => {
    if (!card.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(
      card.current,
      { autoAlpha: 0, x: 60 * dir.current, rotateY: 8 * dir.current },
      { autoAlpha: 1, x: 0, rotateY: 0, duration: 0.7, ease: 'power3.out' }
    );
  }, [index]);

  if (!items.length) return null;
  const t = items[index] || items[0];

  return (
    <Section id="reviews">
      <SectionHeading center eyebrow="Reviews" title="What People Say" />

      <div
        className="relative mx-auto mt-12 max-w-3xl px-14"
        role="region"
        aria-roledescription="carousel"
        aria-label="Testimonials"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div style={{ perspective: '1000px' }}>
          <figure ref={card} aria-live="polite" className="glass-strong relative rounded-3xl p-7 sm:p-10">
            <Quote size={40} className="text-accent-dark drop-shadow-[0_0_12px_rgb(var(--c-accent))]" aria-hidden />
            <blockquote className="mt-4 text-base sm:text-lg leading-relaxed text-foreground">
              &ldquo;{t.message}&rdquo;
            </blockquote>
            <figcaption className="mt-7 flex items-center gap-4">
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, rgb(var(--c-accent)), rgb(var(--c-accent-2)))' }}
                aria-hidden
              >
                {initials(t.name)}
              </span>
              <span className="flex-1">
                <span className="block font-semibold text-foreground">{t.name}</span>
                <span className="block text-sm text-text-muted">{t.role}</span>
              </span>
              <span className="flex gap-0.5" role="img" aria-label={`${t.rating || 5} out of 5 stars`}>
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" aria-hidden />
                ))}
              </span>
            </figcaption>
          </figure>
        </div>

        <button type="button" onClick={() => go(-1)} aria-label="Previous review" className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full glass-strong hover:border-accent hover:glow">
          <ChevronLeft size={19} aria-hidden />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next review" className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full glass-strong hover:border-accent hover:glow">
          <ChevronRight size={19} aria-hidden />
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <div className="flex gap-2" role="tablist" aria-label="Choose review">
          {items.map((it, i) => (
            <button
              key={it._id || it.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Review from ${it.name}`}
              onClick={() => { dir.current = i > index ? 1 : -1; setIndex(i); }}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-7 bg-accent' : 'w-2 bg-border-strong hover:bg-text-subtle'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-accent-dark"
        >
          <PenLine size={14} aria-hidden /> Write a review
        </button>
      </div>
      <ReviewForm open={formOpen} onClose={() => setFormOpen(false)} />
    </Section>
  );
};

export default Testimonials;
