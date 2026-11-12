import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, FileText, MessageSquareQuote, Mail, ArrowRight, Plus, Code2 } from 'lucide-react';
import api from '../../api/axios';
import { Card, PageHeader, Badge, fileUrl } from '../../components/Admin/ui';

const settle = (p) => p.then((r) => r.data).catch(() => null);

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      settle(api.get('/projects/admin')),
      settle(api.get('/resume/all')),
      settle(api.get('/testimonials/admin')),
      settle(api.get('/contact')),
    ]).then(([projects, resumes, reviews, messages]) => setData({ projects, resumes, reviews, messages }));
  }, []);

  const projects = data?.projects || [];
  const reviews = data?.reviews || [];
  const messages = data?.messages || [];
  const activeResume = (data?.resumes || []).find((r) => r.isActive);
  const pending = reviews.filter((r) => !r.isApproved).length;

  const tiles = [
    { Icon: FolderGit2, label: 'Projects', value: projects.length, sub: `${projects.filter((p) => p.isPublished).length} published · ${projects.filter((p) => p.isFeatured).length} featured`, to: '/admin/projects' },
    { Icon: MessageSquareQuote, label: 'Reviews waiting', value: pending, sub: `${reviews.length - pending} approved`, to: '/admin/reviews', highlight: pending > 0 },
    { Icon: Mail, label: 'Messages', value: messages.length, sub: messages[0] ? `Latest from ${messages[0].name}` : 'No messages yet', to: '/admin/messages' },
    { Icon: FileText, label: 'Resume', value: activeResume ? 'Uploaded' : 'Bundled', sub: activeResume ? new Date(activeResume.createdAt).toLocaleDateString() : 'Using /resume.pdf', to: '/admin/resume' },
  ];

  return (
    <>
      <PageHeader
        title="Overview"
        description="Projects, resume, reviews and messages are managed here. Everything else (experience, skills, bio, honors) is edited in code under client/src/data."
        actions={<Link to="/admin/projects/new" className="btn-primary"><Plus size={16} aria-hidden /> New project</Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(({ Icon, label, value, sub, to, highlight }) => (
          <Link key={label} to={to} className={`group rounded-2xl glass p-5 transition-[border-color,box-shadow] hover:border-accent/70 hover:glow ${highlight ? 'border-accent/70' : ''}`}>
            <div className="flex items-center justify-between">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent-dark"><Icon size={19} aria-hidden /></span>
              <ArrowRight size={16} className="text-text-subtle transition-transform group-hover:translate-x-1 group-hover:text-foreground" aria-hidden />
            </div>
            <p className="mt-4 font-heading text-3xl font-bold text-foreground">{data ? value : '–'}</p>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="mt-1 truncate text-xs text-text-muted">{data ? sub : 'Loading…'}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold">Latest messages</h2>
            <Link to="/admin/messages" className="text-sm text-accent-dark hover:underline">All messages</Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {messages.slice(0, 4).map((m) => (
              <li key={m._id} className="py-3">
                <p className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-foreground">{m.name}</span>
                  <span className="shrink-0 text-xs text-text-subtle">{new Date(m.createdAt).toLocaleDateString()}</span>
                </p>
                <p className="mt-0.5 line-clamp-1 text-sm text-text-muted">{m.subject ? `${m.subject}: ` : ''}{m.message}</p>
              </li>
            ))}
            {data && messages.length === 0 && <li className="py-3 text-sm text-text-muted">No messages yet.</li>}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold">Reviews waiting for approval</h2>
            <Link to="/admin/reviews" className="text-sm text-accent-dark hover:underline">Review them</Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {reviews.filter((r) => !r.isApproved).slice(0, 4).map((r) => (
              <li key={r._id} className="py-3">
                <p className="flex items-center gap-2 text-sm"><span className="font-medium text-foreground">{r.name}</span><Badge tone="warning">Pending</Badge></p>
                <p className="mt-0.5 line-clamp-1 text-sm text-text-muted">{r.message}</p>
              </li>
            ))}
            {data && pending === 0 && <li className="py-3 text-sm text-text-muted">Nothing waiting. New reviews show up here.</li>}
          </ul>
        </Card>
      </div>

      <Card className="mt-6 flex items-start gap-4">
        <Code2 size={22} className="mt-0.5 shrink-0 text-accent-dark" aria-hidden />
        <div className="text-sm text-text-muted">
          <p className="font-medium text-foreground">Edited in code</p>
          <p className="mt-1">
            Experience: <code className="text-foreground">src/data/experience.json</code> · Skills: <code className="text-foreground">src/components/Public/Skills.jsx</code> ·
            Honors &amp; profiles: <code className="text-foreground">src/data/codingProfiles.json</code> · Bio: <code className="text-foreground">src/data/bio.json</code>
          </p>
          {activeResume && (
            <p className="mt-2">Active resume: <a href={fileUrl(activeResume.fileUrl)} target="_blank" rel="noopener noreferrer" className="text-accent-dark hover:underline">{activeResume.fileName}</a></p>
          )}
        </div>
      </Card>
    </>
  );
};

export default Dashboard;
