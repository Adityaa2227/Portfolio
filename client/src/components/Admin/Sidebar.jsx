import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Code, 
  FolderGit2, 
  FileText, 
  MessageSquareQuote, 
  Share2, 
  Mail,
  LogOut,
  User,
  Briefcase,
  Cpu
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: User, label: 'Bio / About', path: '/admin/bio' },
    { icon: Code, label: 'Skills', path: '/admin/skills' },
    { icon: FolderGit2, label: 'Projects', path: '/admin/projects' },
    { icon: Briefcase, label: 'Experience', path: '/admin/experience' },
    { icon: Cpu, label: 'Coding Profiles', path: '/admin/profiles' },
    { icon: FileText, label: 'Resume', path: '/admin/resume' },
    { icon: MessageSquareQuote, label: 'Testimonials', path: '/admin/testimonials' },
    { icon: Share2, label: 'Socials', path: '/admin/socials' },
    { icon: Mail, label: 'Messages', path: '/admin/messages' },
  ];

  return (
    <div className="w-64 glass-panel h-screen fixed left-0 top-0 flex flex-col border-r border-white/5">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-xl font-bold text-white tracking-wider">PORTFOLIO<span className="text-primary">.CMS</span></h2>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-primary/20 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)] border border-primary/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
