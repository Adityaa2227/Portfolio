import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderGit2, FileText, MessageSquareQuote, Mail, LogOut, ExternalLink, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Common/Logo';

export const NAV = [
  { Icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
  { Icon: FolderGit2, label: 'Projects', path: '/admin/projects' },
  { Icon: FileText, label: 'Resume', path: '/admin/resume' },
  { Icon: MessageSquareQuote, label: 'Reviews', path: '/admin/reviews', badge: 'pendingReviews' },
  { Icon: Mail, label: 'Messages', path: '/admin/messages' },
];

const Sidebar = ({ counts = {}, onNavigate, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <span className="flex items-center gap-3">
          <Logo className="text-2xl" />
          <span className="text-sm font-semibold text-foreground">Admin</span>
        </span>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close menu" className="rounded-lg p-2 text-text-muted hover:bg-accent/15 lg:hidden">
            <X size={18} aria-hidden />
          </button>
        )}
      </div>

      <nav aria-label="Admin" className="flex-1 space-y-1 px-3">
        {NAV.map(({ Icon, label, path, badge }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-accent/20 text-foreground shadow-[inset_0_0_0_1px_rgb(var(--c-accent)/0.4)]' : 'text-text-muted hover:bg-accent/10 hover:text-foreground'
              }`
            }
          >
            <Icon size={18} aria-hidden />
            <span className="flex-1">{label}</span>
            {badge && counts[badge] > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-white" aria-label={`${counts[badge]} waiting`}>
                {counts[badge]}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-border px-3 py-4">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-text-muted hover:bg-accent/10 hover:text-foreground">
          <ExternalLink size={18} aria-hidden /> View site
        </a>
        <button
          type="button"
          onClick={() => { logout(); navigate('/admin/login'); }}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={18} aria-hidden /> Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
