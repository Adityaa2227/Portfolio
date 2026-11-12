import React, { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, FileText, Loader2, Upload } from 'lucide-react';
import api from '../../../api/axios';
import { apiError, Badge, Card, ErrorNote, PageHeader, Spinner, fileUrl } from '../../../components/Admin/ui';

const ResumeManager = () => {
  const [resumes, setResumes] = useState(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  const load = () =>
    api.get('/resume/all')
      .then(({ data }) => setResumes(data))
      .catch((err) => { setResumes([]); setError(apiError(err, 'Couldn’t load resumes.')); });

  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError('');
    setDone('');
    const body = new FormData();
    body.append('resume', file);
    try {
      await api.post('/resume', body, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 });
      setFile(null);
      e.target.reset();
      setDone('Uploaded. The site now links to this resume.');
      load();
    } catch (err) {
      setError(apiError(err, 'Upload failed. Make sure the file is a PDF.'));
    } finally {
      setBusy(false);
    }
  };

  const activate = async (r) => {
    try {
      await api.put(`/resume/${r._id}/active`);
      setDone(`“${r.fileName}” is now the active resume.`);
      load();
    } catch (err) {
      setError(apiError(err, 'Couldn’t switch the active resume.'));
    }
  };

  const active = resumes?.find((r) => r.isActive);

  return (
    <>
      <PageHeader title="Resume" description="Upload a PDF to replace the resume behind every Resume button on the site." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-heading text-lg font-bold">Upload a new version</h2>
          <form onSubmit={upload} className="mt-4 space-y-4">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong bg-background/40 px-4 py-10 text-center text-sm text-text-muted hover:border-accent hover:text-foreground">
              <FileText size={30} className="text-accent-dark" aria-hidden />
              {file ? <span className="font-medium text-foreground">{file.name}</span> : 'Choose a PDF file'}
              <input type="file" accept="application/pdf" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
            {error && <ErrorNote>{error}</ErrorNote>}
            {done && <p role="status" className="flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 size={16} aria-hidden /> {done}</p>}
            <button type="submit" disabled={!file || busy} className="btn-primary w-full disabled:opacity-60">
              {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Upload size={16} aria-hidden />}
              {busy ? 'Uploading…' : 'Upload and make active'}
            </button>
          </form>
        </Card>

        <Card>
          <h2 className="font-heading text-lg font-bold">Currently on the site</h2>
          {resumes === null ? (
            <Spinner />
          ) : active ? (
            <div className="mt-4 flex items-center gap-4 rounded-xl border border-accent/40 bg-accent/10 p-4">
              <FileText size={28} className="shrink-0 text-accent-dark" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{active.fileName}</p>
                <p className="text-xs text-text-muted">Uploaded {new Date(active.createdAt).toLocaleString()}</p>
              </div>
              <a href={fileUrl(active.fileUrl)} target="_blank" rel="noopener noreferrer" className="btn-outline !px-3 !py-2" aria-label="Open active resume">
                <ExternalLink size={15} aria-hidden />
              </a>
            </div>
          ) : (
            <p className="mt-4 text-sm text-text-muted">No uploaded resume yet. The site uses the bundled <code className="text-foreground">/resume.pdf</code>.</p>
          )}
        </Card>
      </div>

      {resumes?.length > 0 && (
        <Card className="mt-6">
          <h2 className="font-heading text-lg font-bold">History</h2>
          <ul className="mt-3 divide-y divide-border">
            {resumes.map((r) => (
              <li key={r._id} className="flex flex-wrap items-center gap-3 py-3">
                <FileText size={18} className="text-text-subtle" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{r.fileName}</p>
                  <p className="text-xs text-text-subtle">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
                {r.isActive ? (
                  <Badge tone="success">Active</Badge>
                ) : (
                  <button type="button" onClick={() => activate(r)} className="btn-outline !px-3 !py-1.5 text-xs">Make active</button>
                )}
                <a href={fileUrl(r.fileUrl)} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-text-subtle hover:bg-accent/15 hover:text-foreground" aria-label={`Open ${r.fileName}`}>
                  <ExternalLink size={16} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-text-subtle">
            Older uploads stored on the server&rsquo;s disk may no longer open; new uploads go to ImageKit and stay available.
          </p>
        </Card>
      )}
    </>
  );
};

export default ResumeManager;
