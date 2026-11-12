import { useEffect } from 'react';

export const SITE_URL = 'https://adityaagarwalportfolio.vercel.app';
const DEFAULT_TITLE = 'Aditya Agarwal — Software Engineer';
const DEFAULT_DESCRIPTION =
  'Aditya Agarwal, Software Engineer (backend, full-stack and GenAI). Ex-SWE Intern at PayPal, B.Tech CSE at BIT Mesra. Projects, experience and contact.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

const setMeta = (attr, key, value) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

const setCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

/**
 * Sets the tab title, search description, canonical URL and preview tags for a page.
 * Google reads these after the page renders. LinkedIn/WhatsApp read only the static
 * tags in index.html, so shared links always get the site-wide card.
 */
export const usePageMeta = ({ title, description, path = '/', image } = {}) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | Aditya Agarwal` : DEFAULT_TITLE;
    const desc = (description || DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim().slice(0, 300);
    const url = `${SITE_URL}${path}`;
    const img = image && /^https?:\/\//.test(image) ? image : DEFAULT_IMAGE;

    document.title = fullTitle;
    setMeta('name', 'description', desc);
    setCanonical(url);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', img);
  }, [title, description, path, image]);
};
