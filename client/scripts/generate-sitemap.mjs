// Writes public/sitemap.xml before each build: home, projects list and every published
// project page. Project list comes from the live API, or the bundled data if it's unreachable.
import { readFileSync, writeFileSync } from 'node:fs';

const SITE = 'https://adityaagarwalportfolio.vercel.app';
const API = process.env.VITE_API_URL || 'https://aditya-universal-backend.onrender.com/api/v1/portfolio';

const slugOf = (p) =>
  (p.slug || p.title || '').toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

const loadProjects = async () => {
  try {
    const res = await fetch(`${API}/projects`, { signal: AbortSignal.timeout(20000) });
    const body = await res.json();
    const list = Array.isArray(body) ? body : body.data;
    if (res.ok && Array.isArray(list) && list.length) return { list, source: 'live API' };
  } catch { /* fall back */ }
  const bundled = JSON.parse(readFileSync(new URL('../src/data/projects.json', import.meta.url), 'utf8'));
  return { list: bundled, source: 'bundled data' };
};

const { list, source } = await loadProjects();
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: '/', priority: '1.0' },
  { loc: '/projects', priority: '0.8' },
  ...list
    .filter((p) => p.isPublished !== false && slugOf(p))
    .map((p) => ({ loc: `/projects/${slugOf(p)}`, priority: '0.6' })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`;
writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log(`sitemap.xml: ${urls.length} URLs (projects from ${source})`);
