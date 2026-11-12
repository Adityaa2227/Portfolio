import { useEffect, useState } from 'react';

/**
 * Tiny shared flag for the intro screen. The intro is rendered once at app level;
 * pages (e.g. the home hero) wait for it before starting their own entrance animations.
 */
let done = false;
const listeners = new Set();

export const markIntroDone = () => {
  if (done) return;
  done = true;
  listeners.forEach((fn) => fn());
};

export const useIntroDone = () => {
  const [isDone, setIsDone] = useState(done);
  useEffect(() => {
    if (done) return undefined; // initial state already true
    const fn = () => setIsDone(true);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);
  return isDone;
};
