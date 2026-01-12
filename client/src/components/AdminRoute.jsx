import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { admin, loading } = useAuth();

  if (loading) return <div className="text-white">Loading...</div>; // TODO: Better loading spinner

  return admin ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminRoute;
