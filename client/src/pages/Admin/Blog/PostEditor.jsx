import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, ImagePlus, Loader2, Pencil, Save, Undo2, X } from 'lucide-react';
import api from '../../../api/axios';
import { apiError, Card, ErrorNote, Field, inputCls, PageHeader, Spinner, Toggle } from '../../../components/Admin/ui';
import { renderMarkdown } from '../../../lib/markdown';

const EMPTY = { title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: '', isPublished: false };
const toSlug = (s) => s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('write');

  // AI drafting
  const [notes, setNotes] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [aiInfo, setAiInfo] = useState('');
  const [before, setBefore] = useState(null);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get('/posts/admin')
      .then(({ data }) => {
        const p = data.find((x) => x._id === id);
        if (!p) { setError('This post no longer exists.'); return; }
        setForm({ ...EMPTY, ...p, coverImage: p.coverImage || '', tags: (p.tags || []).join(', ') });
      })
      .catch((err) => setError(apiError(err, 'Couldn’t load the post.')))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const preview = useMemo(() => renderMarkdown(form.content), [form.content]);
  const words = form.content.split(/\s+/).filter(Boolean).length;

  const draft = async () => {
    setAiBusy(true);
    setError('');
    try {
      const { data } = await api.post('/posts/ai-draft', { notes }, { timeout: 120000 });
      setBefore(form);
      setForm((f) => ({
        ...f,
        title: data.title || f.title,
        excerpt: data.excerpt || f.excerpt,
        content: data.content || f.content,
        tags: data.tags?.length ? data.tags.join(', ') : f.tags,
      }));
      setAiInfo(`Drafted ${data.content.split(/\s+/).length} words via ${data.generatedBy}. Read it through before publishing.`);
      setTab('preview');
    } catch (err) {
      setError(apiError(err, 'The AI couldn’t draft a post. Try again.'));
    } finally {
      setAiBusy(false);
    }
  };

  const uploadCover = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    const body = new FormData();
    body.append('image', file);
    try {
      const { data } = await api.post('/uploads/image?folder=blog', body, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 });
      setForm((f) => ({ ...f, coverImage: data.url }));
    } catch (err) {
      setError(apiError(err, 'Image upload failed.'));
    } finally {
      setUploading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || undefined,
      excerpt: form.excerpt.trim(),
      content: form.content,
      coverImage: form.coverImage.trim() || null,
      tags: form.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      isPublished: form.isPublished,
    };
    try {
      if (id) await api.put(`/posts/${id}`, payload);
      else await api.post('/posts', payload);
      navigate('/admin/blog');
    } catch (err) {
      setError(apiError(err, 'Couldn’t save the post.'));
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading post…" />;

  return (
    <form onSubmit={save}>
      <Link to="/admin/blog" className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-foreground"><ArrowLeft size={15} aria-hidden /> All posts</Link>
      <PageHeader
        title={id ? 'Edit post' : 'New post'}
        actions={
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Save size={16} aria-hidden />}
            {saving ? 'Saving…' : form.isPublished ? 'Save & publish' : 'Save draft'}
          </button>
        }
      />
      {error && <div className="mb-5"><ErrorNote>{error}</ErrorNote></div>}

      {/* AI drafting */}
      <div className="mb-6 rounded-2xl border border-accent/40 bg-accent/[0.07] p-5">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold"><Sparkles size={18} className="text-accent-dark" aria-hidden /> Draft with AI</h2>
        <p className="mt-1 text-sm text-text-muted">Dump your rough notes: the problem, what you tried, what worked, numbers, code ideas. The AI writes a structured post using only what you give it.</p>
        <label className="mt-3 block">
          <span className="sr-only">Rough notes for the post</span>
          <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. how I cut CI flakiness to 0% at PayPal: migrated 100+ TestNG scenarios to Cucumber, isolated test data per scenario, retried only infra errors, parallel shards…" className={`${inputCls} resize-y`} />
        </label>
        {aiInfo && <p role="status" className="mt-2 text-sm text-emerald-300">{aiInfo}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={draft} disabled={aiBusy || notes.trim().length < 20} className="btn-primary disabled:opacity-60">
            {aiBusy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Wand2 size={16} aria-hidden />} {aiBusy ? 'Writing… (up to a minute)' : 'Generate post'}
          </button>
          {before && <button type="button" onClick={() => { setForm(before); setBefore(null); setAiInfo(''); }} className="btn-outline"><Undo2 size={16} aria-hidden /> Undo</button>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="space-y-4">
            <Field label="Title"><input required value={form.title} onChange={set('title')} className={inputCls} /></Field>
            <Field label="Summary" hint="1–2 sentences shown in the blog list and link previews.">
              <textarea rows={2} maxLength={400} value={form.excerpt} onChange={set('excerpt')} className={`${inputCls} resize-y`} />
            </Field>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Content <span className="font-normal text-text-subtle">(Markdown · {words} words · ~{Math.max(1, Math.round(words / 220))} min read)</span></span>
                <div role="tablist" aria-label="Editor view" className="inline-flex rounded-lg glass p-0.5">
                  {[['write', Pencil, 'Write'], ['preview', Eye, 'Preview']].map(([k, Icon, label]) => (
                    <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium ${tab === k ? 'bg-[#7C3AED] text-white' : 'text-text-muted'}`}>
                      <Icon size={13} aria-hidden /> {label}
                    </button>
                  ))}
                </div>
              </div>
              {tab === 'write' ? (
                <textarea rows={22} value={form.content} onChange={set('content')} placeholder={'## Heading\n\nWrite in Markdown: **bold**, `code`, lists, links and\n\n```js\n// code blocks\n```'} className={`${inputCls} resize-y font-mono text-[13px] leading-relaxed`} />
              ) : (
                <div className="prose-post min-h-[300px] rounded-xl border border-border bg-background/40 p-5" dangerouslySetInnerHTML={{ __html: preview || '<p>Nothing to preview yet.</p>' }} />
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-3">
            <Toggle checked={form.isPublished} onChange={(v) => setForm((f) => ({ ...f, isPublished: v }))} label="Published" description="Visible at /blog. Turn off to keep it as a draft." />
          </Card>
          <Card className="space-y-4">
            <Field label="URL slug" hint={`/blog/${form.slug || toSlug(form.title) || 'post-title'}`}>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: toSlug(e.target.value) }))} placeholder={toSlug(form.title)} className={inputCls} />
            </Field>
            <Field label="Tags" hint="Comma separated, e.g. system design, java, ci">
              <input value={form.tags} onChange={set('tags')} className={inputCls} />
            </Field>
          </Card>
          <Card className="space-y-3">
            <h2 className="font-heading text-base font-bold">Cover image</h2>
            {form.coverImage ? (
              <div className="relative overflow-hidden rounded-xl border border-border">
                <img src={form.coverImage} alt="Cover preview" className="aspect-[1200/630] w-full object-cover" />
                <button type="button" onClick={() => setForm((f) => ({ ...f, coverImage: '' }))} aria-label="Remove cover" className="absolute right-2 top-2 rounded-lg bg-background/80 p-1.5 hover:bg-red-500/80"><X size={15} aria-hidden /></button>
              </div>
            ) : (
              <label className="flex aspect-[1200/630] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong text-sm text-text-muted hover:text-foreground">
                {uploading ? <Loader2 size={22} className="animate-spin" aria-hidden /> : <ImagePlus size={22} aria-hidden />}
                {uploading ? 'Uploading…' : 'Upload an image'}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => uploadCover(e.target.files?.[0])} />
              </label>
            )}
            <div className="rounded-xl border border-dashed border-border-strong p-3">
              <p className="flex items-center gap-1.5 text-sm font-medium text-foreground"><ImagePlus size={14} className="text-accent-dark" aria-hidden /> Upload a cover image</p>
              <p className="mt-0.5 text-xs text-text-muted">1200×630 JPG or PNG looks best — that’s the shape social apps show. AI cover generation was removed because it didn’t match the topic well.</p>
            </div>
            <Field label="…or image URL"><input type="url" value={form.coverImage} onChange={set('coverImage')} placeholder="https://" className={inputCls} /></Field>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default PostEditor;
