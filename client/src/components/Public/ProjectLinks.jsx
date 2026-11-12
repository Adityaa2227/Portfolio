import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Github } from 'lucide-react';
import { isRealLink, slugOf } from '../../lib/projects';

export const ProjectLinks = ({ project, compact = false }) => (
  <div className={`flex flex-wrap items-center ${compact ? 'gap-4 text-sm' : 'gap-5 text-sm'}`}>
    <Link to={`/projects/${slugOf(project)}`} className="link-underline font-semibold text-foreground hover:text-accent">
      Case study
    </Link>
    {isRealLink(project.liveLink) && (
      <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-text-muted hover:text-accent">
        Live site <ArrowUpRight size={14} aria-hidden />
      </a>
    )}
    {isRealLink(project.githubLink) && (
      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-text-muted hover:text-accent">
        <Github size={14} aria-hidden /> Code
      </a>
    )}
  </div>
);

export default ProjectLinks;
