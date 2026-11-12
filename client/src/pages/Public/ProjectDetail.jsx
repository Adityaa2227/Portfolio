import React, { Suspense, lazy, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Github, Globe, Info, Layers3, MonitorPlay, PlayCircle,
  Sparkles, Tag, Radio, TrendingUp, Star, Target, Lightbulb, Code2,
} from 'lucide-react';
import Navbar from '../../components/Public/Navbar';
import Footer from '../../components/Public/Footer';
import LaptopMockup from '../../components/Common/LaptopMockup';
import usePortfolioData from '../../hooks/usePortfolioData';
import { gsap, useSiteMotion } from '../../lib/motion';
import { startSmoothScroll } from '../../lib/smooth';
import { FALLBACK_IMAGE, isRealLink, metricsOf, slugOf } from '../../lib/projects';
import { ProjectIconTile, techIcon } from '../../lib/projectMeta';
import { usePageMeta } from '../../lib/pageMeta';

const Starfield = lazy(() => import('../../components/Common/Starfield'));

const youtubeEmbed = (url) => {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
};

const SectionTitle = ({ Icon, children }) => (
  <h2 className="flex items-center gap-2.5 font-heading text-xl font-bold text-foreground">
    <Icon size={20} className="text-accent-dark drop-shadow-[0_0_10px_rgb(var(--c-accent))]" aria-hidden />
    {children}
  </h2>
);

/** Screenshot / video carousel. Arrows and dots appear only with more than one slide. */
const Gallery = ({ slides, title }) => {
  const [i, setI] = useState(0);
  const frame = useRef(null);
  const go = (d) => setI((v) => (v + d + slides.length) % slides.length);

  useLayoutEffect(() => {
    if (!frame.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(frame.current, { autoAlpha: 0.3, scale: 0.98 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
  }, [i]);

  const s = slides[i];
  return (
    <div data-reveal="rise">
      <div className="relative">
        <div ref={frame} className="overflow-hidden rounded-2xl border border-border-strong bg-background shadow-[0_30px_80px_-30px_rgb(var(--c-accent)/0.7)]">
          {s.type === 'video' ? (
            <div className="aspect-video">
              <iframe
                src={s.src}
                title={`${title} demo video`}
                className="h-full w-full"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : (
            <img src={s.src} alt={`${title} screenshot`} className="aspect-video w-full object-cover object-top" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }} />
          )}
        </div>
        {slides.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="absolute -left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full glass-strong hover:border-accent hover:glow">
              <ChevronLeft size={19} aria-hidden />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next slide" className="absolute -right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full glass-strong hover:border-accent hover:glow">
              <ChevronRight size={19} aria-hidden />
            </button>
          </>
        )}
      </div>
      {slides.length > 1 && (
        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Choose slide">
          {slides.map((sl, n) => (
            <button
              key={sl.src}
              type="button"
              role="tab"
              aria-selected={n === i}
              aria-label={sl.type === 'video' ? 'Demo video' : `Screenshot ${n + 1}`}
              onClick={() => setI(n)}
              className={`h-2 rounded-full transition-all ${n === i ? 'w-7 bg-accent' : 'w-2 bg-border-strong hover:bg-text-subtle'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ProjectDetail = () => {
  const { slug } = useParams();
  const { projects } = usePortfolioData();
  const scope = useRef(null);

  const published = useMemo(() => projects.filter((p) => p.isPublished !== false), [projects]);
  const project = published.find((p) => slugOf(p) === slug || p._id === slug);

  usePageMeta({
    title: project ? project.title : 'Project not found',
    description: project ? (project.shortDescription || project.description) : undefined,
    path: `/projects/${slug}`,
    image: project?.projectImage,
  });

  const related = useMemo(() => {
    if (!project) return [];
    const others = published.filter((p) => p !== project);
    const same = others.filter((p) => p.category === project.category);
    const rest = others.filter((p) => p.category !== project.category).sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured));
    return [...same, ...rest].slice(0, 3);
  }, [published, project]);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  useEffect(() => startSmoothScroll(), []);
  useSiteMotion(scope, [slug]);

  useLayoutEffect(() => {
    if (!scope.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power4.out' } })
          .from('.pd-in', { y: 36, autoAlpha: 0, duration: 0.9, stagger: 0.08 })
          .from('.pd-laptop', { x: 80, rotate: 4, autoAlpha: 0, duration: 1.3, ease: 'expo.out' }, 0.1);
        gsap.to('.pd-laptop', { y: -12, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.4 });
      });
    }, scope);
    return () => ctx.revert();
  }, [slug]);

  if (!project) {
    return (
      <>
        <Suspense fallback={null}><Starfield /></Suspense>
        <Navbar />
        <main className="page-wrap flex min-h-screen flex-col items-start justify-center">
          <h1 className="font-heading text-4xl font-extrabold">This project doesn&rsquo;t exist</h1>
          <p className="mt-3 text-text-muted">There&rsquo;s no project at /projects/{slug}. It may have been renamed.</p>
          <Link to="/projects" className="btn-primary mt-8"><ArrowLeft size={16} aria-hidden /> Back to Projects</Link>
        </main>
      </>
    );
  }

  const metrics = metricsOf(project);
  const live = isRealLink(project.liveLink) ? project.liveLink : null;
  const code = isRealLink(project.githubLink) ? project.githubLink : null;
  const video = youtubeEmbed(project.youtubeVideoUrl);
  const demo = isRealLink(project.youtubeVideoUrl) ? project.youtubeVideoUrl : null;
  const slides = [
    { type: 'image', src: project.projectImage || FALLBACK_IMAGE },
    ...(project.images || []).map((src) => ({ type: 'image', src })),
    ...(video ? [{ type: 'video', src: video }] : []),
  ];

  const info = [
    { Icon: Tag, label: 'Type', value: <span className="rounded-md border border-border-strong px-2.5 py-0.5 text-xs font-semibold text-foreground">{project.category || 'Project'}</span> },
    {
      Icon: Radio,
      label: 'Status',
      value: live
        ? <span className="rounded-md border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">Live</span>
        : <span className="rounded-md border border-border-strong px-2.5 py-0.5 text-xs font-semibold text-text-muted">Source only</span>,
    },
    ...(project.isFeatured ? [{ Icon: Star, label: 'Highlight', value: <span className="text-sm font-semibold text-foreground">Featured</span> }] : []),
    { Icon: Layers3, label: 'Technologies', value: <span className="text-sm font-semibold text-foreground">{(project.technologies || []).length}</span> },
  ];

  return (
    <>
      <Suspense fallback={null}><Starfield /></Suspense>
      <div ref={scope} className="relative min-h-screen overflow-x-clip text-foreground">
        <Navbar />

        <main className="page-wrap relative pt-28 pb-16 sm:pt-32">
          <Link to="/projects" className="pd-in inline-flex items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-foreground">
            <ArrowLeft size={16} aria-hidden /> Back to Projects
          </Link>

          {/* Header */}
          <header className="relative mt-6 grid items-center gap-10 lg:grid-cols-12">
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-[380px] w-[560px] rounded-full bg-accent/20 blur-[130px]" />
            <div className="relative lg:col-span-6">
              <div className="pd-in flex items-center gap-5">
                <ProjectIconTile project={project} slug={slugOf(project)} size="lg" />
                <h1 className="font-heading text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">{project.title}</h1>
              </div>
              <p className="pd-in mt-5 max-w-[52ch] text-base sm:text-lg leading-relaxed text-text-muted">
                {project.shortDescription || project.description}
              </p>
              {/* Each button shows only when its link is set in Admin -> Projects */}
              <div className="pd-in mt-8 flex flex-wrap gap-3">
                {live && (
                  <a href={live} target="_blank" rel="noopener noreferrer" className="btn-primary magnetic">
                    <Globe size={16} aria-hidden /> Visit Site <ArrowUpRight size={15} aria-hidden />
                  </a>
                )}
                {code && (
                  <a href={code} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    <Github size={16} aria-hidden /> Visit GitHub
                  </a>
                )}
                {demo && (
                  <a href={demo} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    <PlayCircle size={16} aria-hidden /> Watch Demo
                  </a>
                )}
                {!live && !code && !demo && <span className="text-sm text-text-subtle">Links for this project aren&rsquo;t public yet.</span>}
              </div>
            </div>
            <div className="relative lg:col-span-6">
              <LaptopMockup image={project.projectImage || FALLBACK_IMAGE} alt="" className="pd-laptop mx-auto w-full max-w-[540px]" />
            </div>
          </header>

          {/* Body */}
          <div className="mt-16 grid gap-10 lg:grid-cols-12">
            <div className="space-y-12 lg:col-span-8">
              <Gallery slides={slides} title={project.title} />

              <section data-reveal="rise">
                <SectionTitle Icon={Info}>Overview</SectionTitle>
                <p className="mt-4 max-w-[70ch] leading-relaxed text-text-muted">{project.description || project.shortDescription}</p>
              </section>

              {(project.features?.length > 0 || project.problem || project.solution) && (
                <div className="grid gap-10 md:grid-cols-2">
                  {project.features?.length > 0 && (
                    <section data-reveal="rise">
                      <SectionTitle Icon={Sparkles}>Key Features</SectionTitle>
                      <ul className="mt-4 space-y-3">
                        {project.features.map((f) => (
                          <li key={f} className="flex gap-3 text-sm leading-relaxed text-text-muted">
                            <Check size={17} className="mt-0.5 shrink-0 text-accent-dark" aria-hidden />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {(project.problem || project.solution) && (
                    <section data-reveal="rise">
                      <SectionTitle Icon={Lightbulb}>Challenge &amp; Approach</SectionTitle>
                      <div className="mt-4 space-y-5">
                        {project.problem && (
                          <div className="flex gap-3">
                            <Target size={17} className="mt-0.5 shrink-0 text-accent-2" aria-hidden />
                            <p className="text-sm leading-relaxed text-text-muted"><span className="font-semibold text-foreground">The problem. </span>{project.problem}</p>
                          </div>
                        )}
                        {project.solution && (
                          <div className="flex gap-3">
                            <Check size={17} className="mt-0.5 shrink-0 text-accent-dark" aria-hidden />
                            <p className="text-sm leading-relaxed text-text-muted"><span className="font-semibold text-foreground">What I built. </span>{project.solution}</p>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5 lg:col-span-4">
              <div className="lg:sticky lg:top-28 space-y-5">
                <section data-reveal="rise" className="rounded-2xl glass p-5">
                  <h2 className="font-heading text-lg font-bold">Project Info</h2>
                  <dl className="mt-4 space-y-3.5">
                    {info.map(({ Icon, label, value }) => (
                      <div key={label} className="flex items-center justify-between gap-4">
                        <dt className="inline-flex items-center gap-2.5 text-sm text-text-muted"><Icon size={15} className="text-accent-dark" aria-hidden /> {label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  {metrics.length > 0 && (
                    <div className="mt-5 border-t border-border pt-4">
                      <p className="inline-flex items-center gap-2 text-sm text-text-muted"><TrendingUp size={15} className="text-emerald-400" aria-hidden /> Impact</p>
                      <ul className="mt-2.5 space-y-2">
                        {metrics.map((m) => (
                          <li key={m} className="rounded-lg border border-border bg-background/40 px-3 py-2 text-sm font-medium text-foreground">{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>

                {project.technologies?.length > 0 && (
                  <section data-reveal="rise" className="rounded-2xl glass p-5">
                    <h2 className="inline-flex items-center gap-2 font-heading text-lg font-bold">
                      <Code2 size={18} className="text-accent-dark" aria-hidden /> Tech Stack
                    </h2>
                    <ul data-reveal="pop" className="mt-4 grid grid-cols-3 gap-2.5">
                      {project.technologies.map((t) => {
                        const ic = techIcon(t);
                        return (
                          <li key={t} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background/40 px-2 py-3 text-center transition-colors hover:border-accent/60">
                            {ic ? (
                              <ic.Icon size={24} style={{ color: ic.color }} aria-hidden />
                            ) : (
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent/20 text-[11px] font-bold text-accent-dark" aria-hidden>{t[0]}</span>
                            )}
                            <span className="text-[11px] leading-tight text-text-muted">{t}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}
              </div>
            </aside>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-20">
              <h2 className="flex items-center gap-2.5 font-heading text-xl font-bold">
                <Sparkles size={20} className="text-accent-dark" aria-hidden /> More Projects You Might Like
              </h2>
              <ul data-reveal="pop" className="mt-5 grid gap-4 md:grid-cols-3">
                {related.map((p) => (
                  <li key={p._id || p.title}>
                    <Link to={`/projects/${slugOf(p)}`} className="group flex items-center gap-4 rounded-2xl glass p-4 transition-[border-color,box-shadow] hover:border-accent/70 hover:glow">
                      <ProjectIconTile project={p} slug={slugOf(p)} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-foreground">{p.title}</span>
                        <span className="block truncate text-xs text-text-muted">{p.category}</span>
                      </span>
                      <ArrowRight size={17} className="text-text-muted transition-transform group-hover:translate-x-1 group-hover:text-foreground" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProjectDetail;
