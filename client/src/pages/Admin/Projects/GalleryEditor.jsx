import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ImagePlus, Loader2, X } from 'lucide-react';
import api from '../../../api/axios';
import { apiError, Card, ErrorNote } from '../../../components/Admin/ui';

const MAX = 12;

/** Extra screenshots for the project page gallery: upload several, reorder, remove. */
const GalleryEditor = ({ images, onChange }) => {
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState('');

  const upload = async (files) => {
    const list = [...files].slice(0, MAX - images.length);
    if (!list.length) return;
    setError('');
    setUploading(list.length);
    const added = [];
    for (const file of list) {
      const body = new FormData();
      body.append('image', file);
      try {
        const { data } = await api.post('/uploads/image?folder=projects', body, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 });
        added.push(data.url);
      } catch (err) {
        setError(apiError(err, `“${file.name}” couldn’t be uploaded.`));
      }
      setUploading((n) => n - 1);
    }
    if (added.length) onChange([...images, ...added]);
  };

  const move = (i, dir) => {
    const next = [...images];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <Card className="space-y-3">
      <div>
        <h2 className="font-heading text-lg font-bold">Gallery</h2>
        <p className="mt-0.5 text-xs text-text-muted">Extra screenshots shown in the project page slider after the main one. Up to {MAX}.</p>
      </div>
      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-2">
          {images.map((src, i) => (
            <li key={src} className="group relative overflow-hidden rounded-lg border border-border">
              <img src={src} alt={`Gallery image ${i + 1}`} className="aspect-[16/10] w-full object-cover object-top" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move image ${i + 1} left`} className="rounded p-1 hover:bg-accent/20 disabled:opacity-30"><ChevronLeft size={14} aria-hidden /></button>
                <button type="button" onClick={() => onChange(images.filter((_, k) => k !== i))} aria-label={`Remove image ${i + 1}`} className="rounded p-1 text-red-300 hover:bg-red-500/20"><X size={14} aria-hidden /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} aria-label={`Move image ${i + 1} right`} className="rounded p-1 hover:bg-accent/20 disabled:opacity-30"><ChevronRight size={14} aria-hidden /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {images.length < MAX && (
        <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong px-4 py-4 text-sm text-text-muted hover:text-foreground ${uploading ? 'pointer-events-none opacity-70' : ''}`}>
          {uploading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <ImagePlus size={18} aria-hidden />}
          {uploading ? `Uploading ${uploading}…` : 'Add images (you can pick several)'}
          <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { upload(e.target.files || []); e.target.value = ''; }} />
        </label>
      )}
      {error && <ErrorNote>{error}</ErrorNote>}
    </Card>
  );
};

export default GalleryEditor;
