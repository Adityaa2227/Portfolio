import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
            <span>Welcome, {admin?.username}</span>
            <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors"
            >
            Logout
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-primary">Content Management</h3>
            <p className="text-gray-400">Manage your skills, projects, and bio.</p>
        </div>
        {/* More panels later */}
      </div>
    </div>
  );
};

export default Dashboard;
