import React, { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/** Renders text as masked words so GSAP can lift each one into view. */
export const SplitWords = ({ text }) =>
  text.split(' ').map((word, i, arr) => (
    <React.Fragment key={i}>
      <span className="w inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
        <span className="inline-block will-change-transform">{word}</span>
      </span>
      {i < arr.length - 1 ? ' ' : null}
    </React.Fragment>
  ));

/**
 * Wires up the few scroll effects the site uses, scoped to `scopeRef`:
 *  [data-reveal="words"]  heading words rise from a mask
 *  [data-reveal="clip"]   media unfolds from an inset clip
 *  [data-progress]        hairline that scrubs with page scroll
 *  .magnetic              element drifts toward the pointer
 */
export const useSiteMotion = (scopeRef, deps = []) => {
  useLayoutEffect(() => {
    if (!scopeRef.current) return undefined;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.utils.toArray('[data-reveal="words"]').forEach((el) => {
          gsap.from(el.querySelectorAll('.w > span'), {
            yPercent: 115,
            duration: 0.9,
            ease: 'power4.out',
            stagger: 0.035,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });

        gsap.utils.toArray('[data-reveal="clip"]').forEach((el) => {
          const img = el.querySelector('img');
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
          tl.fromTo(
            el,
            { clipPath: 'inset(14% 8% 14% 8% round 14px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 8px)', duration: 1.2, ease: 'power3.inOut' }
          );
          if (img) tl.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.4, ease: 'power3.out' }, 0);
        });

        // Fade-up reveal, batched so items entering together stagger
        ScrollTrigger.batch('[data-reveal="rise"]', {
          start: 'top 88%',
          once: true,
          onEnter: (els) => gsap.fromTo(els, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1 }),
        });

        // Staggered pop-in of a grid's children
        gsap.utils.toArray('[data-reveal="pop"]').forEach((grid) => {
          const kids = Array.from(grid.children);
          gsap.set(kids, { scale: 0.6, autoAlpha: 0, y: 20 });
          ScrollTrigger.create({
            trigger: grid,
            start: 'top 88%',
            once: true,
            onEnter: () => gsap.to(kids, { scale: 1, autoAlpha: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.04, clearProps: 'transform' }),
          });
        });

        // Layout shifts once web fonts arrive; recompute trigger positions.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        // Count-up numbers
        gsap.utils.toArray('[data-count]').forEach((el) => {
          const end = parseFloat(el.dataset.count);
          const decimals = parseInt(el.dataset.decimals || '0', 10);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: end,
            duration: 1.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => { el.textContent = obj.v.toFixed(decimals); },
          });
        });

        // Image parallax inside a clipped frame
        gsap.utils.toArray('[data-parallax]').forEach((el) => {
          gsap.fromTo(el, { yPercent: -8 }, {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });

        // Timeline line draws as it scrolls through
        gsap.utils.toArray('[data-draw]').forEach((el) => {
          gsap.fromTo(el, { scaleY: 0 }, {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top 75%', end: 'bottom 60%', scrub: 0.5 },
          });
        });

        // Gentle float for decorative elements
        gsap.utils.toArray('[data-float]').forEach((el, i) => {
          gsap.to(el, { y: -10, duration: 3 + i, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        });

        gsap.utils.toArray('[data-progress]').forEach((bar) => {
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: { trigger: document.documentElement, start: 0, end: 'max', scrub: 0.3 },
            }
          );
        });
      });

      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const cleanups = gsap.utils.toArray('.magnetic').map((el) => {
          const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
          const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
          const move = (e) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
          };
          const leave = () => { xTo(0); yTo(0); };
          el.addEventListener('pointermove', move);
          el.addEventListener('pointerleave', leave);
          return () => {
            el.removeEventListener('pointermove', move);
            el.removeEventListener('pointerleave', leave);
          };
        });
        // Hover tilt for tiles (.tilt > .tilt-inner)
        gsap.utils.toArray('.tilt').forEach((el) => {
          const inner = el.querySelector('.tilt-inner');
          if (!inner) return;
          const move = (e) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(inner, { rotateY: x * 18, rotateX: -y * 18, scale: 1.06, duration: 0.4, ease: 'power3.out', transformPerspective: 600 });
          };
          const leave = () => gsap.to(inner, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: 'power3.out' });
          el.addEventListener('pointermove', move);
          el.addEventListener('pointerleave', leave);
          cleanups.push(() => {
            el.removeEventListener('pointermove', move);
            el.removeEventListener('pointerleave', leave);
          });
        });
        return () => cleanups.forEach((fn) => fn());
      });
    }, scopeRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
