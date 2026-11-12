export const FALLBACK_IMAGE =
  'https://ik.imagekit.io/allymdh57/portfolio/projects/Screenshot_2026-03-06_182234_77LlbCXeQ.png';

export const slugOf = (p) =>
  p.slug || p.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

/** Placeholder links ('#', '*.demo') are hidden instead of sending visitors to dead pages. */
export const isRealLink = (url) => !!url && url !== '#' && !/\.demo(\/|$)/.test(url);

export const metricsOf = (p) => (p.metrics ? p.metrics.split('•').map((m) => m.trim()).filter(Boolean) : []);
