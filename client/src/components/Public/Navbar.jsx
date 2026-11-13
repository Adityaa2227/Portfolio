import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Download, Menu, X } from 'lucide-react';
import Logo from '../Common/Logo';
import { gsap, ScrollTrigger } from '../../lib/motion';
import { scrollToId, stopScroll, resumeScroll } from '../../lib/smooth';

export const NAV = [
  { name: 'Home', to: 'home' },
  { name: 'About', to: 'about' },
  { name: 'Projects', to: 'projects' },
  { name: 'Experience', to: 'experience' },
  { name: 'Reviews', to: 'reviews' },
  { name: 'Blog', to: 'blog', route: '/blog' },
  { name: 'Contact', to: 'contact' },
];

export const Navbar = ({ activeResumeUrl = '/resume.pdf' }) => {
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const bar = useRef(null);
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const current = isHome ? active : pathname.startsWith('/projects') ? 'projects' : pathname.startsWith('/blog') ? 'blog' : null;
  const navigate = useNavigate();

  // Hide on scroll down, show on scroll up; track which section is in view.
  useEffect(() => {
    if (!isHome) return undefined;
    const show = gsap.quickTo(bar.current, 'yPercent', { duration: 0.35, ease: 'power3.out' });
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        setScrolled(self.scroll() > 40);
        show(self.direction === 1 && self.scroll() > 400 ? -130 : 0);
      },
    });
    const sections = NAV.filter((n) => !n.route).map(({ to }) =>
      ScrollTrigger.create({
        trigger: `#${to}`,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => self.isActive && setActive(to),
      })
    );
    return () => { st.kill(); sections.forEach((s) => s.kill()); };
  }, [isHome]);

  useEffect(() => {
    if (open) stopScroll(); else resumeScroll();
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (to) => (e) => {
    e.preventDefault();
    setOpen(false);
    const item = NAV.find((n) => n.to === to);
    if (item?.route) navigate(item.route);
    else if (isHome) scrollToId(to);
    else navigate(`/#${to}`);
  };
  const hrefOf = (item) => item.route || `#${item.to}`;

  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <div
          className={`mx-auto flex max-w-page items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-[background-color,border-color,box-shadow] duration-300 sm:px-5 ${
            scrolled || open || !isHome ? 'glass-strong shadow-[0_10px_40px_-15px_rgb(0_0_0/0.6)]' : 'border border-transparent'
          }`}
        >
          <RouterLink to="/" onClick={(e) => { if (isHome) go('home')(e); }} aria-label="Aditya Agarwal, home" className="px-1">
            <Logo className="text-[1.7rem]" />
          </RouterLink>

          <nav aria-label="Sections" className="hidden lg:flex items-center gap-1">
            {NAV.map(({ name, to, route }) => (
              <a
                key={to}
                href={hrefOf({ to, route })}
                onClick={go(to)}
                aria-current={current === to ? 'true' : undefined}
                className={`relative px-3.5 py-2 text-sm font-medium transition-colors ${
                  current === to ? 'text-accent-dark' : 'text-text-muted hover:text-foreground'
                }`}
              >
                {name}
                <span
                  aria-hidden
                  className={`absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-accent transition-transform duration-300 origin-center ${
                    current === to ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={activeResumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-accent/70 bg-accent/10 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent/25"
            >
              Resume <Download size={14} aria-hidden />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div id="mobile-nav" className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-28 lg:hidden">
          <nav aria-label="Sections" className="page-wrap flex flex-col">
            {NAV.map(({ name, to, route }) => (
              <a
                key={to}
                href={hrefOf({ to, route })}
                onClick={go(to)}
                className={`border-b border-border py-4 font-heading text-3xl font-bold ${current === to ? 'text-gradient' : 'text-foreground'}`}
              >
                {name}
              </a>
            ))}
            <a href={activeResumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">
              Download resume <Download size={15} aria-hidden />
            </a>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
