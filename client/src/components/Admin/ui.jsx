import React from 'react';
import { Loader2 } from 'lucide-react';

/** Shared building blocks for the admin panel, styled like the public site. */

export const inputCls =
  'w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-text-subtle transition-colors';

export const PageHeader = ({ title, description, actions }) => (
  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">{title}</h1>
      {description && <p className="mt-1.5 max-w-[60ch] text-sm text-text-muted">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

export const Card = ({ className = '', children }) => (
  <div className={`rounded-2xl glass p-5 sm:p-6 ${className}`}>{children}</div>
);

export const Field = ({ label, hint, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-xs text-text-subtle">{hint}</span>}
  </label>
);

export const Toggle = ({ checked, onChange, label, description }) => (
  <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-background/40 p-4">
    <span>
      <span className="block text-sm font-medium text-foreground">{label}</span>
      {description && <span className="mt-0.5 block text-xs text-text-muted">{description}</span>}
    </span>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
    <span
      aria-hidden
      className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-border-strong transition-colors peer-checked:bg-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
    />
  </label>
);

export const Badge = ({ tone = 'neutral', children }) => {
  const tones = {
    neutral: 'border-border-strong text-text-muted',
    success: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
    warning: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
    accent: 'border-accent/50 bg-accent/15 text-accent-dark',
  };
  return <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
};

export const Spinner = ({ label = 'Loading…' }) => (
  <div className="flex items-center gap-3 py-16 text-sm text-text-muted" role="status">
    <Loader2 size={18} className="animate-spin text-accent-dark" aria-hidden /> {label}
  </div>
);

export const Empty = ({ Icon, title, children, action }) => (
  <Card className="flex flex-col items-center py-14 text-center">
    {Icon && <Icon size={36} className="text-accent-dark" aria-hidden />}
    <h2 className="mt-4 font-heading text-xl font-bold text-foreground">{title}</h2>
    {children && <p className="mt-2 max-w-[44ch] text-sm text-text-muted">{children}</p>}
    {action && <div className="mt-6">{action}</div>}
  </Card>
);

export const ErrorNote = ({ children }) => (
  <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{children}</p>
);

/** Readable message from an API error (the server sometimes answers with HTML). */
export const apiError = (err, fallback) => {
  const msg = err?.response?.data?.message;
  if (typeof msg === 'string' && msg.length < 300) return msg;
  if (err?.response?.status === 401) return 'Your session expired. Log in again.';
  if (!err?.response) return 'Can’t reach the server. Check your connection and try again.';
  return fallback;
};

/**
 * Link for a stored file. New uploads are absolute ImageKit URLs. Relative paths are either
 * files bundled with the site (e.g. /resume.pdf) or legacy uploads that lived on the old
 * portfolio server's disk (/uploads/...), which may no longer exist.
 */
export const fileUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads/')) return `https://portfolio-backend-ha1q.onrender.com${url}`;
  return url;
};
