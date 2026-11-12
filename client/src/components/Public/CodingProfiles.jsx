import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Section from './Section';
import codingData from '../../data/codingProfiles.json';

export const CodingProfiles = () => {
  const { profiles = [], achievements = [] } = codingData;

  return (
    <Section id="achievements" name="Recognition" title="Hackathon wins and a steady contest habit.">
      <ul className="grid grid-cols-2 lg:grid-cols-4 border-y border-border">
        {profiles.map((p, i) => (
          <li
            key={p.name}
            className={`border-border ${i % 2 ? 'border-l' : ''} ${i > 0 ? 'lg:border-l' : ''} ${i > 1 ? 'border-t lg:border-t-0' : ''}`}
          >
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col gap-1 p-5 transition-colors hover:bg-surface"
            >
              <span className="flex items-center justify-between text-sm text-text-muted">
                {p.name}
                <ArrowUpRight size={15} className="text-text-subtle transition-colors group-hover:text-accent" aria-hidden />
              </span>
              <span className="mt-2 font-heading text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-accent">
                {p.stats.replace('⭐', '★')}
              </span>
              <span className="font-mono text-xs text-text-subtle">@{p.handle}</span>
            </a>
          </li>
        ))}
      </ul>

      <ol className="mt-14">
        {achievements.map((a) => (
          <li key={a.title} className="grid gap-2 border-b border-border py-6 first:pt-0 sm:grid-cols-[8rem_1fr] sm:gap-8">
            <span className="font-mono text-sm text-accent">{a.year}</span>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">{a.title.replace(' — ', ', ')}</h3>
              <p className="text-sm text-text-subtle">{a.organization}</p>
              <p className="mt-2 max-w-[65ch] leading-relaxed text-text-muted">{a.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
};

export default CodingProfiles;
