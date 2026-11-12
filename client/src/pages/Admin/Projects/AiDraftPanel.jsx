import React, { useState } from 'react';
import { Loader2, Sparkles, Undo2, Wand2 } from 'lucide-react';
import api from '../../../api/axios';
import { apiError, ErrorNote } from '../../../components/Admin/ui';

/**
 * Paste raw notes about a project; the Universal Backend's AI (Groq / Cerebras /
 * OpenRouter / Gemini fallback) drafts every text field. Nothing is saved until
 * you press Save. Slug, image and visibility are never touched.
 */
const AiDraftPanel = ({ form, setForm }) => {
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // { filled, by }
  const [before, setBefore] = useState(null); // form snapshot for undo

  const generate = async () => {
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post('/projects/ai-draft', { notes }, { timeout: 90000 });
      const next = {
        title: data.title,
        category: data.category,
        shortDescription: data.shortDescription,
        description: data.description,
        problem: data.problem,
        solution: data.solution,
        features: (data.features || []).join('\n'),
        metrics: (data.metrics || []).join('\n'),
        technologies: (data.technologies || []).join(', '),
        liveLink: data.liveLink,
        githubLink: data.githubLink,
        youtubeVideoUrl: data.youtubeVideoUrl,
      };
      // Only replace fields the AI actually filled; keep what you typed elsewhere.
      const filled = Object.fromEntries(Object.entries(next).filter(([, v]) => typeof v === 'string' && v.trim()));
      setBefore(form);
      setForm((f) => ({ ...f, ...filled }));
      setResult({ filled: Object.keys(filled).length, by: data.generatedBy });
    } catch (err) {
      setError(apiError(err, 'The AI couldn’t generate a draft. Try again.'));
    } finally {
      setBusy(false);
    }
  };

  const undo = () => {
    if (before) setForm(before);
    setBefore(null);
    setResult(null);
  };

  return (
    <div className="mb-6 rounded-2xl border border-accent/40 bg-accent/[0.07] p-5 sm:p-6 shadow-[0_0_40px_-20px_rgb(var(--c-accent))]">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent-dark">
          <Sparkles size={19} aria-hidden />
        </span>
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">Fill with AI</h2>
          <p className="mt-0.5 text-sm text-text-muted">
            Dump everything you know about the project: what it does, why you built it, the stack, numbers, links. Rough notes are fine.
            The AI fills in the fields below; review them, then save.
          </p>
        </div>
      </div>

      <label className="mt-4 block">
        <span className="sr-only">Raw notes about the project</span>
        <textarea
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. built a job portal that scrapes 10+ sites, telegram bot sends alerts, next.js + node + mongo, cron jobs, ~500 users a day, live at https://…"
          className="w-full resize-y rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-text-subtle"
        />
      </label>

      {error && <div className="mt-3"><ErrorNote>{error}</ErrorNote></div>}
      {result && (
        <p role="status" className="mt-3 text-sm text-emerald-300">
          Filled {result.filled} fields{result.by ? ` (via ${result.by})` : ''}. Check them below before saving.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={generate} disabled={busy || notes.trim().length < 20} className="btn-primary disabled:opacity-60">
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Wand2 size={16} aria-hidden />}
          {busy ? 'Writing…' : result ? 'Regenerate' : 'Generate with AI'}
        </button>
        {before && (
          <button type="button" onClick={undo} className="btn-outline">
            <Undo2 size={16} aria-hidden /> Undo
          </button>
        )}
        {notes.trim().length < 20 && <span className="text-xs text-text-subtle">Write at least a couple of sentences.</span>}
      </div>
    </div>
  );
};

export default AiDraftPanel;
