import React from 'react';
import {
  SiCplusplus, SiC, SiJavascript, SiReact, SiNextdotjs, SiNodedotjs, SiExpress, SiMongodb, SiMysql, SiRedis,
  SiSocketdotio, SiFirebase, SiTailwindcss, SiDocker, SiKubernetes, SiTerraform, SiGit, SiGithubactions,
  SiJunit5, SiCucumber, SiClaude, SiGooglegemini, SiPython, SiTypescript, SiSpringboot, SiPostgresql,
} from 'react-icons/si';
import { FaJava, FaAws } from 'react-icons/fa';
import { Code2, Server, MonitorSmartphone, Container, Bot, Sparkles, DatabaseZap, Boxes, Plug, MessageSquareCode } from 'lucide-react';
import Section, { SectionHeading } from './Section';

// Grouped the same way as the resume's Skills section.
const GROUPS = [
  {
    title: 'Languages',
    Icon: Code2,
    items: [
      { name: 'Java', Icon: FaJava, color: '#F89820' },
      { name: 'C++', Icon: SiCplusplus, color: '#659AD2' },
      { name: 'C', Icon: SiC, color: '#A8B9CC' },
      { name: 'Python', Icon: SiPython, color: '#FFD43B' },
      { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
      { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
    ],
  },
  {
    title: 'Backend & Databases',
    Icon: Server,
    items: [
      { name: 'Node.js', Icon: SiNodedotjs, color: '#5FA04E' },
      { name: 'Express', Icon: SiExpress, color: 'currentColor' },
      { name: 'Spring Boot', Icon: SiSpringboot, color: '#6DB33F' },
      { name: 'MySQL', Icon: SiMysql, color: '#4479A1' },
      { name: 'PostgreSQL', Icon: SiPostgresql, color: '#4169E1' },
      { name: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
      { name: 'Redis', Icon: SiRedis, color: '#FF4438' },
    ],
  },
  {
    title: 'Frontend & Real-time',
    Icon: MonitorSmartphone,
    items: [
      { name: 'React', Icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', Icon: SiNextdotjs, color: 'currentColor' },
      { name: 'Tailwind', Icon: SiTailwindcss, color: '#38BDF8' },
      { name: 'Socket.io', Icon: SiSocketdotio, color: 'currentColor' },
      { name: 'Firebase', Icon: SiFirebase, color: '#FFCA28' },
    ],
  },
  {
    title: 'DevOps & Testing',
    Icon: Container,
    items: [
      { name: 'AWS', Icon: FaAws, color: '#FF9900' },
      { name: 'Docker', Icon: SiDocker, color: '#2496ED' },
      { name: 'Kubernetes', Icon: SiKubernetes, color: '#326CE5' },
      { name: 'Terraform', Icon: SiTerraform, color: '#844FBA' },
      { name: 'Git', Icon: SiGit, color: '#F05032' },
      { name: 'CI/CD', Icon: SiGithubactions, color: '#2088FF' },
      { name: 'JUnit', Icon: SiJunit5, color: '#25A162' },
      { name: 'Cucumber', Icon: SiCucumber, color: '#23D96C' },
    ],
  },
  {
    title: 'AI & Automation',
    Icon: Bot,
    items: [
      { name: 'Claude', Icon: SiClaude, color: '#D97757' },
      { name: 'Gemini', Icon: SiGooglegemini, color: '#8E75B2' },
      { name: 'Groq', Icon: Sparkles, color: '#F55036' },
      { name: 'RAG', Icon: DatabaseZap, color: '#A78BFA' },
      { name: 'Prompt Eng.', Icon: MessageSquareCode, color: '#C084FC' },
      { name: 'Vector DBs', Icon: Boxes, color: '#60A5FA' },
      { name: 'MCP', Icon: Plug, color: '#34D399' },
    ],
  },
];

const Tile = ({ name, Icon, color }) => (
  <li className="tilt">
    <div className="tilt-inner group flex h-[5.5rem] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-1 text-foreground transition-[border-color,box-shadow] duration-300 hover:border-accent hover:glow">
      <Icon
        size={28}
        style={{ color }}
        className="transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_10px_rgb(var(--c-accent)/0.35)]"
        aria-hidden
      />
      <span className="text-center text-[11px] font-medium leading-tight text-text-muted group-hover:text-foreground">{name}</span>
    </div>
  </li>
);

export const Skills = () => (
  <Section id="skills">
    <SectionHeading center eyebrow="Tech stack" title="Tools & Technologies I Work With" />

    <div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-6">
      {GROUPS.map(({ title, Icon, items }, i) => (
        <section
          key={title}
          data-reveal="rise"
          aria-labelledby={`skills-${i}`}
          // 3 cards on the first row, 2 wider ones on the second
          className={`glass rounded-2xl p-5 transition-colors hover:border-accent/60 ${i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'} ${i === 4 ? 'md:col-span-2 lg:col-span-3' : ''}`}
        >
          <header className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent-dark">
              <Icon size={19} aria-hidden />
            </span>
            <h3 id={`skills-${i}`} className="flex-1 font-heading text-lg font-bold text-foreground">{title}</h3>
            <span className="rounded-md border border-border px-2 py-0.5 text-xs text-text-subtle">{items.length}</span>
          </header>
          <ul data-reveal="pop" className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {items.map((s) => <Tile key={s.name} {...s} />)}
          </ul>
        </section>
      ))}
    </div>
  </Section>
);

export default Skills;
