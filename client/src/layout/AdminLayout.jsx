import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Admin/Sidebar';
import Logo from '../components/Common/Logo';
import api from '../api/axios';

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState({});
  const { pathname } = useLocation();

  // Pending-review badge in the sidebar; refreshed when moving between pages.
  const refreshCounts = useCallback(() => {
    api.get('/testimonials/admin')
      .then(({ data }) => setCounts({ pendingReviews: Array.isArray(data) ? data.filter((t) => !t.isApproved).length : 0 }))
      .catch(() => {});
  }, []);
  useEffect(() => { refreshCounts(); }, [pathname, refreshCounts]);

  return (
    <div className="min-h-screen text-foreground">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ background: 'radial-gradient(60% 50% at 80% 0%, rgb(var(--c-accent) / 0.18), transparent 70%)' }} />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-surface/70 backdrop-blur-xl lg:block">
        <Sidebar counts={counts} />
      </aside>

      {/* Mobile top bar + drawer */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <Logo className="text-2xl" />
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg border border-border p-2">
          <Menu size={18} aria-hidden />
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-background/70" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-border bg-surface">
            <Sidebar counts={counts} onNavigate={() => setOpen(false)} onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <main className="px-4 py-8 sm:px-8 lg:ml-64 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <Outlet context={{ refreshCounts }} />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
