import React, { useState } from 'react';
import { Check, Copy, Loader2, Mail, Sparkles, X } from 'lucide-react';
import api from '../../api/axios';
import { apiError, ErrorNote, inputCls } from '../../components/Admin/ui';

/** "Draft reply with AI" for one contact message. Nothing is sent: you edit it, then open it in your mail app. */
const AiReply = ({ message }) => {
  const [draft, setDraft] = useState(null); // { subject, body }
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post(`/contact/${message._id}/ai-reply`, {}, { timeout: 90000 });
      setDraft({ subject: data.subject, body: data.body });
    } catch (err) {
      setError(apiError(err, 'The AI couldn’t draft a reply. Try again.'));
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard blocked: the text is still selectable */ }
  };

  const mailto = draft
    ? `mailto:${message.email}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`
    : '';

  if (!draft) {
    return (
      <>
        <button type="button" onClick={generate} disabled={busy} className="btn-outline !px-3 !py-1.5 text-xs disabled:opacity-60">
          {busy ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <Sparkles size={14} aria-hidden />}
          {busy ? 'Drafting…' : 'Draft reply with AI'}
        </button>
        {error && <div className="mt-3 w-full"><ErrorNote>{error}</ErrorNote></div>}
      </>
    );
  }

  return (
    <div className="mt-4 w-full rounded-xl border border-accent/40 bg-accent/[0.06] p-4">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><Sparkles size={15} className="text-accent-dark" aria-hidden /> AI reply draft</p>
        <button type="button" onClick={() => setDraft(null)} aria-label="Discard draft" className="rounded-lg p-1.5 text-text-muted hover:bg-accent/15"><X size={15} aria-hidden /></button>
      </div>
      <label className="mt-3 block">
        <span className="mb-1 block text-xs text-text-muted">Subject</span>
        <input value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} className={inputCls} />
      </label>
      <label className="mt-3 block">
        <span className="mb-1 block text-xs text-text-muted">Reply (edit before sending)</span>
        <textarea rows={8} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} className={`${inputCls} resize-y`} />
      </label>
      {error && <div className="mt-3"><ErrorNote>{error}</ErrorNote></div>}
      <div className="mt-3 flex flex-wrap gap-2">
        <a href={mailto} className="btn-primary !px-3 !py-1.5 text-xs"><Mail size={14} aria-hidden /> Open in email</a>
        <button type="button" onClick={copy} className="btn-outline !px-3 !py-1.5 text-xs">
          {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />} {copied ? 'Copied' : 'Copy text'}
        </button>
        <button type="button" onClick={generate} disabled={busy} className="btn-outline !px-3 !py-1.5 text-xs disabled:opacity-60">
          {busy ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <Sparkles size={14} aria-hidden />} Regenerate
        </button>
      </div>
    </div>
  );
};

export default AiReply;
