import React, { useState } from 'react';
import { Landmark, BarChart3, MapPin, Puzzle, Zap, Users } from 'lucide-react';
import Section, { SectionHeading } from './Section';

const TRAITS = [
  { Icon: Puzzle, label: 'Problem Solver' },
  { Icon: Zap, label: 'Fast Learner' },
  { Icon: Users, label: 'Team Player' },
];

const FACTS = [
  { Icon: Landmark, title: 'BIT Mesra', lines: ['B.Tech CSE', '(2023–2027)'] },
  { Icon: BarChart3, title: 'CGPA', lines: [<span key="c" data-count="8.6" data-decimals="1">8.6</span>] },
  { Icon: MapPin, title: 'Garhwa', lines: ['Jharkhand, India'] },
];

/** Uses /about.png when present, otherwise a coded workstation scene. */
const AboutArt = () => {
  const [hasImage, setHasImage] = useState(true);
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/60 aspect-[4/3]">
      {hasImage ? (
        <img
          src="/about-workspace.webp"
          alt="Aditya's workspace"
          onError={() => setHasImage(false)}
          data-parallax
          className="absolute inset-0 h-[115%] w-full object-cover"
        />
      ) : (
        <div data-parallax className="absolute inset-0 h-[115%]">
          <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(70% 60% at 50% 40%, rgb(var(--c-accent) / 0.35), transparent 70%)' }} />
          {/* Monitor */}
          <div className="absolute left-1/2 top-[18%] w-[58%] -translate-x-1/2">
            <div className="aspect-[16/10] rounded-xl border-2 border-border-strong bg-background/90 p-[6%] shadow-[0_0_60px_rgb(var(--c-accent)/0.5)]">
              <div className="flex h-full items-center justify-center rounded-md border border-accent/40 bg-accent/10">
                <span className="font-mono text-4xl font-bold text-accent-dark drop-shadow-[0_0_14px_rgb(var(--c-accent))]">&lt;/&gt;</span>
              </div>
            </div>
            <div className="mx-auto h-6 w-3 bg-border-strong" />
            <div className="mx-auto h-1.5 w-24 rounded-full bg-border-strong" />
          </div>
          {/* Lamp glow */}
          <div aria-hidden className="absolute right-[10%] top-[30%] h-24 w-24 rounded-full bg-amber-300/30 blur-2xl" />
          {/* Plant */}
          <svg aria-hidden viewBox="0 0 80 120" className="absolute bottom-[14%] left-[6%] w-[14%]">
            <path d="M40 80 C20 60 10 40 18 20 C30 40 38 55 40 80Z" fill="#4c1d95" />
            <path d="M40 80 C60 60 72 38 62 14 C50 36 42 55 40 80Z" fill="#6d28d9" />
            <path d="M40 80 C34 50 36 30 40 6 C44 30 46 50 40 80Z" fill="#7c3aed" />
            <rect x="26" y="78" width="28" height="32" rx="4" fill="#1a133c" stroke="#4e3e8c" />
          </svg>
          {/* Desk */}
          <div aria-hidden className="absolute inset-x-0 bottom-[10%] h-px bg-border-strong" />
        </div>
      )}
    </div>
  );
};

export const About = () => (
  <Section id="about">
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div data-reveal="rise"><AboutArt /></div>

      <div>
        <SectionHeading eyebrow="About me" title="A Developer Who Loves Building & Solving" />
        <p data-reveal="rise" className="mt-6 max-w-[58ch] text-base sm:text-lg leading-relaxed text-text-muted">
          I&rsquo;m a final-year B.Tech CSE student at BIT Mesra (2023–2027) with a passion for building real-world
          products, solving complex problems, and exploring modern technologies.
        </p>
        <p data-reveal="rise" className="mt-4 max-w-[58ch] leading-relaxed text-text-muted">
          I&rsquo;ve interned as a Software Engineer on PayPal&rsquo;s Credit (BNPL) team, shipped a job platform to 500+
          daily users, and I build with Java, Node.js, React and Generative AI (LLM APIs, RAG).
        </p>

        <ul className="mt-6 flex flex-wrap gap-2.5" aria-label="How I work">
          {TRAITS.map(({ Icon, label }) => (
            <li key={label} data-reveal="rise" className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-3.5 py-2 text-sm font-medium text-foreground">
              <Icon size={16} className="text-accent-dark" aria-hidden /> {label}
            </li>
          ))}
        </ul>

        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {FACTS.map(({ Icon, title, lines }) => (
            <li key={title} data-reveal="rise" className="glass flex items-center gap-3 rounded-2xl p-4 transition-colors hover:border-accent/70">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent-dark">
                <Icon size={20} aria-hidden />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-semibold text-foreground">{title}</span>
                {lines.map((l, i) => (
                  <span key={i} className="block text-text-muted">{l}</span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Section>
);

export default About;
