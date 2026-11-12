import React from 'react';
import { SplitWords } from '../../lib/motion';

/** Section heading: small violet label above a reveal-on-scroll title. */
export const SectionHeading = ({ eyebrow, title, intro, center = false, className = '' }) => (
  <div className={`${center ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2
      data-reveal="words"
      className="mt-3 font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.15] tracking-tight text-foreground"
    >
      <SplitWords text={title} />
    </h2>
    {intro && <p className="mt-4 text-base sm:text-lg leading-relaxed text-text-muted">{intro}</p>}
  </div>
);

export const Section = ({ id, className = '', children }) => (
  <section id={id} className={`relative py-24 sm:py-32 ${className}`}>
    <div className="page-wrap">{children}</div>
  </section>
);

export default Section;
