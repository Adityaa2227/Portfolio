import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './motion';

let lenis = null;

/** Starts Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export const startSmoothScroll = () => {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  };
};

export const stopScroll = () => lenis?.stop();
export const resumeScroll = () => lenis?.start();

/** Scrolls to a section id (or 0 for top) with the navbar offset. */
export const scrollToId = (id) => {
  const offset = -72;
  if (id === 0 || id === 'top') {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' });
};
