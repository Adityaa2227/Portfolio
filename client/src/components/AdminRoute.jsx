import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 text-sm text-text-muted" role="status">
        <Loader2 size={18} className="animate-spin text-accent-dark" aria-hidden /> Checking your session…
      </div>
    );
  }

  return admin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;
