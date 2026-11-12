import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Check, EyeOff, MessageSquareQuote, Star, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import { apiError, Badge, Empty, ErrorNote, PageHeader, Spinner } from '../../../components/Admin/ui';

const TABS = [
  { key: 'pending', label: 'Waiting', test: (t) => !t.isApproved },
  { key: 'approved', label: 'Approved', test: (t) => t.isApproved },
  { key: 'all', label: 'All', test: () => true },
];

const TestimonialList = () => {
  const { refreshCounts } = useOutletContext() || {};
  const [reviews, setReviews] = useState(null);
  const [tab, setTab] = useState('pending');
  const [error, setError] = useState('');

  const load = () =>
    api.get('/testimonials/admin')
      .then(({ data }) => setReviews(data))
      .catch((err) => { setReviews([]); setError(apiError(err, 'Couldn’t load reviews.')); });

  useEffect(() => { load(); }, []);

  const setApproved = async (t, isApproved) => {
    setReviews((list) => list.map((x) => (x._id === t._id ? { ...x, isApproved } : x)));
    try {
      await api.put(`/testimonials/${t._id}`, { isApproved });
      refreshCounts?.();
    } catch (err) {
      setError(apiError(err, 'Couldn’t update the review.'));
      load();
    }
  };

  const remove = async (t) => {
    if (!window.confirm(`Delete the review from ${t.name}?`)) return;
    try {
      await api.delete(`/testimonials/${t._id}`);
      setReviews((list) => list.filter((x) => x._id !== t._id));
      refreshCounts?.();
    } catch (err) {
      setError(apiError(err, 'Couldn’t delete the review.'));
    }
  };

  const current = TABS.find((x) => x.key === tab);
  const shown = (reviews || []).filter(current.test);

  return (
    <>
      <PageHeader title="Reviews" description="Reviews submitted on the site stay hidden until you approve them." />

      <div role="tablist" aria-label="Filter reviews" className="mb-5 inline-flex rounded-xl glass p-1">
        {TABS.map(({ key, label, test }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === key ? 'bg-accent text-white' : 'text-text-muted hover:text-foreground'}`}
          >
            {label}
            {reviews && <span className="ml-1.5 opacity-70">{reviews.filter(test).length}</span>}
          </button>
        ))}
      </div>

      {error && <div className="mb-4"><ErrorNote>{error}</ErrorNote></div>}

      {reviews === null ? (
        <Spinner label="Loading reviews…" />
      ) : shown.length === 0 ? (
        <Empty Icon={MessageSquareQuote} title={tab === 'pending' ? 'Nothing waiting for approval' : 'No reviews here'}>
          {tab === 'pending' ? 'When someone submits a review on the site, it shows up here.' : null}
        </Empty>
      ) : (
        <ul className="space-y-4">
          {shown.map((t) => (
            <li key={t._id} className="rounded-2xl glass p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-semibold text-foreground">{t.name}</span>
                <span className="text-sm text-text-muted">{t.role}</span>
                <span className="flex" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating || 5 }).map((_, i) => <Star key={i} size={13} className="fill-amber-400 text-amber-400" aria-hidden />)}
                </span>
                {t.isApproved ? <Badge tone="success">Approved</Badge> : <Badge tone="warning">Waiting</Badge>}
                <span className="ml-auto text-xs text-text-subtle">{new Date(t.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-text-muted">&ldquo;{t.message}&rdquo;</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {t.isApproved ? (
                  <button type="button" onClick={() => setApproved(t, false)} className="btn-outline !px-3 !py-1.5 text-xs"><EyeOff size={14} aria-hidden /> Hide from site</button>
                ) : (
                  <button type="button" onClick={() => setApproved(t, true)} className="btn-primary !px-3 !py-1.5 text-xs"><Check size={14} aria-hidden /> Approve</button>
                )}
                <button type="button" onClick={() => remove(t)} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10">
                  <Trash2 size={14} aria-hidden /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default TestimonialList;
