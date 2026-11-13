import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Loader2 } from 'lucide-react';
import Navbar from '../../components/Public/Navbar';
import Footer from '../../components/Public/Footer';
import api from '../../api/axios';
import { useSiteMotion } from '../../lib/motion';
import { startSmoothScroll } from '../../lib/smooth';
import { usePageMeta } from '../../lib/pageMeta';
import { renderMarkdown } from '../../lib/markdown';
import { track } from '../../lib/analytics';
import { formatDate } from './Blog';

const Starfield = lazy(() => import('../../components/Common/Starfield'));

const BlogPost = () => {
  const { slug } = useParams();
  const scope = useRef(null);
  // Result per slug, so a new slug shows "loading" without resetting state in an effect.
  const [result, setResult] = useState({ slug: null, post: undefined });
  const post = result.slug === slug ? result.post : undefined; // undefined = loading, null = not found

  useEffect(() => { window.scrollTo(0, 0); return startSmoothScroll(); }, [slug]);
  useEffect(() => {
    let alive = true;
    api.get(`/posts/${encodeURIComponent(slug)}`, { timeout: 20000 })
      .then(({ data }) => { if (alive) { setResult({ slug, post: data }); track('post_view', { target: slug }); } })
      .catch(() => { if (alive) setResult({ slug, post: null }); });
    return () => { alive = false; };
  }, [slug]);
  useSiteMotion(scope, [post?._id]);

  usePageMeta({
    title: post ? post.title : post === null ? 'Post not found' : 'Blog',
    description: post?.excerpt,
    path: `/blog/${slug}`,
    image: post?.coverImage,
  });

  const html = useMemo(() => (post ? renderMarkdown(post.content) : ''), [post]);

  return (
    <>
      <Suspense fallback={null}><Starfield /></Suspense>
      <div ref={scope} className="relative min-h-screen overflow-x-clip text-foreground">
        <Navbar />
        <main className="page-wrap relative pt-28 pb-20 sm:pt-32">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-foreground"><ArrowLeft size={16} aria-hidden /> All posts</Link>

          {post === undefined ? (
            <p className="mt-16 flex items-center gap-2 text-text-muted" role="status"><Loader2 size={18} className="animate-spin" aria-hidden /> Loading…</p>
          ) : post === null ? (
            <div className="mt-16">
              <h1 className="font-heading text-3xl font-bold">Post not found</h1>
              <p className="mt-2 text-text-muted">It may have been moved or unpublished. <Link to="/blog" className="text-accent-dark underline">See all posts</Link>.</p>
            </div>
          ) : (
            <article className="mx-auto mt-8 max-w-3xl">
              <header>
                <p className="flex flex-wrap items-center gap-2 text-sm text-text-subtle">
                  <span>{formatDate(post.publishedAt)}</span><span aria-hidden>·</span><Clock size={13} aria-hidden /> {post.readingMinutes} min read
                </p>
                <h1 className="mt-3 font-heading text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">{post.title}</h1>
                {post.excerpt && <p className="mt-4 text-lg leading-relaxed text-text-muted">{post.excerpt}</p>}
                {post.tags?.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-1.5">{post.tags.map((t) => <li key={t} className="rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs text-accent-dark">{t}</li>)}</ul>
                )}
              </header>
              {post.coverImage && <img src={post.coverImage} alt="" className="mt-8 aspect-[1200/630] w-full rounded-2xl border border-border object-cover" />}
              <div className="prose-post mt-10" dangerouslySetInnerHTML={{ __html: html }} />
              <footer className="mt-14 rounded-2xl glass p-6">
                <p className="font-heading text-lg font-bold">Thanks for reading</p>
                <p className="mt-1 text-sm text-text-muted">Questions or thoughts? <Link to="/#contact" className="text-accent-dark underline">Send me a message</Link> or <Link to="/blog" className="text-accent-dark underline">read more posts</Link>.</p>
              </footer>
            </article>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
