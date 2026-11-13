import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

/** "Open to work" badge, controlled from Admin -> Settings. Renders nothing when switched off or unreachable. */
const OpenToWork = ({ className = '' }) => {
  const [badge, setBadge] = useState(null);

  useEffect(() => {
    let alive = true;
    api.get('/settings', { timeout: 15000 })
      .then(({ data }) => { if (alive && data?.openToWork?.enabled && data.openToWork.text) setBadge(data.openToWork); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  if (!badge) return null;
  return (
    <p className={`inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium text-foreground ${className}`} title={badge.detail || undefined}>
      <span className="relative flex h-2 w-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
      </span>
      {badge.text}
      {badge.detail && <span className="hidden text-text-muted sm:inline">· {badge.detail}</span>}
    </p>
  );
};

export default OpenToWork;
