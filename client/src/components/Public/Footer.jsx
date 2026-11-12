import React from 'react';
import Logo from '../Common/Logo';
import { SOCIALS } from './Hero';

export const Footer = () => (
  <footer className="relative mt-10 overflow-hidden pt-20 pb-10">
    <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(60% 80% at 50% 100%, rgb(var(--c-accent) / 0.28), transparent 70%)' }} />
    <svg aria-hidden viewBox="0 0 1440 200" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-40 w-full">
      <path d="M0 140 L120 90 L230 130 L360 60 L480 120 L600 80 L720 130 L860 50 L980 120 L1100 70 L1240 130 L1340 90 L1440 120 V200 H0Z" fill="rgb(var(--c-surface-muted))" opacity="0.7" />
      <path d="M0 170 L160 120 L300 160 L420 110 L560 165 L700 120 L860 170 L1000 115 L1160 165 L1300 125 L1440 160 V200 H0Z" fill="rgb(var(--c-background))" />
    </svg>

    <div className="page-wrap relative flex flex-col items-center text-center">
      <Logo className="text-5xl" />
      <p className="mt-4 font-heading text-lg font-semibold text-foreground">Aditya Agarwal</p>
      <p className="mt-1 text-sm text-text-muted">Developer &middot; Builder &middot; Problem Solver</p>
      <ul className="mt-6 flex gap-3">
        {SOCIALS.map(({ label, href, Icon }) => (
          <li key={label}>
            <a
              href={href}
              {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              aria-label={label}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full glass text-text-muted transition hover:border-accent hover:text-foreground hover:glow"
            >
              <Icon size={17} aria-hidden />
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-16 text-xs text-text-subtle">&copy; {new Date().getFullYear()} Aditya Agarwal. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
