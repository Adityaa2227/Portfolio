import React, { Suspense, lazy, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flip } from 'gsap/Flip';
import { ExternalLink, Rocket, Search, X } from 'lucide-react';
import Navbar from '../../components/Public/Navbar';
import Footer from '../../components/Public/Footer';
import LaptopMockup from '../../components/Common/LaptopMockup';
import usePortfolioData from '../../hooks/usePortfolioData';
import { gsap, useSiteMotion } from '../../lib/motion';
import { startSmoothScroll } from '../../lib/smooth';
import { FALLBACK_IMAGE, isRealLink, slugOf } from '../../lib/projects';
import { ProjectIconTile } from '../../lib/projectMeta';
import { usePageMeta } from '../../lib/pageMeta';

gsap.registerPlugin(Flip);

const Starfield = lazy(() => import('../../components/Common/Starfield'));

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const slug = slugOf(project);
  const external = isRealLink(project.liveLink) ? project.liveLink : null;

  return (
    <article
      onClick={(e) => { if (!e.target.closest('a')) navigate(`/projects/${slug}`); }}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl glass transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-accent/70 hover:shadow-[0_24px_60px_-24px_rgb(var(--c-accent)/0.8)]"
    >
      {/* Framed screenshot */}
      <div className="relative px-6 pt-8 pb-4" style={{ background: 'radial-gradient(80% 90% at 50% 100%, rgb(var(--c-accent) / 0.28), transparent 70%)' }}>
        {project.isFeatured && (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-[#7C3AED] px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_6px_20px_-6px_rgb(var(--c-accent))]">
            Featured
          </span>
        )}
        <a
          href={external || `/projects/${slug}`}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          onClick={(e) => { if (!external) { e.preventDefault(); navigate(`/projects/${slug}`); } }}
          aria-label={external ? `Open ${project.title} live site` : `Open ${project.title}`}
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-accent/20 hover:text-foreground"
        >
          <ExternalLink size={16} aria-hidden />
        </a>
        <div className="mx-auto aspect-[16/10] w-[88%] overflow-hidden rounded-lg border border-border-strong bg-background shadow-[0_18px_40px_-18px_rgb(0_0_0/0.9)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.03]">
          <img
            src={project.projectImage || FALLBACK_IMAGE}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-top"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <div className="flex items-center gap-3">
          <ProjectIconTile project={project} slug={slug} />
          <h2 className="font-heading text-lg font-bold text-foreground">
            <Link to={`/projects/${slug}`} className="hover:text-accent-dark focus-visible:underline">{project.title}</Link>
          </h2>
        </div>
        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-text-muted">{project.shortDescription || project.description}</p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {(project.technologies || []).slice(0, 3).map((t) => (
            <li key={t} className="rounded-md border border-border bg-surface-muted/80 px-2.5 py-1 text-xs font-medium text-foreground">{t}</li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export const AllProjects = () => {
  const { projects } = usePortfolioData();
  usePageMeta({ title: 'Projects', description: 'Projects by Aditya Agarwal: full-stack apps, backend systems, GenAI tools and more, with case studies, tech stacks and links.', path: '/projects' });
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const scope = useRef(null);
  const grid = useRef(null);
  const flipState = useRef(null);

  const published = useMemo(
    () => projects.filter((p) => p.isPublished !== false).sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured) || (a.order ?? 99) - (b.order ?? 99)),
    [projects]
  );

  const categories = useMemo(() => {
    const counts = published.reduce((m, p) => m.set(p.category || 'Other', (m.get(p.category || 'Other') || 0) + 1), new Map());
    return [['All', published.length], ...counts.entries()];
  }, [published]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return published
      .filter((p) => category === 'All' || (p.category || 'Other') === category)
      .filter((p) => !q || [p.title, p.description, p.shortDescription, ...(p.technologies || [])].some((s) => s?.toLowerCase().includes(q)));
  }, [published, category, query]);

  const withFlip = (fn) => (...args) => {
    if (grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll('.flip-item'));
    fn(...args);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state || !grid.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    Flip.from(state, {
      targets: grid.current.querySelectorAll('.flip-item'),
      duration: 0.6,
      ease: 'power3.inOut',
      absolute: true,
      stagger: 0.02,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }),
    });
  }, [filtered]);

  // Page-load sequence: heading, laptop, filters, then cards
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power4.out' } })
          .from('.pp-in', { y: 40, autoAlpha: 0, duration: 0.9, stagger: 0.08 })
          .from('.pp-laptop', { y: 60, rotate: 6, autoAlpha: 0, duration: 1.3, ease: 'expo.out' }, 0.1)
          .from('.flip-item', { y: 50, autoAlpha: 0, duration: 0.8, stagger: 0.06 }, 0.45);
        gsap.to('.pp-laptop', { y: -14, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.4 });
      });
    }, scope);
    return () => ctx.revert();
  }, []);

  useEffect(() => { window.scrollTo(0, 0); return startSmoothScroll(); }, []);
  useSiteMotion(scope, []);

  const clear = withFlip(() => { setCategory('All'); setQuery(''); });

  return (
    <>
      <Suspense fallback={null}><Starfield /></Suspense>
      <div ref={scope} className="relative min-h-screen overflow-x-clip text-foreground">
        <Navbar />

        <main className="page-wrap relative pt-32 pb-20 sm:pt-36">
          {/* Header */}
          <header className="relative grid items-center gap-10 lg:grid-cols-12">
            <div aria-hidden className="pointer-events-none absolute -right-20 top-0 h-[420px] w-[620px] rounded-full bg-accent/20 blur-[130px]" />
            <div className="relative lg:col-span-6">
              <h1 className="pp-in font-heading text-5xl sm:text-7xl font-extrabold italic leading-[1.05] tracking-tight">
                <span className="text-foreground">My </span>
                <span className="text-gradient pr-2">Projects</span>
              </h1>
              <p className="pp-in mt-6 max-w-[48ch] text-base sm:text-lg leading-relaxed text-text-muted">
                A collection of real-world projects I&rsquo;ve built, from full-stack applications to innovative tools,
                solving practical problems.
              </p>
            </div>
            <div className="relative lg:col-span-6">
              <LaptopMockup className="pp-laptop mx-auto w-full max-w-[460px]" />
            </div>
          </header>

          {/* Filters */}
          <div className="pp-in mt-14 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div role="group" aria-label="Filter by category" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible md:pb-0">
              {categories.map(([cat, n]) => (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={category === cat}
                  onClick={withFlip(() => setCategory(cat))}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    category === cat
                      ? 'border-accent bg-[#7C3AED] text-white shadow-[0_8px_24px_-8px_rgb(var(--c-accent))]'
                      : 'border-border bg-surface/60 text-text-muted hover:border-accent/60 hover:text-foreground'
                  }`}
                >
                  {cat} ({n})
                </button>
              ))}
            </div>
            <label className="relative block md:w-64 shrink-0">
              <span className="sr-only">Search projects</span>
              <input
                type="search"
                value={query}
                onChange={withFlip((e) => setQuery(e.target.value))}
                placeholder="Search projects..."
                className="w-full rounded-full border border-border bg-surface/60 py-2.5 pl-4 pr-10 text-sm text-foreground placeholder:text-text-subtle"
              />
              <Search size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle" aria-hidden />
            </label>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <ul ref={grid} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <li key={p._id || p.title} className="flip-item" data-flip-id={p._id || p.title}>
                  <ProjectCard project={p} />
                </li>
              ))}
            </ul>
          ) : (
            <div ref={grid} className="mt-8 rounded-2xl glass p-10 text-center">
              <p className="font-heading text-xl font-bold">No projects match &ldquo;{query}&rdquo;</p>
              <p className="mt-2 text-text-muted">Try another word, or show every project.</p>
              <button type="button" onClick={clear} className="btn-primary mt-6"><X size={15} aria-hidden /> Show all projects</button>
            </div>
          )}

          {/* Coming soon */}
          <section data-reveal="rise" className="relative mt-12 overflow-hidden rounded-2xl glass-strong">
            <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(50% 120% at 85% 100%, rgb(var(--c-accent) / 0.45), transparent 70%)' }} />
            <svg aria-hidden viewBox="0 0 600 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-16 w-full">
              <path d="M0 90 L80 60 L150 85 L240 40 L330 80 L420 50 L510 85 L600 55 V120 H0Z" fill="rgb(var(--c-surface-muted))" opacity="0.8" />
            </svg>
            <div className="relative flex items-center gap-5 p-7 sm:p-9">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent-dark">
                <Rocket size={30} className="drop-shadow-[0_0_12px_rgb(var(--c-accent))]" aria-hidden />
              </span>
              <div className="flex-1">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">More Projects Coming Soon&hellip;</h2>
                <p className="mt-1 text-sm sm:text-base text-text-muted">I&rsquo;m constantly building new things. Stay tuned!</p>
              </div>
              <a href="https://github.com/Adityaa2227" target="_blank" rel="noopener noreferrer" className="btn-outline hidden sm:inline-flex">
                Follow on GitHub
              </a>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AllProjects;
