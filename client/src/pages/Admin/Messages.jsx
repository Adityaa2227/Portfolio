import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Mail, Phone, Reply, Search, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import { apiError, Badge, Empty, ErrorNote, inputCls, PageHeader, Spinner } from '../../components/Admin/ui';

const checkboxCls = 'h-4 w-4 shrink-0 cursor-pointer rounded accent-[rgb(var(--c-accent))]';

const Messages = () => {
  const [messages, setMessages] = useState(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [selected, setSelected] = useState(() => new Set());
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get('/contact')
      .then(({ data }) => setMessages(data))
      .catch((err) => { setMessages([]); setError(apiError(err, 'Couldn’t load messages.')); });
  }, []);

  const shown = useMemo(() => {
    const q = query.toLowerCase().trim();
    return (messages || []).filter((m) => !q || [m.name, m.email, m.subject, m.message].some((s) => s?.toLowerCase().includes(q)));
  }, [messages, query]);

  // "Select all" works on the messages currently shown (respects the search).
  const shownSelected = shown.filter((m) => selected.has(m._id)).length;
  const allShownSelected = shown.length > 0 && shownSelected === shown.length;

  const toggle = (id) => setSelected((s) => {
    const next = new Set(s);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const toggleAll = () => setSelected((s) => {
    const next = new Set(s);
    shown.forEach((m) => (allShownSelected ? next.delete(m._id) : next.add(m._id)));
    return next;
  });

  const deleteSelected = async () => {
    const ids = [...selected];
    if (!ids.length) return;
    if (!window.confirm(`Delete ${ids.length} message${ids.length > 1 ? 's' : ''}? This can’t be undone.`)) return;
    setDeleting(true);
    setError('');
    setNotice('');
    try {
      const { data } = await api.delete('/contact', { data: { ids } });
      setMessages((list) => list.filter((m) => !selected.has(m._id)));
      setSelected(new Set());
      setNotice(`Deleted ${data?.deleted ?? ids.length} message${ids.length > 1 ? 's' : ''}.`);
    } catch (err) {
      setError(apiError(err, 'Couldn’t delete the messages. Try again.'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="Messages" description="Everything sent through the contact form, newest first." />

      <label className="relative mb-5 block max-w-sm">
        <span className="sr-only">Search messages</span>
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle" aria-hidden />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email or text" className={`${inputCls} pl-10`} />
      </label>

      {error && <div className="mb-4"><ErrorNote>{error}</ErrorNote></div>}
      {notice && <p role="status" className="mb-4 text-sm text-emerald-300">{notice}</p>}

      {messages === null ? (
        <Spinner label="Loading messages…" />
      ) : shown.length === 0 ? (
        <Empty Icon={Mail} title={query ? 'No messages match your search' : 'No messages yet'}>
          {query ? null : 'Messages from the contact form appear here, and are also emailed to you.'}
        </Empty>
      ) : (
        <>
          {/* Bulk actions */}
          <div className="sticky top-0 z-10 -mx-1 mb-4 flex flex-wrap items-center gap-3 rounded-xl bg-background/85 px-3 py-2.5 backdrop-blur lg:top-2">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
              <input
                type="checkbox"
                checked={allShownSelected}
                ref={(el) => { if (el) el.indeterminate = shownSelected > 0 && !allShownSelected; }}
                onChange={toggleAll}
                className={checkboxCls}
              />
              Select all{query ? ' shown' : ''} ({shown.length})
            </label>
            {selected.size > 0 && (
              <>
                <span className="text-sm text-text-muted">{selected.size} selected</span>
                <button
                  type="button"
                  onClick={deleteSelected}
                  disabled={deleting}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-red-400/40 bg-red-500/10 px-3.5 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-60"
                >
                  {deleting ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <Trash2 size={15} aria-hidden />}
                  {deleting ? 'Deleting…' : `Delete selected (${selected.size})`}
                </button>
              </>
            )}
          </div>

          <ul className="space-y-4">
            {shown.map((m) => {
              const isSelected = selected.has(m._id);
              return (
                <li key={m._id} className={`flex gap-4 rounded-2xl glass p-5 transition-colors ${isSelected ? 'border-red-400/50 bg-red-500/[0.04]' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(m._id)}
                    aria-label={`Select message from ${m.name}`}
                    className={`${checkboxCls} mt-1`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-semibold text-foreground">{m.name}</span>
                      {m.subject && <Badge tone="accent">{m.subject}</Badge>}
                      <span className="ml-auto text-xs text-text-subtle">{new Date(m.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted">
                      <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 hover:text-accent-dark"><Mail size={14} aria-hidden /> {m.email}</a>
                      {m.phone && <a href={`tel:${m.phone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-1.5 hover:text-accent-dark"><Phone size={14} aria-hidden /> {m.phone}</a>}
                    </p>
                    <p className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-background/50 p-4 text-sm leading-relaxed text-foreground">{m.message}</p>
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || 'your message'}`)}`}
                      className="btn-outline mt-4 !px-3 !py-1.5 text-xs"
                    >
                      <Reply size={14} aria-hidden /> Reply by email
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
};

export default Messages;
