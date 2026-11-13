import React, { useState } from 'react';
import { ChevronDown, Code2, Trophy, GraduationCap, CalendarClock, Briefcase } from 'lucide-react';
import { SiPaypal, SiLeetcode } from 'react-icons/si';
import Section, { SectionHeading } from './Section';
import fallback from '../../data/experience.json';
import codingData from '../../data/codingProfiles.json';

const BRAND = {
  PayPal: { node: <SiPaypal size={22} aria-hidden />, color: '#169BD7', tag: 'Backend' },
  'NS Apps Innovation': { node: <span className="text-sm font-black italic">NS</span>, color: '#E5484D', tag: 'Frontend' },
  'ETS Network': { node: <span className="text-xs font-black italic">ETS</span>, color: '#3B82F6', tag: 'Frontend' },
  'Self-Employed': { node: <Code2 size={18} aria-hidden />, color: '#A78BFA', tag: 'Full-stack' },
  'BIT Mesra': { node: <GraduationCap size={22} aria-hidden />, color: '#B91C1C', tag: 'Education' },
};

const STATS = [
  { Icon: CalendarClock, value: 1, suffix: '+ yr', label: 'Experience' },
  { Icon: Briefcase, value: 3, suffix: '', label: 'Internships' },
  { Icon: Code2, value: 1000, suffix: '+', label: 'DSA Problems' },
  { Icon: SiLeetcode, value: 600, suffix: '+', label: 'LeetCode' },
];

const EDUCATION = {
  _id: 'edu-bit',
  company: 'BIT Mesra',
  role: 'B.Tech in CSE',
  duration: '2023 – 2027',
  location: 'Ranchi, Jharkhand',
  responsibilities: [
    'Bachelor of Technology in Computer Science and Engineering at Birla Institute of Technology, Mesra.',
    'CGPA 8.6 / 10.',
    '1st Prize at Technika’24 hackathon and 2nd Prize at Innovate-A-Thon 3.0 on campus.',
  ],
};

const Role = ({ exp }) => {
  const [open, setOpen] = useState(false);
  const brand = BRAND[exp.company] || BRAND['Self-Employed'];
  const company = exp.company === 'Self-Employed' ? 'Freelance' : exp.company;
  const id = `role-${company.replace(/\W+/g, '-')}`;

  return (
    <li className="relative pl-12" data-reveal="rise">
      <span aria-hidden className="absolute left-[11px] top-5 h-3 w-3 rounded-full bg-accent shadow-[0_0_0_4px_rgb(var(--c-accent)/0.2),0_0_16px_rgb(var(--c-accent))]" />
      <div className="glass rounded-2xl p-4 sm:p-5 transition-colors hover:border-accent/60">
        <div className="flex items-center gap-4">
          <span
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/95"
            style={{ color: brand.color }}
            aria-hidden
          >
            {brand.node}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground">
              {exp.role.replace(' (SWE)', '').replace(' (SDE)', '')} <span className="text-text-muted">– {company}</span>
            </h3>
            <p className="mt-0.5 text-xs text-text-subtle">{exp.duration} &middot; {exp.location}</p>
          </div>
          <span className="hidden sm:inline-flex rounded-lg border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent-dark">
            {brand.tag}
          </span>
        </div>

        {exp.responsibilities?.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={id}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-foreground"
            >
              {open ? 'Hide' : 'Show'} highlights
              <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
            </button>
            <div id={id} className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <ul className="space-y-2 overflow-hidden">
                {exp.responsibilities.map((r) => (
                  <li key={r} className="relative pl-4 pt-2 text-sm leading-relaxed text-text-muted before:absolute before:left-0 before:top-[1.05em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </li>
  );
};

export const Experience = ({ experiences = [] }) => {
  const list = [...(experiences.length ? experiences : fallback), EDUCATION];
  const honors = (codingData.achievements || []).filter((a) => !a.title.startsWith('1000+'));

  return (
    <Section id="experience">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading eyebrow="Experience" title="My Professional Journey" />
          <div className="relative mt-10">
            <span aria-hidden data-draw className="absolute bottom-6 left-[16px] top-6 w-px origin-top bg-gradient-to-b from-accent via-accent/50 to-transparent" />
            <ol className="space-y-5">
              {list.map((exp) => <Role key={exp._id || exp.company} exp={exp} />)}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-5 lg:pt-24">
          <ul data-reveal="pop" className="grid grid-cols-2 gap-4">
            {STATS.map(({ Icon, value, suffix, label }) => (
              <li key={label} className="glass flex flex-col items-center justify-center rounded-2xl p-6 text-center transition-[border-color,box-shadow] duration-300 hover:border-accent hover:glow">
                <Icon size={28} className="text-accent-dark drop-shadow-[0_0_10px_rgb(var(--c-accent))]" aria-hidden />
                <p className="mt-3 font-heading text-3xl font-bold text-foreground tabular-nums">
                  <span data-count={value}>{value}</span>{suffix}
                </p>
                <p className="mt-1 text-xs text-text-muted">{label}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6 glass rounded-2xl p-5" data-reveal="rise">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Trophy size={16} className="text-accent-dark" aria-hidden /> Hackathons &amp; honors
            </p>
            <ul className="mt-3 divide-y divide-border">
              {honors.map((h) => (
                <li key={h.title} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                  <span className="text-text-muted">
                    <span className="font-medium text-foreground">{h.title.split(' — ')[0]}</span>
                    {h.title.includes(' — ') && <span>, {h.title.split(' — ')[1]}</span>}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-text-subtle">{h.year}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Experience;
