import React, { useEffect, useState } from 'react';
import { Check, Copy, Link2, Loader2, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import { apiError, Badge, Card, ErrorNote, Field, inputCls } from '../../../components/Admin/ui';

const CopyButton = ({ text }) => {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); } catch { /* clipboard blocked */ }
      }}
      className="btn-outline !px-2.5 !py-1.5 text-xs"
    >
      {done ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />} {done ? 'Copied' : 'Copy link'}
    </button>
  );
};

/** "Request a review": personal, single-use links that open the review form pre-filled. */
const InvitePanel = () => {
  const [invites, setInvites] = useState([]);
  const [form, setForm] = useState({ name: '', role: '', note: '' });
  const [created, setCreated] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/review-invites').then(({ data }) => setInvites(data)).catch(() => {});
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post('/review-invites', form);
      setCreated(data);
      setInvites((list) => [{ ...data, status: 'open' }, ...list]);
      setForm({ name: '', role: '', note: '' });
    } catch (err) {
      setError(apiError(err, 'Couldn’t create the link.'));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (inv) => {
    try {
      await api.delete(`/review-invites/${inv._id}`);
      setInvites((list) => list.filter((x) => x._id !== inv._id));
      if (created?._id === inv._id) setCreated(null);
    } catch (err) {
      setError(apiError(err, 'Couldn’t delete the link.'));
    }
  };

  const tone = { open: 'accent', used: 'success', expired: 'neutral' };

  return (
    <Card className="mb-6">
      <h2 className="flex items-center gap-2 font-heading text-lg font-bold"><Link2 size={18} className="text-accent-dark" aria-hidden /> Request a review</h2>
      <p className="mt-1 text-sm text-text-muted">Create a personal link for a manager, mentor or client. It opens the review form with their name filled in, works once, and expires after 60 days. Their review still waits for your approval.</p>

      <form onSubmit={create} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
        <Field label="Their name"><input required maxLength={60} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
        <Field label="Role (optional)"><input maxLength={80} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Engineering Manager, PayPal" className={inputCls} /></Field>
        <Field label="Private note (optional)"><input maxLength={200} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Only you see this" className={inputCls} /></Field>
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Link2 size={16} aria-hidden />} Create link
        </button>
      </form>
      {error && <div className="mt-3"><ErrorNote>{error}</ErrorNote></div>}

      {created && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-3" role="status">
          <p className="min-w-0 flex-1 text-sm text-foreground">
            Link for <strong>{created.name}</strong>: <span className="break-all font-mono text-xs text-text-muted">{created.link}</span>
          </p>
          <CopyButton text={created.link} />
        </div>
      )}

      {invites.length > 0 && (
        <ul className="mt-4 divide-y divide-border">
          {invites.slice(0, 15).map((inv) => (
            <li key={inv._id} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
              <span className="min-w-0 flex-1">
                <span className="font-medium text-foreground">{inv.name}</span>
                {inv.role && <span className="text-text-muted"> · {inv.role}</span>}
                {inv.note && <span className="block text-xs text-text-subtle">{inv.note}</span>}
              </span>
              <Badge tone={tone[inv.status] || 'neutral'}>{inv.status}</Badge>
              {inv.status === 'open' && <CopyButton text={inv.link} />}
              <button type="button" onClick={() => remove(inv)} aria-label={`Delete link for ${inv.name}`} className="rounded-lg p-2 text-red-300 hover:bg-red-500/10"><Trash2 size={15} aria-hidden /></button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default InvitePanel;
