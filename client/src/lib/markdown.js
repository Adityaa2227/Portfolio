import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({ gfm: true, breaks: false });

// External links open in a new tab, safely.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && /^https?:\/\//i.test(node.getAttribute('href') || '')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

/** Markdown -> sanitised HTML (safe to put in dangerouslySetInnerHTML). */
export const renderMarkdown = (md = '') => DOMPurify.sanitize(marked.parse(md), { USE_PROFILES: { html: true } });
