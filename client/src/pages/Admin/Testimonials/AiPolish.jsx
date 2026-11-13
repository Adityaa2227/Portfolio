import React, { useState } from 'react';
import { Check, Loader2, Sparkles, X } from 'lucide-react';
import api from '../../../api/axios';
import { apiError, ErrorNote } from '../../../components/Admin/ui';

/** "Polish with AI": suggests typo/grammar fixes for a review. Saved only if you press "Use this". */
const AiPolish = ({ review, onSaved }) => {
  const [suggestion, setSuggestion] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const suggest = async () => {
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post(`/testimonials/${review._id}/ai-polish`, {}, { timeout: 90000 });
      setSuggestion(data.message);
    } catch (err) {
      setError(apiError(err, 'The AI couldn’t polish this review. Try again.'));
    } finally {
      setBusy(false);
    }
  };

  const use = async () => {
    setSaving(true);
    setError('');
    try {
      const { data } = await api.put(`/testimonials/${review._id}`, { message: suggestion });
      onSaved(data);
      setSuggestion(null);
    } catch (err) {
      setError(apiError(err, 'Couldn’t save the new text.'));
    } finally {
      setSaving(false);
    }
  };

  const unchanged = suggestion !== null && suggestion.trim() === review.message.trim();

  if (suggestion === null) {
    return (
      <>
        <button type="button" onClick={suggest} disabled={busy} className="btn-outline !px-3 !py-1.5 text-xs disabled:opacity-60">
          {busy ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <Sparkles size={14} aria-hidden />}
          {busy ? 'Checking…' : 'Polish with AI'}
        </button>
        {error && <div className="w-full"><ErrorNote>{error}</ErrorNote></div>}
      </>
    );
  }

  return (
    <div className="w-full rounded-xl border border-accent/40 bg-accent/[0.06] p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Sparkles size={15} className="text-accent-dark" aria-hidden />
        {unchanged ? 'No fixes needed. The review already reads well.' : 'Suggested fixes (typos and grammar only)'}
      </p>
      {!unchanged && (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs text-text-subtle">Current</p>
            <p className="whitespace-pre-wrap rounded-lg bg-background/50 p-3 text-sm text-text-muted">{review.message}</p>
          </div>
          <div>
            <p className="mb-1 text-xs text-text-subtle">Suggested</p>
            <p className="whitespace-pre-wrap rounded-lg bg-background/50 p-3 text-sm text-foreground">{suggestion}</p>
          </div>
        </div>
      )}
      {error && <div className="mt-3"><ErrorNote>{error}</ErrorNote></div>}
      <div className="mt-3 flex flex-wrap gap-2">
        {!unchanged && (
          <button type="button" onClick={use} disabled={saving} className="btn-primary !px-3 !py-1.5 text-xs disabled:opacity-60">
            {saving ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <Check size={14} aria-hidden />} Use this
          </button>
        )}
        <button type="button" onClick={() => setSuggestion(null)} className="btn-outline !px-3 !py-1.5 text-xs">
          <X size={14} aria-hidden /> {unchanged ? 'Close' : 'Keep original'}
        </button>
      </div>
    </div>
  );
};

export default AiPolish;
