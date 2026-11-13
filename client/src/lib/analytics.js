import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { PORTFOLIO_API } from '../api/axios';

/**
 * First-party, cookie-free analytics. Sends small events to the backend:
 * page views, project/post views, resume downloads, outbound clicks, homepage
 * sections seen, form submissions, and time on page + scroll depth.
 * A random visitor id is kept in localStorage (no personal data, no IP stored).
 * Off on localhost and in the admin panel.
 */

const ENDPOINT = `${PORTFOLIO_API}/analytics/event`;
const ENABLED =
  typeof window !== 'undefined' &&
  !/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) &&
  import.meta.env.VITE_ANALYTICS !== 'off';

const randomId = () =>
  (crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`).replace(/-/g, '');

const store = (storage, key, make) => {
  try {
    let v = storage.getItem(key);
    const created = !v;
    if (!v) { v = make(); storage.setItem(key, v); }
    return { value: v, created };
  } catch {
    return { value: make(), created: true };
  }
};

let ids = null;
const getIds = () => {
  if (!ids) {
    const visitor = store(localStorage, 'aa-vid', randomId);
    const session = store(sessionStorage, 'aa-sid', randomId);
    let isNew = visitor.created;
    try {
      if (visitor.created) sessionStorage.setItem('aa-new', '1');
      isNew = isNew || sessionStorage.getItem('aa-new') === '1';
    } catch { /* ignore */ }
    ids = { visitorId: visitor.value, sessionId: session.value, isNewVisitor: isNew };
  }
  return ids;
};

// Where the visit came from: kept for the whole session (first page's referrer / utm tags).
const getOrigin = () => {
  try {
    const saved = sessionStorage.getItem('aa-origin');
    if (saved) return JSON.parse(saved);
    const q = new URLSearchParams(window.location.search);
    const utm = { source: q.get('utm_source') || undefined, medium: q.get('utm_medium') || undefined, campaign: q.get('utm_campaign') || undefined };
    const origin = { referrer: document.referrer || undefined, utm: utm.source || utm.medium || utm.campaign ? utm : undefined };
    sessionStorage.setItem('aa-origin', JSON.stringify(origin));
    return origin;
  } catch {
    return {};
  }
};

const isAdmin = () => window.location.pathname.startsWith('/admin');

export const track = (type, data = {}) => {
  if (!ENABLED || isAdmin()) return;
  try {
    const body = {
      type,
      path: window.location.pathname,
      ...getIds(),
      ...getOrigin(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`,
      ...data,
    };
    fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true }).catch(() => {});
  } catch { /* never break the site */ }
};

/** Mount once (in App). Tracks page views, engagement per page, outbound/resume clicks and homepage sections. */
export const useAnalytics = () => {
  const { pathname } = useLocation();
  const page = useRef({ path: null, start: 0, maxScroll: 0 });

  // Page view + engagement for the page being left
  useEffect(() => {
    if (!ENABLED || pathname.startsWith('/admin')) return undefined;
    const flush = () => {
      const p = page.current;
      if (!p.path) return;
      const durationSec = Math.round((Date.now() - p.start) / 1000);
      if (durationSec >= 1) track('engagement', { path: p.path, durationSec: Math.min(durationSec, 21600), scrollPct: p.maxScroll });
    };
    flush();
    page.current = { path: pathname, start: Date.now(), maxScroll: 0 };
    track('pageview');

    const onScroll = () => {
      const h = document.documentElement;
      const pct = Math.round(((h.scrollTop + window.innerHeight) / Math.max(h.scrollHeight, 1)) * 100);
      if (pct > page.current.maxScroll) page.current.maxScroll = Math.min(100, pct);
    };
    const onHide = () => { if (document.visibilityState === 'hidden') { flush(); page.current.start = Date.now(); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [pathname]);

  // Outbound links and resume downloads (anywhere on the site)
  useEffect(() => {
    if (!ENABLED) return undefined;
    const onClick = (e) => {
      const a = e.target.closest?.('a[href]');
      if (!a || isAdmin()) return;
      const href = a.getAttribute('href');
      const text = (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 60);
      if (/resume|\.pdf($|\?)/i.test(href)) {
        track('resume_download', { target: href.slice(0, 300), label: a.dataset.track || text || 'resume' });
      } else if (/^(mailto:|tel:)/i.test(href)) {
        track('outbound', { target: href.split('?')[0].slice(0, 300), label: href.startsWith('tel:') ? 'phone' : 'email' });
      } else if (/^https?:\/\//i.test(href) && !href.includes(window.location.host)) {
        let host = href;
        try { host = new URL(href).hostname.replace(/^www\./, ''); } catch { /* keep href */ }
        track('outbound', { target: href.slice(0, 300), label: a.dataset.track || host });
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
};

/** Tracks homepage sections the first time each scrolls into view (once per page load). */
export const useSectionTracking = (ids, ready = true) => {
  useEffect(() => {
    if (!ENABLED || !ready || typeof IntersectionObserver === 'undefined') return undefined;
    const seen = new Set();
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting && !seen.has(en.target.id)) {
          seen.add(en.target.id);
          track('section_view', { target: en.target.id });
        }
      }),
      { threshold: 0.35 }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids, ready]);
};
