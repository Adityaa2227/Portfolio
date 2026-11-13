import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImagePlus, Loader2, Save, X } from 'lucide-react';
import api from '../../../api/axios';
import AiDraftPanel from './AiDraftPanel';
import GalleryEditor from './GalleryEditor';
import { apiError, Card, ErrorNote, Field, inputCls, PageHeader, Spinner, Toggle, fileUrl } from '../../../components/Admin/ui';

const EMPTY = {
  title: '',
  slug: '',
  category: 'Full Stack',
  shortDescription: '',
  description: '',
  problem: '',
  solution: '',
  features: '',
  metrics: '',
  technologies: '',
  githubLink: '',
  liveLink: '',
  youtubeVideoUrl: '',
  projectImage: '',
  isFeatured: false,
  isPublished: true,
};

const toSlug = (s) => s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/projects/admin')
      .then(({ data }) => {
        setCategories([...new Set(data.map((p) => p.category).filter(Boolean))]);
        if (!id) return;
        const p = data.find((x) => x._id === id);
        if (!p) { setError('This project no longer exists.'); return; }
        setForm({
          ...EMPTY,
          ...Object.fromEntries(Object.keys(EMPTY).map((k) => [k, p[k] ?? EMPTY[k]])),
          features: (p.features || []).join('\n'),
          metrics: (p.metrics || '').split('•').map((m) => m.trim()).filter(Boolean).join('\n'),
          technologies: (p.technologies || []).join(', '),
          youtubeVideoUrl: p.youtubeVideoUrl || '',
          projectImage: p.projectImage || '',
        });
        setGallery(p.galleryImages || []);
      })
      .catch((err) => setError(apiError(err, 'Couldn’t load the project.')))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const preview = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : fileUrl(form.projectImage)), [imageFile, form.projectImage]);
  const techList = form.technologies.split(',').map((t) => t.trim()).filter(Boolean);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const body = new FormData();
    const payload = {
      ...form,
      slug: form.slug.trim() || toSlug(form.title),
      features: form.features.split('\n').map((f) => f.trim()).filter(Boolean).join('\n'),
      metrics: form.metrics.split('\n').map((m) => m.trim()).filter(Boolean).join(' • '),
      technologies: techList.join(','),
    };
    Object.entries(payload).forEach(([k, v]) => body.append(k, String(v)));
    body.append('galleryImages', JSON.stringify(gallery));
    if (imageFile) body.append('image', imageFile);

    try {
      const opts = { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 };
      if (id) await api.put(`/projects/${id}`, body, opts);
      else await api.post('/projects', body, opts);
      navigate('/admin/projects');
    } catch (err) {
      setError(apiError(err, 'Couldn’t save the project. Check the fields and try again.'));
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading project…" />;

  return (
    <form onSubmit={submit}>
      <Link to="/admin/projects" className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-foreground">
        <ArrowLeft size={15} aria-hidden /> All projects
      </Link>
      <PageHeader
        title={id ? `Edit ${form.title || 'project'}` : 'New project'}
        description="Fields left empty are simply not shown on the project page."
        actions={
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
            {saving ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Save size={16} aria-hidden />}
            {saving ? 'Saving…' : id ? 'Save changes' : 'Create project'}
          </button>
        }
      />
      {error && <div className="mb-5"><ErrorNote>{error}</ErrorNote></div>}

      <AiDraftPanel form={form} setForm={setForm} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="space-y-4">
            <h2 className="font-heading text-lg font-bold">Basics</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <input required value={form.title} onChange={set('title')} placeholder="e.g. JobGrid" className={inputCls} />
              </Field>
              <Field label="Category" hint="Used for the filters on the projects page.">
                <input required list="project-categories" value={form.category} onChange={set('category')} className={inputCls} />
                <datalist id="project-categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
              </Field>
            </div>
            <Field label="URL slug" hint={`Page address: /projects/${form.slug || toSlug(form.title) || 'project-name'}. Leave empty to use the title.`}>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: toSlug(e.target.value) }))} placeholder={toSlug(form.title)} className={inputCls} />
            </Field>
            <Field label="Card description" hint="One or two sentences shown on project cards.">
              <textarea rows={2} value={form.shortDescription} onChange={set('shortDescription')} className={`${inputCls} resize-y`} />
            </Field>
            <Field label="Overview" hint="The full description on the project page.">
              <textarea required rows={4} value={form.description} onChange={set('description')} className={`${inputCls} resize-y`} />
            </Field>
          </Card>

          <Card className="space-y-4">
            <h2 className="font-heading text-lg font-bold">Case study</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="The problem">
                <textarea rows={4} value={form.problem} onChange={set('problem')} className={`${inputCls} resize-y`} />
              </Field>
              <Field label="What I built">
                <textarea rows={4} value={form.solution} onChange={set('solution')} className={`${inputCls} resize-y`} />
              </Field>
            </div>
            <Field label="Key features" hint="One feature per line.">
              <textarea rows={5} value={form.features} onChange={set('features')} className={`${inputCls} resize-y`} />
            </Field>
            <Field label="Impact numbers" hint="One per line, e.g. “500+ daily active users”.">
              <textarea rows={3} value={form.metrics} onChange={set('metrics')} className={`${inputCls} resize-y`} />
            </Field>
            <Field label="Technologies" hint="Comma separated, e.g. React, Node.js, MongoDB">
              <input value={form.technologies} onChange={set('technologies')} className={inputCls} />
            </Field>
            {techList.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {techList.map((t) => <li key={t} className="rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs text-accent-dark">{t}</li>)}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="font-heading text-lg font-bold">Screenshot</h2>
            <div className="relative overflow-hidden rounded-xl border border-dashed border-border-strong bg-background/40">
              {preview ? (
                <>
                  <img src={preview} alt="Project screenshot preview" className="aspect-[16/10] w-full object-cover object-top" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setForm((f) => ({ ...f, projectImage: '' })); }}
                    aria-label="Remove screenshot"
                    className="absolute right-2 top-2 rounded-lg bg-background/80 p-1.5 text-foreground hover:bg-red-500/80"
                  >
                    <X size={15} aria-hidden />
                  </button>
                </>
              ) : (
                <label className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-2 text-sm text-text-muted hover:text-foreground">
                  <ImagePlus size={26} aria-hidden />
                  Upload an image
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                </label>
              )}
            </div>
            {preview && (
              <label className="btn-outline w-full cursor-pointer !py-2">
                <ImagePlus size={15} aria-hidden /> Replace image
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </label>
            )}
            <Field label="…or image URL">
              <input type="url" value={imageFile ? '' : form.projectImage} disabled={Boolean(imageFile)} onChange={set('projectImage')} placeholder="https://" className={inputCls} />
            </Field>
          </Card>

          <GalleryEditor images={gallery} onChange={setGallery} />

          <Card className="space-y-4">
            <h2 className="font-heading text-lg font-bold">Project page buttons</h2>
            <p className="text-xs text-text-muted">Each button appears only when its link is filled in.</p>
            <Field label="Visit Site"><input type="url" value={form.liveLink} onChange={set('liveLink')} placeholder="https://" className={inputCls} /></Field>
            <Field label="Visit GitHub"><input type="url" value={form.githubLink} onChange={set('githubLink')} placeholder="https://github.com/…" className={inputCls} /></Field>
            <Field label="Watch Demo" hint="Any video link. YouTube videos also play in the page gallery.">
              <input type="url" value={form.youtubeVideoUrl} onChange={set('youtubeVideoUrl')} placeholder="https://youtube.com/watch?v=…" className={inputCls} />
            </Field>
          </Card>

          <Card className="space-y-3">
            <h2 className="font-heading text-lg font-bold">Visibility</h2>
            <Toggle checked={form.isPublished} onChange={(v) => setForm((f) => ({ ...f, isPublished: v }))} label="Published" description="Show this project on the site." />
            <Toggle checked={form.isFeatured} onChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))} label="Featured" description="Include it in the homepage carousel." />
          </Card>
        </div>
      </div>
    </form>
  );
};

export default ProjectForm;
