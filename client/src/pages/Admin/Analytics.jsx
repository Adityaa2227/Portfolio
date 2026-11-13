import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3, Clock, Download, Eye, FileText, Globe, Mail, MessageSquareQuote, MousePointerClick, RefreshCw, Repeat, Users,
} from 'lucide-react';
import api from '../../api/axios';
import { apiError, Card, Empty, ErrorNote, PageHeader, Spinner } from '../../components/Admin/ui';

const BAR = '#8B5CF6'; // validated against the dark surface (dataviz validator: all checks pass)
const BAR_HOVER = '#A78BFA';
const RANGES = [7, 30, 90, 365];

const fmtDuration = (s) => (s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`);
const fmtNum = (n) => (n ?? 0).toLocaleString('en-IN');
const EVENT_LABEL = {
  pageview: 'viewed', project_view: 'opened project', post_view: 'read post', resume_download: 'downloaded resume',
  outbound: 'clicked', section_view: 'saw section', contact_submit: 'sent a message', review_submit: 'left a review',
};

const Stat = ({ Icon, label, value, sub, change }) => (
  <div className="rounded-2xl glass p-4">
    <p className="flex items-center gap-2 text-xs font-medium text-text-muted"><Icon size={14} aria-hidden /> {label}</p>
    <p className="mt-2 font-heading text-2xl font-bold text-foreground">{value}</p>
    <p className="mt-0.5 text-xs text-text-subtle">
      {change != null && (
        <span className={change >= 0 ? 'text-emerald-300' : 'text-red-300'}>{change >= 0 ? '▲' : '▼'} {Math.abs(change)}% </span>
      )}
      {sub}
    </p>
  </div>
);

/** Single-series column chart with a hover tooltip. Bars: 4px rounded tops, 2px gaps, baseline-anchored. */
const Columns = ({ data, labelOf, valueOf, title, emptyText, ariaUnit, tooltipOf, height = 160 }) => {
  const [hover, setHover] = useState(null);
  const max = Math.max(1, ...data.map(valueOf));
  if (!data.length || max === 0) return <p className="py-10 text-center text-sm text-text-muted">{emptyText}</p>;
  const ticks = [max, Math.round(max / 2), 0];
  return (
    <figure>
      <figcaption className="sr-only">{title}</figcaption>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between py-0 text-right text-[10px] text-text-subtle tabular-nums" style={{ height }} aria-hidden>
          {ticks.map((t, i) => <span key={i}>{fmtNum(t)}</span>)}
        </div>
        <div className="relative flex-1">
          {/* recessive gridlines */}
          <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col justify-between" style={{ height }}>
            {ticks.map((_, i) => <span key={i} className="border-t border-border/60" />)}
          </div>
          <ul className="relative flex items-end" style={{ height, gap: 2 }}>
            {data.map((d, i) => {
              const v = valueOf(d);
              return (
                <li
                  key={labelOf(d, i)}
                  className="relative flex h-full flex-1 items-end"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  tabIndex={0}
                  aria-label={`${labelOf(d, i)}: ${fmtNum(v)} ${ariaUnit}`}
                >
                  <span
                    className="block w-full transition-colors"
                    style={{ height: `${(v / max) * 100}%`, minHeight: v ? 2 : 0, background: hover === i ? BAR_HOVER : BAR, borderRadius: '4px 4px 0 0' }}
                  />
                  {hover === i && (
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border-strong bg-surface px-2.5 py-1.5 text-xs text-foreground shadow-xl">
                      {tooltipOf(d, i)}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </figure>
  );
};

/** Ranked list with magnitude bars (one hue), counts in text ink. */
const RankList = ({ title, Icon, rows, nameOf = (r) => r.name, empty = 'No data yet.' }) => {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <Card>
      <h2 className="flex items-center gap-2 font-heading text-base font-bold"><Icon size={16} className="text-accent-dark" aria-hidden /> {title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-text-muted">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {rows.map((r) => (
            <li key={String(r.name)}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate text-foreground" title={nameOf(r)}>{nameOf(r)}</span>
                <span className="shrink-0 tabular-nums text-text-muted">
                  {fmtNum(r.count)}{r.visitors != null && r.visitors !== r.count ? <span className="text-text-subtle"> · {fmtNum(r.visitors)} ppl</span> : null}
                </span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-surface-muted" aria-hidden>
                <div className="h-full rounded-full" style={{ width: `${(r.count / max) * 100}%`, background: BAR }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

const Analytics = () => {
  const [days, setDays] = useState(30);
  const [nonce, setNonce] = useState(0); // bumped by the refresh button
  const [result, setResult] = useState({ key: null, data: null, error: '' });
  const [showTable, setShowTable] = useState(false);

  // A request per (range, refresh); "loading" = the latest result is for an older request.
  const key = `${days}:${nonce}`;
  useEffect(() => {
    let alive = true;
    api.get('/analytics/summary', { params: { days }, timeout: 30000 })
      .then(({ data: res }) => { if (alive) setResult({ key, data: res, error: '' }); })
      .catch((err) => { if (alive) setResult((r) => ({ key, data: r.data, error: apiError(err, 'Couldn’t load analytics.') })); });
    return () => { alive = false; };
  }, [days, key]);
  const loading = result.key !== key;
  const { data, error } = result;
  const load = () => setNonce((n) => n + 1);

  // Fill missing days with zero so the time axis is continuous
  const daily = useMemo(() => {
    if (!data) return [];
    const byDate = new Map(data.daily.map((d) => [d.date, d]));
    const out = [];
    const n = Math.min(days, 90);
    const end = new Date(data.range.since).getTime() + data.range.days * 864e5; // when the summary was made
    for (let i = n - 1; i >= 0; i -= 1) {
      const date = new Date(end - i * 864e5).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
      out.push(byDate.get(date) || { date, views: 0, visitors: 0 });
    }
    return out;
  }, [data, days]);

  const hours = useMemo(() => {
    const byHour = new Map((data?.hours || []).map((h) => [h.hour, h.count]));
    return Array.from({ length: 24 }, (_, h) => ({ hour: h, count: byHour.get(h) || 0 }));
  }, [data]);

  const t = data?.totals;

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Who visits, where they come from and what they look at. Cookie-free: no IP addresses or personal data are stored. Your own visits on localhost aren't counted."
        actions={
          <div className="flex items-center gap-2">
            <div role="tablist" aria-label="Date range" className="inline-flex rounded-xl glass p-1">
              {RANGES.map((r) => (
                <button key={r} type="button" role="tab" aria-selected={days === r} onClick={() => setDays(r)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${days === r ? 'bg-[#7C3AED] text-white' : 'text-text-muted hover:text-foreground'}`}>
                  {r === 365 ? '1y' : `${r}d`}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => load()} aria-label="Refresh" className="btn-outline !px-3 !py-2"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} aria-hidden /></button>
          </div>
        }
      />
      {error && <div className="mb-4"><ErrorNote>{error}</ErrorNote></div>}
      {!data ? (
        loading ? <Spinner label="Loading analytics…" /> : null
      ) : t.pageviews === 0 && t.resumeDownloads === 0 ? (
        <Empty Icon={BarChart3} title="No visits recorded yet">
          Data appears here once the updated site is live and people visit it. Visits from localhost aren&rsquo;t counted.
        </Empty>
      ) : (
        <div className={loading ? 'opacity-60 transition-opacity' : ''}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat Icon={Users} label="Visitors" value={fmtNum(t.visitors)} change={t.change.visitors} sub={`${fmtNum(t.newVisitors)} new · ${fmtNum(t.returningVisitors)} returning`} />
            <Stat Icon={Eye} label="Page views" value={fmtNum(t.pageviews)} change={t.change.pageviews} sub={`${t.pagesPerSession} pages per visit`} />
            <Stat Icon={Clock} label="Avg. time on page" value={fmtDuration(t.avgTimeOnPageSec)} sub={`scrolled ${t.avgScrollPct}% on average`} />
            <Stat Icon={Repeat} label="Bounce rate" value={`${t.bounceRate}%`} sub="visits that saw only one page" />
            <Stat Icon={Download} label="Resume downloads" value={fmtNum(t.resumeDownloads)} sub="opens + downloads" />
            <Stat Icon={Mail} label="Contact messages" value={fmtNum(t.contacts)} sub="sent from the form" />
            <Stat Icon={MessageSquareQuote} label="Reviews submitted" value={fmtNum(t.reviews)} sub="waiting or approved" />
            <Stat Icon={MousePointerClick} label="Outbound clicks" value={fmtNum(t.outboundClicks)} sub="GitHub, LinkedIn, demos, email…" />
          </div>

          <Card className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-base font-bold">Daily page views{days > 90 ? ' (last 90 days)' : ''}</h2>
              <button type="button" onClick={() => setShowTable((v) => !v)} className="text-xs text-accent-dark hover:underline">
                {showTable ? 'Show chart' : 'Show as table'}
              </button>
            </div>
            <div className="mt-4">
              {showTable ? (
                <div className="max-h-72 overflow-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs text-text-subtle"><tr><th className="py-1 font-medium">Date</th><th className="py-1 text-right font-medium">Views</th><th className="py-1 text-right font-medium">Visitors</th></tr></thead>
                    <tbody>{[...daily].reverse().map((d) => (
                      <tr key={d.date} className="border-t border-border"><td className="py-1.5 text-text-muted">{d.date}</td><td className="py-1.5 text-right tabular-nums">{d.views}</td><td className="py-1.5 text-right tabular-nums">{d.visitors}</td></tr>
                    ))}</tbody>
                  </table>
                </div>
              ) : (
                <>
                  <Columns
                    data={daily}
                    title="Daily page views"
                    ariaUnit="views"
                    emptyText="No views in this period."
                    labelOf={(d) => d.date}
                    valueOf={(d) => d.views}
                    tooltipOf={(d) => `${new Date(`${d.date}T00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · ${d.views} views · ${d.visitors} visitors`}
                  />
                  <div className="mt-1.5 flex justify-between pl-8 text-[10px] text-text-subtle" aria-hidden>
                    <span>{daily[0]?.date}</span><span>{daily[daily.length - 1]?.date}</span>
                  </div>
                </>
              )}
            </div>
          </Card>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <RankList title="Traffic sources" Icon={Globe} rows={data.sources} empty="No visits yet." />
            <RankList title="Top projects opened" Icon={BarChart3} rows={data.topProjects} empty="No project pages opened yet." />
            <RankList title="Top pages" Icon={Eye} rows={data.topPages} />
            <RankList title="Countries (from timezone)" Icon={Globe} rows={data.countries} />
            <RankList title="Homepage sections seen" Icon={Eye} rows={data.sections} empty="No section data yet." />
            <RankList title="Outbound clicks" Icon={MousePointerClick} rows={data.outbound} empty="No outbound clicks yet." />
            <RankList title="Devices" Icon={Users} rows={data.devices} />
            <RankList title="Browsers" Icon={Users} rows={data.browsers} />
            <RankList title="Operating systems" Icon={Users} rows={data.oses} />
            {data.referrers.length > 0 && <RankList title="Referring websites" Icon={Globe} rows={data.referrers} />}
            {data.topPosts.length > 0 && <RankList title="Top blog posts" Icon={FileText} rows={data.topPosts} />}
          </div>

          <Card className="mt-6">
            <h2 className="font-heading text-base font-bold">Visits by hour of day (IST)</h2>
            <div className="mt-4">
              <Columns
                data={hours}
                height={110}
                title="Page views by hour of day"
                ariaUnit="views"
                emptyText="No views yet."
                labelOf={(h) => `${h.hour}:00`}
                valueOf={(h) => h.count}
                tooltipOf={(h) => `${String(h.hour).padStart(2, '0')}:00–${String(h.hour).padStart(2, '0')}:59 · ${h.count} views`}
              />
              <div className="mt-1.5 flex justify-between pl-8 text-[10px] text-text-subtle" aria-hidden><span>00:00</span><span>12:00</span><span>23:00</span></div>
            </div>
          </Card>

          <Card className="mt-6">
            <h2 className="font-heading text-base font-bold">Live activity</h2>
            <ul className="mt-3 divide-y divide-border">
              {data.recent.map((e) => (
                <li key={e._id} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 py-2 text-sm">
                  <span className="w-28 shrink-0 text-xs text-text-subtle tabular-nums">{new Date(e.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-text-muted">
                    {e.isNewVisitor ? 'New visitor' : 'Returning visitor'}
                    {e.country ? ` from ${e.country}` : ''} ({e.device}, {e.browser})
                  </span>
                  <span className="text-foreground">
                    {EVENT_LABEL[e.type] || e.type} <strong className="font-medium">{e.label || e.target || e.path}</strong>
                  </span>
                  {e.type === 'pageview' && e.source !== 'direct' && <span className="text-xs text-text-subtle">via {e.source}</span>}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </>
  );
};

export default Analytics;
