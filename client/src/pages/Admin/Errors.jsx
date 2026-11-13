import React, { useEffect, useState } from 'react';
import { Bug, CheckCircle2, ChevronDown, RotateCcw, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import { apiError, Badge, Empty, ErrorNote, PageHeader, Spinner } from '../../components/Admin/ui';

const Errors = () => {
  const [errors, setErrors] = useState(null);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    api.get('/errors')
      .then(({ data }) => setErrors(data))
      .catch((err) => { setErrors([]); setError(apiError(err, 'Couldn’t load errors.')); });
  }, []);

  const setResolved = async (e, resolved) => {
    try {
      const { data } = await api.put(`/errors/${e._id}`, { resolved });
      setErrors((list) => list.map((x) => (x._id === e._id ? data : x)));
    } catch (err) { setError(apiError(err, 'Couldn’t update.')); }
  };

  const remove = async (e) => {
    try {
      await api.delete(`/errors/${e._id}`);
      setErrors((list) => list.filter((x) => x._id !== e._id));
    } catch (err) { setError(apiError(err, 'Couldn’t delete.')); }
  };

  const open = (errors || []).filter((e) => !e.resolved).length;

  return (
    <>
      <PageHeader
        title="Errors"
        description="Crashes in visitors’ browsers and server errors, grouped by type. You get an email when a new one appears (at most once a day per error; switch off in Settings)."
      />
      {error && <div className="mb-4"><ErrorNote>{error}</ErrorNote></div>}
      {errors === null ? (
        <Spinner label="Loading errors…" />
      ) : errors.length === 0 ? (
        <Empty Icon={CheckCircle2} title="No errors recorded">Nothing has gone wrong on the site so far.</Empty>
      ) : (
        <>
          <p className="mb-4 text-sm text-text-muted">{open} open · {errors.length - open} resolved</p>
          <ul className="space-y-3">
            {errors.map((e) => (
              <li key={e._id} className={`rounded-2xl glass p-4 ${e.resolved ? 'opacity-60' : ''}`}>
                <div className="flex flex-wrap items-start gap-3">
                  <Bug size={18} className={`mt-0.5 shrink-0 ${e.resolved ? 'text-text-subtle' : 'text-red-300'}`} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="break-words font-medium text-foreground">{e.message}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                      <Badge tone={e.source === 'api' ? 'warning' : 'accent'}>{e.source === 'api' ? 'Server' : 'Browser'}</Badge>
                      <span>{e.count} time{e.count === 1 ? '' : 's'}</span>
                      <span>· last {new Date(e.lastSeen).toLocaleString()}</span>
                      {e.path && <span className="font-mono">· {e.path}</span>}
                      {e.resolved && <Badge tone="success">Resolved</Badge>}
                    </p>
                    {e.browsers?.length > 0 && <p className="mt-1 text-xs text-text-subtle">Seen on: {e.browsers.join(', ')}</p>}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {e.stack && (
                      <button type="button" onClick={() => setOpenId(openId === e._id ? null : e._id)} aria-expanded={openId === e._id} className="btn-outline !px-2.5 !py-1.5 text-xs">
                        <ChevronDown size={14} className={openId === e._id ? 'rotate-180' : ''} aria-hidden /> Details
                      </button>
                    )}
                    {e.resolved ? (
                      <button type="button" onClick={() => setResolved(e, false)} className="btn-outline !px-2.5 !py-1.5 text-xs"><RotateCcw size={14} aria-hidden /> Reopen</button>
                    ) : (
                      <button type="button" onClick={() => setResolved(e, true)} className="btn-primary !px-2.5 !py-1.5 text-xs"><CheckCircle2 size={14} aria-hidden /> Resolved</button>
                    )}
                    <button type="button" onClick={() => remove(e)} aria-label="Delete" className="rounded-lg p-2 text-red-300 hover:bg-red-500/10"><Trash2 size={15} aria-hidden /></button>
                  </div>
                </div>
                {openId === e._id && (
                  <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-background/70 p-3 font-mono text-[11px] leading-relaxed text-text-muted">{e.stack}</pre>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default Errors;
