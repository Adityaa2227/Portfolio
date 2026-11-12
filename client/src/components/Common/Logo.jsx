import React from 'react';

/** "AA" monogram: white first A, violet second A, soft glow. */
export const Logo = ({ className = 'text-2xl' }) => (
  <span
    className={`font-heading font-extrabold italic leading-none tracking-[-0.12em] select-none ${className}`}
    style={{ textShadow: '0 0 18px rgb(var(--c-accent) / 0.65)' }}
    aria-hidden
  >
    <span className="text-foreground">A</span>
    <span className="text-accent-dark">A</span>
  </span>
);

export default Logo;
