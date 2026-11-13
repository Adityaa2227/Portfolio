import { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';

import staticProjects from '../data/projects.json';
import staticExperience from '../data/experience.json';
import staticBio from '../data/bio.json';
import staticCodingProfiles from '../data/codingProfiles.json';
import staticSkills from '../data/personal.js';
import { slugOf } from '../lib/projects';

/**
 * Where content comes from:
 *  - Projects and resume: the admin panel (backend). The bundled copies are used
 *    until the backend answers, or if it is unreachable.
 *  - Everything else (experience, bio, skills, profiles): edited in code under src/data.
 */

// Date of the resume bundled at /resume.pdf. A resume uploaded in the admin
// panel replaces it only if it was uploaded after this date.
const BUNDLED_RESUME_DATE = '2026-11-12';
const BUNDLED_RESUME = { fileUrl: '/resume.pdf', fileName: 'Aditya_Agarwal_Resume.pdf', isActive: true };

const hasValue = (v) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0);

// Write-ups the bundled copy may have in more detail. Only these are borrowed from it,
// and only when the admin panel left them empty.
const CONTENT_FIELDS = ['shortDescription', 'description', 'problem', 'solution', 'features', 'metrics', 'technologies', 'projectImage'];

/**
 * The admin panel (backend) decides which projects exist, their order, featured/published
 * state and links. An empty link there means "no button", so links are never filled in
 * from the bundled copy.
 */
const mergeProjects = (remote) => {
  const local = new Map(staticProjects.map((p) => [slugOf(p), p]));
  return remote
    .filter((p) => p.isPublished !== false)
    .map((p) => {
      const key = slugOf(p);
      const base = local.get(key) || {};
      // Old seed data stored screenshots as relative paths (/projects/x.png) to files that no
      // longer exist; treat anything that isn't a web URL as missing.
      const own = { ...p, projectImage: /^https?:\/\//i.test(p.projectImage || '') ? p.projectImage : '' };
      const borrowed = Object.fromEntries(CONTENT_FIELDS.filter((f) => !hasValue(own[f]) && hasValue(base[f])).map((f) => [f, base[f]]));
      return { ...own, ...borrowed, slug: key };
    })
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
};

export const usePortfolioData = () => {
  const [projects, setProjects] = useState(staticProjects);
  const [resume, setResume] = useState(BUNDLED_RESUME);
  const [isLiveSynced, setIsLiveSynced] = useState(false);

  useEffect(() => {
    let alive = true;

    api.get('/projects', { timeout: 20000 })
      .then(({ data }) => {
        if (alive && Array.isArray(data) && data.length > 0) {
          setProjects(mergeProjects(data));
          setIsLiveSynced(true);
        }
      })
      .catch(() => { /* keep bundled projects */ });

    api.get('/resume', { timeout: 20000 })
      .then(({ data }) => {
        const uploaded = data?.fileUrl?.startsWith('http') && data.createdAt && data.createdAt.slice(0, 10) >= BUNDLED_RESUME_DATE;
        if (alive && uploaded) setResume(data);
      })
      .catch(() => { /* keep bundled resume */ });

    return () => { alive = false; };
  }, []);

  const featuredProjects = useMemo(() => {
    const featured = projects.filter((p) => p.isFeatured && p.isPublished !== false);
    return featured.length > 0 ? featured : projects.slice(0, 4);
  }, [projects]);

  return {
    projects,
    featuredProjects,
    experience: staticExperience,
    bio: staticBio,
    codingProfiles: staticCodingProfiles,
    skills: staticSkills,
    resume,
    isLiveSynced,
  };
};

export default usePortfolioData;
