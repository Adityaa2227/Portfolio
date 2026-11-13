import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Loader2, NotebookPen, Search } from 'lucide-react';
import Navbar from '../../components/Public/Navbar';
import Footer from '../../components/Public/Footer';
import { getWithWakeup } from '../../api/axios';
import { useSiteMotion } from '../../lib/motion';
import { startSmoothScroll } from '../../lib/smooth';
import { usePageMeta } from '../../lib/pageMeta';

const Starfield = lazy(() => import('../../components/Common/Starfield'));

export const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

const Blog = () => {
  const scope = useRef(null);
  const [posts, setPosts] = useState(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0); // bumped by "Try again"
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('');

  usePageMeta({ title: 'Blog', description: 'Notes by Aditya Agarwal on backend engineering, system design, testing, GenAI and the projects he builds.', path: '/blog' });

  useEffect(() => { window.scrollTo(0, 0); return startSmoothScroll(); }, []);
  useEffect(() => {
    let alive = true;
    getWithWakeup('/posts')
      .then(({ data }) => { if (alive) { setPosts(Array.isArray(data) ? data : []); setFailed(false); } })
      .catch(() => { if (alive) { setPosts([]); setFailed(true); } });
    return () => { alive = false; };
  }, [attempt]);
  useSiteMotion(scope, [posts?.length]);

  const tags = useMemo(() => [...new Set((posts || []).flatMap((p) => p.tags || []))].sort(), [posts]);
  const shown = useMemo(() => {
    const q = query.toLowerCase().trim();
    return (posts || []).filter((p) => (!tag || p.tags?.includes(tag)) && (!q || `${p.title} ${p.excerpt} ${(p.tags || []).join(' ')}`.toLowerCase().includes(q)));
  }, [posts, query, tag]);

  return (
    <>
      <Suspense fallback={null}><Starfield /></Suspense>
      <div ref={scope} className="relative min-h-screen overflow-x-clip text-foreground">
        <Navbar />
        <main className="page-wrap relative pt-32 pb-20 sm:pt-36">
          <header className="relative max-w-3xl">
            <div aria-hidden className="pointer-events-none absolute -left-20 -top-10 h-[320px] w-[520px] rounded-full bg-accent/20 blur-[130px]" />
            <h1 className="relative font-heading text-5xl sm:text-7xl font-extrabold italic leading-[1.05] tracking-tight">
              <span className="text-foreground">Notes &amp; </span><span className="text-gradient pr-2">Writing</span>
            </h1>
            <p className="relative mt-6 max-w-[56ch] text-base sm:text-lg leading-relaxed text-text-muted">
              What I learn while building: backend systems, testing at scale, GenAI, and the stories behind my projects.
            </p>
          </header>

          {posts === null ? (
            <p className="mt-16 flex items-center gap-2 text-text-muted" role="status"><Loader2 size={18} className="animate-spin" aria-hidden /> Loading posts… (the first visit after a quiet spell can take up to a minute while the server wakes up)</p>
          ) : posts.length === 0 ? (
            <div className="mt-16 rounded-2xl glass p-10 text-center">
              <NotebookPen size={34} className="mx-auto text-accent-dark" aria-hidden />
              <h2 className="mt-4 font-heading text-xl font-bold">{failed ? 'The server is taking too long to answer' : 'First posts coming soon'}</h2>
              <p className="mx-auto mt-2 max-w-[44ch] text-text-muted">{failed ? 'It may still be waking up. Try again in a few seconds.' : 'I’m writing up notes on system design, testing and GenAI. Check back soon.'}</p>
              {failed && (
                <button type="button" onClick={() => { setPosts(null); setAttempt((n) => n + 1); }} className="btn-outline mt-6">
                  Try again
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mt-12 flex flex-wrap items-center gap-3">
                <label className="relative w-full max-w-xs">
                  <span className="sr-only">Search posts</span>
                  <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle" aria-hidden />
                  <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search posts" className="w-full rounded-xl border border-border bg-background/60 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-text-subtle" />
                </label>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
                    {['', ...tags].map((t) => (
                      <button key={t || 'all'} type="button" aria-pressed={tag === t} onClick={() => setTag(t)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${tag === t ? 'border-accent bg-[#7C3AED] text-white' : 'border-border text-text-muted hover:text-foreground'}`}>
                        {t || 'All'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <ul className="mt-8 grid gap-6 md:grid-cols-2">
                {shown.map((p) => (
                  <li key={p.slug} data-reveal="rise">
                    <Link to={`/blog/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl glass transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/70 hover:shadow-[0_24px_60px_-24px_rgb(var(--c-accent)/0.8)]">
                      {p.coverImage && <img src={p.coverImage} alt="" loading="lazy" className="aspect-[1200/630] w-full object-cover" />}
                      <div className="flex flex-1 flex-col p-6">
                        <p className="flex items-center gap-2 text-xs text-text-subtle"><span>{formatDate(p.publishedAt)}</span><span aria-hidden>·</span><Clock size={12} aria-hidden /> {p.readingMinutes} min read</p>
                        <h2 className="mt-2 font-heading text-xl font-bold text-foreground group-hover:text-accent-dark">{p.title}</h2>
                        {p.excerpt && <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{p.excerpt}</p>}
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <ul className="flex flex-wrap gap-1.5">{(p.tags || []).slice(0, 3).map((t) => <li key={t} className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 text-[11px] text-accent-dark">{t}</li>)}</ul>
                          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-foreground">Read <ArrowRight size={14} aria-hidden /></span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              {shown.length === 0 && <p className="mt-8 text-text-muted">No posts match your search.</p>}
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;
