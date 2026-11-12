import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2, Send, Star, X } from 'lucide-react';
import api from '../../api/axios';
import { stopScroll, resumeScroll } from '../../lib/smooth';

const LIMITS = { name: 60, role: 80 };
const EMPTY = { name: '', role: '', message: '', rating: 5, website: '' };

/** Modal form for visitors to submit a review. Reviews stay hidden until approved in the admin panel. */
const ReviewForm = ({ open, onClose }) => {
  const dialog = useRef(null);
  const [form, setForm] = useState(EMPTY);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) { d.showModal(); stopScroll(); }
    if (!open && d.open) d.close();
  }, [open]);

  const close = () => {
    resumeScroll();
    onClose();
    if (status === 'sent') { setForm(EMPTY); setStatus('idle'); }
  };

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) {
      setStatus('error');
      setError('Write a few words about your experience before submitting.');
      return;
    }
    setStatus('sending');
    setError('');
    try {
      await api.post('/testimonials', {
        name: form.name.trim(),
        role: form.role.trim(),
        message: form.message.trim(),
        rating: form.rating,
        website: form.website, // spam trap: real visitors never fill this
      }, { timeout: 15000 });
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err?.response?.data?.message || 'Your review couldn’t be sent. Check your connection and try again.');
    }
  };

  const field = 'w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-text-subtle';

  return (
    <dialog
      ref={dialog}
      onClose={close}
      onClick={(e) => { if (e.target === dialog.current) close(); }}
      aria-labelledby="review-title"
      className="m-auto w-[min(560px,calc(100vw-2rem))] rounded-3xl border border-border-strong bg-surface p-0 text-foreground shadow-[0_40px_120px_-30px_rgb(var(--c-accent)/0.7)] backdrop:bg-background/70 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-6 sm:p-8">
        <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-accent/15 hover:text-foreground">
          <X size={18} aria-hidden />
        </button>

        {status === 'sent' ? (
          <div role="status" className="py-6 text-center">
            <CheckCircle2 size={48} className="mx-auto text-emerald-400" aria-hidden />
            <h2 id="review-title" className="mt-4 font-heading text-2xl font-bold">Thanks for the review!</h2>
            <p className="mx-auto mt-2 max-w-[38ch] text-text-muted">
              It will appear on the site once it&rsquo;s been approved.
            </p>
            <button type="button" onClick={close} className="btn-primary mt-7">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate={false}>
            <h2 id="review-title" className="font-heading text-2xl font-bold">Write a review</h2>
            <p className="mt-1.5 text-sm text-text-muted">
              Worked with me or used something I built? Share your experience. Reviews are published after approval.
            </p>

            <fieldset className="mt-6">
              <legend className="text-sm font-medium text-foreground">Your rating</legend>
              <div className="mt-2 flex gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className="cursor-pointer" onMouseEnter={() => setHover(n)}>
                    <input
                      type="radio"
                      name="rating"
                      value={n}
                      checked={form.rating === n}
                      onChange={() => setForm((f) => ({ ...f, rating: n }))}
                      className="peer sr-only"
                    />
                    <span className="sr-only">{n} star{n > 1 ? 's' : ''}</span>
                    <Star
                      size={28}
                      aria-hidden
                      className={`rounded transition-transform peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent hover:scale-110 ${
                        n <= (hover || form.rating) ? 'fill-amber-400 text-amber-400' : 'text-border-strong'
                      }`}
                    />
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Name</span>
                <input required maxLength={LIMITS.name} value={form.name} onChange={update('name')} autoComplete="name" placeholder="Your name" className={field} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Role or company</span>
                <input required maxLength={LIMITS.role} value={form.role} onChange={update('role')} autoComplete="organization-title" placeholder="e.g. SDE 1, Amazon" className={field} />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium">Your review</span>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={update('message')}
                placeholder="What was it like working with me?"
                className={`${field} resize-none`}
              />
            </label>

            {/* Spam trap, hidden from people and assistive tech */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} className="hidden" aria-hidden />

            {status === 'error' && (
              <p role="alert" className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
            )}

            <button type="submit" disabled={status === 'sending'} className="btn-primary mt-6 w-full disabled:opacity-70">
              {status === 'sending'
                ? <><Loader2 size={16} className="animate-spin" aria-hidden /> Submitting&hellip;</>
                : <><Send size={16} aria-hidden /> Submit review</>}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
};

export default ReviewForm;
