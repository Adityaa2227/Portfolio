import React, { useState } from 'react';
import {
  ArrowRight, Briefcase, CheckCircle2, ChevronDown, Code2, Loader2, Mail, MapPin, MessageSquareText, Phone, Rocket, User,
} from 'lucide-react';
import { SOCIALS } from './Hero';
import api from '../../api/axios';
import { track } from '../../lib/analytics';
import { SplitWords } from '../../lib/motion';

const EMAIL = 'adityaagar324@gmail.com';
const PHONE = '+91 9508664027';

const INFO = [
  { Icon: Mail, label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
  { Icon: Phone, label: 'Phone', value: PHONE, href: `tel:${PHONE.replace(/\s+/g, '')}` },
  { Icon: MapPin, label: 'Location', value: 'Garhwa, Jharkhand', note: 'Open to relocation' },
];

const SUBJECTS = ['Internship', 'Full-time role', 'Collaboration', 'Freelance project', 'Just saying hi', 'Other'];

const REASONS = [
  { Icon: Code2, title: 'Collaboration', text: 'Open to interesting projects and technical collaborations.' },
  { Icon: Briefcase, title: 'Opportunities', text: 'Looking for full-time SDE roles, internships, and impactful work.' },
  { Icon: Rocket, title: 'Just Say Hi', text: 'Want to discuss tech, ideas, or opportunities? My inbox is open!' },
];

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' };

/** Input with a leading icon. */
const Field = ({ Icon, label, children, top = false, className = '' }) => (
  <label className={`relative block ${className}`}>
    <span className="sr-only">{label}</span>
    <Icon size={17} className={`pointer-events-none absolute left-4 text-text-muted ${top ? 'top-4' : 'top-1/2 -translate-y-1/2'}`} aria-hidden />
    {children}
  </label>
);

export const Contact = () => {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/contact', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject,
        message: form.message.trim(),
      }, { timeout: 15000 });
      setStatus('sent');
      track('contact_submit', { label: form.subject || 'no subject' });
      setForm(EMPTY);
    } catch {
      setStatus('error');
    }
  };

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(`${form.subject || 'Portfolio message'} from ${form.name || 'a visitor'}`)}&body=${encodeURIComponent(
    `${form.message}${form.phone ? `\n\nPhone: ${form.phone}` : ''}`
  )}`;

  const input =
    'w-full rounded-xl border border-border bg-background/60 py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-text-muted transition-colors focus:bg-background/80';

  return (
    <section id="contact" className="relative overflow-hidden pt-24 pb-40 sm:pt-32 sm:pb-52">
      {/* Planet horizon glowing at the bottom of the section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[320px] overflow-hidden"
        style={{ maskImage: 'linear-gradient(to bottom, #000 55%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, #000 55%, transparent)' }}
      >
        <div
          className="absolute left-1/2 top-[55%] aspect-square w-[160%] -translate-x-1/2 rounded-full sm:w-[120%]"
          style={{
            // Lit planet: soft translucent violet body with a bright rim (was a near-black fill)
            background: 'radial-gradient(closest-side, rgb(var(--c-accent) / 0.14) 80%, rgb(var(--c-accent) / 0.3) 94%, rgb(var(--c-accent-strong) / 0.75) 99%, transparent 100%)',
            boxShadow: '0 -20px 90px -10px rgb(var(--c-accent) / 0.6)',
          }}
        />
      </div>

      <div className="page-wrap relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-14">
          {/* Left: pitch and contact details. The scene is sized to this column, so the laptop
              always sits behind the contact details, whatever the screen width. */}
          <div className="relative isolate lg:pb-24">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-32 bottom-0 -z-10 hidden aspect-[1165/1085] lg:block"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, #000 12%, #000 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 25%, #000 93%, transparent 100%)',
                maskComposite: 'intersect',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 12%, #000 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 25%, #000 93%, transparent 100%)',
                WebkitMaskComposite: 'source-in',
              }}
            >
              <img src="/contact-scene.webp" alt="" width="1165" height="1085" loading="lazy" className="h-full w-full opacity-65" />
              {/* Darken the wall behind the text */}
              <div className="absolute inset-0 bg-[radial-gradient(55%_42%_at_68%_36%,rgb(var(--c-background)/0.8),transparent_80%)]" />
            </div>

            <p className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium text-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" aria-hidden />
              Let&rsquo;s Connect
            </p>
            <h2 data-reveal="words" className="mt-5 font-heading text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight text-foreground">
              <span className="block"><SplitWords text="Let's Build" /></span>
              <span className="block"><SplitWords text="Something Amazing" /></span>
            </h2>
            <p className="relative mt-1 inline-block pl-6 pr-2 font-heading text-5xl sm:text-6xl font-extrabold italic text-gradient">
              Together
              <svg aria-hidden viewBox="0 0 240 24" className="absolute -bottom-3 left-8 w-[85%]" preserveAspectRatio="none">
                <path d="M4 16 C 60 6, 140 4, 236 10" fill="none" stroke="rgb(var(--c-accent))" strokeWidth="4" strokeLinecap="round" />
                <path d="M24 21 C 80 13, 150 12, 210 16" fill="none" stroke="rgb(var(--c-accent-2) / 0.7)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </p>
            <p className="mt-8 max-w-[42ch] text-base sm:text-lg leading-relaxed text-text-muted">
              Have an idea, opportunity, or just want to say hi? I&rsquo;d love to hear from you. Let&rsquo;s connect and
              create something impactful together.
            </p>

            <ul className="mt-8 space-y-4">
              {INFO.map(({ Icon, label, value, href, note }) => (
                <li key={label} data-reveal="rise" className="flex items-center gap-4 [text-shadow:0_1px_10px_rgb(0_0_0/0.95),0_0_2px_rgb(0_0_0/0.9)]">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl glass-strong text-accent-dark">
                    <Icon size={20} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{label}</span>
                    {href ? (
                      <a href={href} className="text-sm text-text-muted hover:text-accent-dark">{value}</a>
                    ) : (
                      <span className="text-sm text-text-muted">{value}</span>
                    )}
                    {note && <span className="block text-xs text-text-muted">{note}</span>}
                  </span>
                </li>
              ))}
            </ul>

            {/* Mobile: show the desk part of the scene under the details */}
            <img
              src="/contact-scene.webp"
              alt=""
              aria-hidden
              loading="lazy"
              className="mt-8 aspect-[16/10] w-full rounded-2xl object-cover object-[60%_92%] lg:hidden"
              style={{ maskImage: 'radial-gradient(closest-side, #000 65%, transparent)', WebkitMaskImage: 'radial-gradient(closest-side, #000 65%, transparent)' }}
            />
          </div>

          {/* Right: form, socials below */}
          <div>
            <div className="rounded-3xl glass-strong p-6 sm:p-8 shadow-[0_30px_90px_-30px_rgb(var(--c-accent)/0.6)]">
              {status === 'sent' ? (
                <div role="status" className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <CheckCircle2 size={52} className="text-emerald-400" aria-hidden />
                  <h3 className="mt-4 font-heading text-2xl font-bold text-foreground">Message sent</h3>
                  <p className="mt-2 max-w-[36ch] text-text-muted">Thanks for reaching out. I&rsquo;ll reply to your email within 24 hours.</p>
                  <button type="button" onClick={() => setStatus('idle')} className="btn-outline mt-7">Send another message</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/20 text-accent-dark shadow-[0_0_30px_-6px_rgb(var(--c-accent))]">
                      <Mail size={26} aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-heading text-2xl font-bold text-foreground">Send Me a Message</h3>
                      <p className="text-sm text-text-muted">I usually reply within 24 hours.</p>
                    </div>
                  </div>

                  <form onSubmit={submit} className="mt-7 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field Icon={User} label="Your name">
                        <input required value={form.name} onChange={update('name')} placeholder="Your Name" autoComplete="name" className={input} />
                      </Field>
                      <Field Icon={Mail} label="Your email">
                        <input required type="email" value={form.email} onChange={update('email')} placeholder="Your Email" autoComplete="email" className={input} />
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field Icon={Phone} label="Phone number (optional)">
                        <input type="tel" value={form.phone} onChange={update('phone')} placeholder="Phone (optional)" autoComplete="tel" className={input} />
                      </Field>
                      <Field Icon={Briefcase} label="Subject (optional)">
                        <select
                          value={form.subject}
                          onChange={update('subject')}
                          className={`${input} appearance-none pr-10 ${form.subject ? '' : 'text-text-muted'}`}
                        >
                          <option value="">Subject (optional)</option>
                          {SUBJECTS.map((s) => <option key={s} value={s} className="bg-surface text-foreground">{s}</option>)}
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden />
                      </Field>
                    </div>
                    <Field Icon={MessageSquareText} label="Your message" top>
                      <textarea required rows={5} value={form.message} onChange={update('message')} placeholder="Your Message..." className={`${input} resize-y`} />
                    </Field>

                    {status === 'error' && (
                      <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        The message didn&rsquo;t go through. Try again, or{' '}
                        <a href={mailto} className="font-semibold underline">send it by email</a> instead.
                      </p>
                    )}

                    <button type="submit" disabled={status === 'sending'} className="btn-primary magnetic w-full py-3.5 disabled:opacity-70">
                      {status === 'sending'
                        ? <><Loader2 size={16} className="animate-spin" aria-hidden /> Sending&hellip;</>
                        : <>Send Message <ArrowRight size={16} aria-hidden /></>}
                    </button>
                  </form>
                </>
              )}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-text-muted">Or connect with me on</p>
              <ul className="mt-4 flex justify-center gap-3">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      aria-label={label}
                      title={label}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-xl glass-strong text-text-muted transition-all hover:-translate-y-0.5 hover:border-accent hover:text-foreground hover:glow"
                    >
                      <Icon size={19} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Reasons to reach out (sit on the bottom of the scene on desktop) */}
        <ul data-reveal="pop" className="relative mt-12 grid gap-4 md:grid-cols-3 lg:-mt-6">
          {REASONS.map(({ Icon, title, text }) => (
            <li key={title} className="flex items-start gap-4 rounded-2xl glass-strong p-5 transition-colors hover:border-accent/60">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent-dark">
                <Icon size={24} aria-hidden />
              </span>
              <span>
                <span className="block font-heading text-lg font-bold text-foreground">{title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-text-muted">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Contact;
