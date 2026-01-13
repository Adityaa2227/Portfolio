import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useScrollAnimations = () => {
  useEffect(() => {
    // Global Settings
    ScrollTrigger.defaults({
      markers: false, // Set to true for debugging
    });
  }, []);

  // 1) GLOBAL SECTION REVEAL
  // Bottom -> Top, 100px, 1.2s, power3.out
  const revealSection = (element) => {
    if (!element) return;
    
    gsap.fromTo(
      element,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out', // More dramatic ease
        scrollTrigger: {
          trigger: element,
          start: 'top 80%', // Trigger sooner
          toggleActions: 'play none none reverse', // Reverse on scroll back up for "feel"
        },
      }
    );
  };

  // 2) TEXT REVEAL (Headings)
  // Subtly rise + fade in
  const revealText = (element, delay = 0) => {
    if (!element) return;
    
    gsap.fromTo(
      element,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  };

  // 3) STAGGERED ITEMS (Cards, Lists)
  // Parent is trigger, children stagger
  const revealStagger = (items, triggerElement, delay = 0) => {
    if (!items || items.length === 0) return;
    
    gsap.fromTo(
      items,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: triggerElement || items[0],
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  };

  return {
    revealSection,
    revealText,
    revealStagger
  };
};

export default useScrollAnimations;
