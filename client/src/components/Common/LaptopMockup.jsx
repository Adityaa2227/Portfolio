import React from 'react';

/**
 * Tilted glass laptop. With `image` it shows that screenshot on screen;
 * without, a glowing </> mark.
 */
const LaptopMockup = ({ image, alt = '', className = '' }) => (
  <div className={`relative ${className}`} style={{ perspective: '1600px' }}>
    <div aria-hidden className="absolute inset-x-[10%] bottom-[8%] top-[20%] rounded-full bg-accent/40 blur-[70px]" />
    <div className="laptop-tilt relative" style={{ transform: 'rotateY(-16deg) rotateX(8deg) rotateZ(-2deg)', transformStyle: 'preserve-3d' }}>
      {/* Screen */}
      <div className="relative mx-auto w-[88%] rounded-t-2xl border-[3px] border-[#3b2f6b] bg-[#0b0820] p-[2.2%] shadow-[0_0_0_1px_rgb(167_139_250/0.35),0_30px_80px_-20px_rgb(139_92_246/0.8)]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-background">
          {image ? (
            <img src={image} alt={alt} className="h-full w-full object-cover object-top" />
          ) : (
            <div className="flex h-full items-center justify-center" style={{ background: 'radial-gradient(70% 70% at 50% 50%, rgb(var(--c-accent) / 0.35), transparent)' }}>
              <span className="font-mono text-5xl font-bold text-accent-dark drop-shadow-[0_0_18px_rgb(var(--c-accent))]">&lt;/&gt;</span>
            </div>
          )}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
        </div>
      </div>
      {/* Base */}
      <div
        className="relative mx-auto h-4 w-full rounded-b-2xl bg-gradient-to-b from-[#5b4a9e] to-[#251c4d] shadow-[0_18px_40px_-10px_rgb(139_92_246/0.7)]"
        style={{ clipPath: 'polygon(4% 0, 96% 0, 100% 100%, 0 100%)' }}
      >
        <span className="absolute left-1/2 top-0 h-1.5 w-[16%] -translate-x-1/2 rounded-b-md bg-[#1a1438]" />
      </div>
      <div aria-hidden className="mx-auto mt-1 h-1 w-[70%] rounded-full bg-accent/60 blur-sm" />
    </div>
  </div>
);

export default LaptopMockup;
