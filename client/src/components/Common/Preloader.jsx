import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/motion';
import { markIntroDone } from '../../lib/intro';

const STATUS = ['Systems check…', 'Ignition sequence…', 'Liftoff!'];

/** Hyperspace star streaks drawn on a canvas. `speed` is read every frame so GSAP can tween it. */
const useWarp = (canvasRef, speed) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#ffffff', '#ddd6fe', '#c4b5fd', '#a78bfa', '#f0abfc'];
    const stars = Array.from({ length: 700 }, () => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: Math.random(),
      c: colors[Math.floor(Math.random() * colors.length)],
    }));

    let raf = 0;
    const frame = () => {
      const v = speed.current.v;
      ctx.fillStyle = 'rgba(7, 5, 22, 0.35)'; // trails
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.max(w, h) * 0.6;
      for (const s of stars) {
        const pz = s.z;
        s.z -= v;
        if (s.z <= 0.02) {
          s.x = (Math.random() - 0.5) * 2;
          s.y = (Math.random() - 0.5) * 2;
          s.z = 1;
          continue;
        }
        const x1 = cx + (s.x / pz) * scale * 0.5;
        const y1 = cy + (s.y / pz) * scale * 0.5;
        const x2 = cx + (s.x / s.z) * scale * 0.5;
        const y2 = cy + (s.y / s.z) * scale * 0.5;
        const alpha = Math.min(1, (1 - s.z) * 1.4);
        ctx.strokeStyle = s.c;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = Math.max(0.6, (1 - s.z) * 2.4);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    ctx.fillStyle = '#070516';
    ctx.fillRect(0, 0, w, h);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef, speed]);
};

const SEEN_KEY = 'aa-intro-seen';

// The full rocket launch plays once per browser; after that a ~1.2 s warp.
const hasSeenIntro = () => {
  try { return localStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
};

const ROCKET_W = 120; // px; the rocket is twice as tall

/** The launch rocket, drawn pointing up. The flame and trail are scaled by the timeline. */
const LaunchRocket = () => (
  <div className="pl-rocket absolute bottom-[4vh] left-1/2" style={{ width: ROCKET_W, height: ROCKET_W * 2, marginLeft: -ROCKET_W / 2 }} aria-hidden>
    {/* Long exhaust trail, grows after liftoff */}
    <span
      className="pl-trail absolute left-1/2 top-[86%] h-[420%] w-[26%] -translate-x-1/2 origin-top rounded-full"
      style={{ background: 'linear-gradient(to bottom, rgb(255 247 237 / 0.95), rgb(253 186 116 / 0.85) 10%, rgb(244 114 182 / 0.6) 30%, rgb(139 92 246 / 0.35) 60%, transparent)', filter: 'blur(6px)', transform: 'scaleY(0)' }}
    />
    {/* Engine glow */}
    <span className="pl-engine-glow absolute left-1/2 top-[80%] h-24 w-24 -translate-x-1/2 rounded-full bg-orange-300/50 blur-2xl" />
    <svg viewBox="0 0 64 128" className="relative h-full w-full drop-shadow-[0_0_18px_rgb(167_139_250/0.85)]">
      <defs>
        <linearGradient id="lr-body" x1="0" x2="1">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="0.45" stopColor="#f5f3ff" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
        <radialGradient id="lr-flame" cx="50%" cy="10%" r="90%">
          <stop offset="0" stopColor="#fff7ed" />
          <stop offset="0.35" stopColor="#fdba74" />
          <stop offset="0.7" stopColor="#f472b6" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="pl-flame">
        <g className="rocket-flame" style={{ transformOrigin: '32px 92px', transformBox: 'view-box' }}>
          <path d="M20 90 Q32 132 44 90 Z" fill="url(#lr-flame)" />
          <path d="M26 90 Q32 114 38 90 Z" fill="#fff7ed" opacity="0.9" />
        </g>
      </g>
      <path d="M18 66 L4 94 L18 89 Z" fill="#7c3aed" />
      <path d="M46 66 L60 94 L46 89 Z" fill="#7c3aed" />
      <path d="M32 4 C47 21 49 48 46 90 L18 90 C15 48 17 21 32 4 Z" fill="url(#lr-body)" />
      <path d="M32 4 C38 11 42 19 44 27 L20 27 C22 19 26 11 32 4 Z" fill="#8b5cf6" />
      <rect x="18" y="60" width="28" height="4" fill="#8b5cf6" opacity="0.6" />
      <circle cx="32" cy="46" r="8.5" fill="#1e1b4b" stroke="#c4b5fd" strokeWidth="3" />
      <circle cx="29.5" cy="43.5" r="2.6" fill="#a5b4fc" opacity="0.85" />
      <text x="32" y="80" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="800" fontStyle="italic" fontSize="9" fill="#6d28d9">AA</text>
      <rect x="21" y="84" width="22" height="6" rx="2" fill="#6d28d9" />
    </svg>
  </div>
);

/** Launch pad + smoke clouds that burst out at liftoff. */
const LaunchPad = () => (
  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30vh]" aria-hidden>
    <div className="pl-pad absolute bottom-[3vh] left-1/2 h-2 w-56 -translate-x-1/2 rounded-full bg-accent/60 shadow-[0_0_30px_6px_rgb(139_92_246/0.6)]" />
    {Array.from({ length: 12 }).map((_, i) => (
      <span
        key={i}
        className="pl-smoke absolute bottom-[1vh] left-1/2 rounded-full opacity-0"
        data-dir={i % 2 ? 1 : -1}
        data-i={i}
        style={{
          width: 90 + (i % 4) * 30,
          height: 90 + (i % 4) * 30,
          marginLeft: -(90 + (i % 4) * 30) / 2,
          background: i % 3 === 0 ? 'rgb(253 186 116 / 0.35)' : 'rgb(221 214 254 / 0.28)',
          filter: 'blur(14px)',
        }}
      />
    ))}
  </div>
);

/** Space-themed intro shown on every full page load: countdown, liftoff, warp, reveal. */
const Preloader = () => {
  const [visible, setVisible] = useState(true);
  const [pct, setPct] = useState(0);
  const [status, setStatus] = useState(STATUS[0]);
  const root = useRef(null);
  const canvas = useRef(null);
  const speed = useRef({ v: 0.0025 });
  const tlRef = useRef(null);

  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [quick] = useState(hasSeenIntro);

  useWarp(canvas, speed);

  useLayoutEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    const finish = () => {
      document.documentElement.style.overflow = '';
      markIntroDone();
      try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* private mode: full intro again next time */ }
      setVisible(false);
    };

    const ctx = gsap.context(() => {
      if (reduce) {
        speed.current.v = 0.001;
        gsap.timeline({ onComplete: finish })
          .set('.pl-logo-wrap', { autoAlpha: 1 })
          .to(root.current, { autoAlpha: 0, duration: 0.4 }, '+=0.6');
        return;
      }

      if (quick) {
        // Returning visitor: AA locks in, warp, iris opens. About 1.2 s.
        gsap.set('.pl-rocket, .pl-meta, .pl-count, .pl-smoke, .pl-pad', { autoAlpha: 0 });
        speed.current.v = 0.02;
        const q = gsap.timeline({ onComplete: finish });
        tlRef.current = q;
        q.set('.pl-logo-wrap', { autoAlpha: 1 })
          .fromTo('.pl-ring', { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'expo.out' }, 0)
          .fromTo('.pl-planet-glow', { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4 }, 0)
          .fromTo('.pl-a1', { xPercent: -160, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.35, ease: 'power4.out' }, 0)
          .fromTo('.pl-a2', { xPercent: 160, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.35, ease: 'power4.out' }, 0)
          .addLabel('out', 0.4)
          .to(speed.current, { v: 0.09, duration: 0.4, ease: 'power3.in' }, 'out')
          .to('.pl-logo-wrap', { scale: 2, autoAlpha: 0, filter: 'blur(10px)', duration: 0.4, ease: 'power3.in' }, 'out')
          .fromTo('.pl-flash', { autoAlpha: 0 }, { autoAlpha: 0.7, duration: 0.12 }, 'out+=0.3')
          .to('.pl-flash', { autoAlpha: 0, duration: 0.3 }, '>')
          .fromTo(root.current, { '--hole': '-10%' }, { '--hole': '150%', duration: 0.5, ease: 'expo.inOut' }, 'out+=0.3');
        return;
      }

      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: finish });
      tlRef.current = tl;

      gsap.set('.pl-logo-wrap', { autoAlpha: 0 });
      gsap.set('.pl-count', { autoAlpha: 0, scale: 0.4 });

      tl.addLabel('start')
        // Rocket rolls onto the pad, status panel appears
        .fromTo('.pl-rocket', { y: 80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }, 'start')
        .fromTo('.pl-pad', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power3.out' }, 'start')
        .fromTo('.pl-meta', { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, 'start+=0.2')
        .fromTo('.pl-flame', { scale: 0.35, transformOrigin: '50% 0%' }, { scale: 0.55, duration: 0.6 }, 'start+=0.3')
        // Progress runs through the countdown
        .to(counter, {
          v: 100,
          duration: 2.2,
          ease: 'none',
          onUpdate: () => {
            const v = Math.round(counter.v);
            setPct(v);
            setStatus(STATUS[Math.min(STATUS.length - 1, Math.floor(v / 34))]);
          },
        }, 'start+=0.3');

      // Countdown 3, 2, 1
      ['.pl-c3', '.pl-c2', '.pl-c1'].forEach((sel, i) => {
        const at = 0.4 + i * 0.6;
        tl.to(sel, { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'back.out(2)' }, at)
          .to(sel, { autoAlpha: 0, scale: 1.6, duration: 0.22, ease: 'power2.in' }, at + 0.34)
          // the rocket rumbles harder each second
          .to('.pl-rocket', { x: 1.5 + i * 1.5, duration: 0.05, repeat: 7, yoyo: true, ease: 'none' }, at)
          .to('.pl-flame', { scale: 0.65 + i * 0.15, duration: 0.3 }, at);
      });

      tl.addLabel('liftoff', 2.2)
        // Ignition: flame roars, smoke bursts, screen shakes
        .to('.pl-flame', { scale: 1.5, duration: 0.25, ease: 'power2.out' }, 'liftoff')
        .to('.pl-engine-glow', { scale: 2.2, autoAlpha: 1, duration: 0.3 }, 'liftoff')
        .to('.pl-trail', { scaleY: 1, duration: 1.2, ease: 'power2.out' }, 'liftoff+=0.1')
        .to('.pl-shake', { x: 6, y: 3, duration: 0.04, repeat: 15, yoyo: true, ease: 'none' }, 'liftoff')
        .set('.pl-shake', { x: 0, y: 0 }, 'liftoff+=0.65');

      gsap.utils.toArray('.pl-smoke').forEach((el) => {
        const dir = Number(el.dataset.dir);
        const i = Number(el.dataset.i);
        tl.fromTo(el,
          { autoAlpha: 0.9, scale: 0.3, x: 0, y: 0 },
          { autoAlpha: 0, scale: 2.6 + (i % 3) * 0.6, x: dir * (120 + i * 28), y: -(10 + (i % 4) * 22), duration: 1.6, ease: 'power2.out' },
          `liftoff+=${(i % 6) * 0.04}`);
      });

      tl
        // The climb: slow start, then accelerating up and off the top of the screen
        .to('.pl-rocket', { y: '-120vh', duration: 1.7, ease: 'power2.in' }, 'liftoff+=0.15')
        .to('.pl-pad', { autoAlpha: 0, duration: 0.6 }, 'liftoff+=0.4')
        .to(speed.current, { v: 0.03, duration: 1.4, ease: 'power2.in' }, 'liftoff+=0.4')
        .to('.pl-meta', { autoAlpha: 0, y: 10, duration: 0.3 }, 'liftoff+=0.6')
        // AA assembles behind the rocket's path
        .addLabel('logo', 'liftoff+=1.15')
        .set('.pl-logo-wrap', { autoAlpha: 1 }, 'logo')
        .fromTo('.pl-ring', { scale: 0.4, rotate: -40, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out' }, 'logo')
        .fromTo('.pl-planet-glow', { scale: 0.3, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.9, ease: 'expo.out' }, 'logo')
        .fromTo('.pl-a1', { xPercent: -260, autoAlpha: 0, filter: 'blur(10px)' }, { xPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power4.out' }, 'logo+=0.1')
        .fromTo('.pl-a2', { xPercent: 260, autoAlpha: 0, filter: 'blur(10px)' }, { xPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power4.out' }, 'logo+=0.1')
        .fromTo('.pl-lock', { scale: 0.6, autoAlpha: 0.9 }, { scale: 1.8, autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, 'logo+=0.6')
        // Exit: full warp, flash, iris opens onto the page
        .addLabel('out', 'logo+=1.05')
        .to(speed.current, { v: 0.09, duration: 0.6, ease: 'power3.in' }, 'out')
        .to('.pl-logo-wrap', { scale: 2.2, autoAlpha: 0, filter: 'blur(12px)', duration: 0.6, ease: 'power3.in' }, 'out+=0.05')
        .fromTo('.pl-flash', { autoAlpha: 0 }, { autoAlpha: 0.85, duration: 0.18, ease: 'power2.in' }, 'out+=0.45')
        .to('.pl-flash', { autoAlpha: 0, duration: 0.45, ease: 'power2.out' }, '>')
        .fromTo(root.current, { '--hole': '-10%' }, { '--hole': '150%', duration: 0.8, ease: 'expo.inOut' }, 'out+=0.5');
    }, root);

    // Click or key press skips straight to the exit
    const skip = () => {
      const tl = tlRef.current;
      if (tl && tl.time() < tl.labels.out) {
        gsap.set('.pl-rocket, .pl-meta, .pl-count, .pl-smoke, .pl-pad', { autoAlpha: 0 });
        gsap.set('.pl-logo-wrap', { autoAlpha: 1 });
        tl.seek('out');
      }
    };
    window.addEventListener('keydown', skip);
    root.current.addEventListener('click', skip);

    return () => {
      window.removeEventListener('keydown', skip);
      ctx.revert();
      document.documentElement.style.overflow = '';
    };
  }, [reduce, quick]);

  if (!visible) return null;

  return (
    <div
      ref={root}
      role="status"
      aria-label={`Loading, ${pct} percent`}
      className="fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-background"
      style={{
        '--hole': '-10%',
        maskImage: 'radial-gradient(circle at 50% 50%, transparent var(--hole), #000 calc(var(--hole) + 6%))',
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent var(--hole), #000 calc(var(--hole) + 6%))',
      }}
    >
      <div className="pl-shake absolute inset-0">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
        <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(40% 40% at 50% 50%, rgb(var(--c-accent) / 0.22), transparent 70%)' }} />

        {/* AA logo with orbit ring (revealed after liftoff) */}
        <div className="pl-logo-wrap absolute inset-0 flex items-center justify-center">
          <div className="relative flex h-[300px] w-[300px] items-center justify-center sm:h-[360px] sm:w-[360px]">
            <div aria-hidden className="pl-planet-glow absolute h-40 w-40 rounded-full bg-accent/40 blur-[60px]" />
            <svg aria-hidden viewBox="0 0 360 360" className="pl-ring absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="pl-ring-g" x1="0" x2="1">
                  <stop offset="0" stopColor="#a78bfa" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#c4b5fd" />
                  <stop offset="1" stopColor="#d946ef" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g transform="rotate(-18 180 180)">
                <ellipse cx="180" cy="180" rx="170" ry="58" fill="none" stroke="url(#pl-ring-g)" strokeWidth="2" />
                <ellipse cx="180" cy="180" rx="150" ry="48" fill="none" stroke="rgb(167 139 250 / 0.25)" strokeWidth="1" strokeDasharray="2 8" />
                <circle r="6" fill="#f0abfc">
                  <animateMotion dur="2.4s" repeatCount="indefinite" path="M10,180 a170,58 0 1,0 340,0 a170,58 0 1,0 -340,0" />
                </circle>
              </g>
            </svg>
            <div className="relative font-heading text-7xl font-extrabold italic leading-none tracking-[-0.12em] sm:text-8xl" aria-hidden>
              <span className="pl-a1 inline-block text-foreground" style={{ textShadow: '0 0 24px rgb(var(--c-accent) / 0.8)' }}>A</span>
              <span className="pl-a2 inline-block text-accent-dark" style={{ textShadow: '0 0 24px rgb(var(--c-accent) / 0.9)' }}>A</span>
              <span className="pl-lock pointer-events-none absolute inset-[-30%] rounded-full border-2 border-accent-dark/70 opacity-0" />
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[22vh] flex justify-center">
          {['3', '2', '1'].map((n) => (
            <span
              key={n}
              className={`pl-count pl-c${n} absolute font-heading text-[9rem] font-extrabold leading-none text-gradient sm:text-[12rem]`}
              style={{ filter: 'drop-shadow(0 0 30px rgb(139 92 246 / 0.7))' }}
            >
              {n}
            </span>
          ))}
        </div>

        <LaunchPad />
        <LaunchRocket />

        {/* Mission status */}
        <div className="pl-meta absolute left-1/2 top-[8vh] w-[min(320px,80vw)] -translate-x-1/2 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-dark">{status}</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-muted">
              <div className="h-full origin-left rounded-full" style={{ transform: `scaleX(${pct / 100})`, background: 'linear-gradient(90deg, rgb(var(--c-accent)), rgb(var(--c-accent-2)))', boxShadow: '0 0 12px rgb(var(--c-accent))' }} />
            </div>
            <span className="w-10 text-right font-mono text-xs text-text-muted tabular-nums">{pct}%</span>
          </div>
          <p className="mt-3 text-[11px] text-text-subtle">Click anywhere to skip</p>
        </div>
      </div>

      <div aria-hidden className="pl-flash pointer-events-none absolute inset-0 opacity-0" style={{ background: 'radial-gradient(circle at 50% 50%, #f5f3ff, rgb(var(--c-accent) / 0.6) 40%, transparent 75%)' }} />
    </div>
  );
};

export default Preloader;
