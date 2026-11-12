import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from './pages/Home';
import AllProjects from './pages/Public/AllProjects';
import ProjectDetail from './pages/Public/ProjectDetail';
import NotFound from './pages/NotFound';
import Preloader from './components/Common/Preloader';
import { markIntroDone } from './lib/intro';

// Admin (loaded only when visited). Only projects, resume, reviews and messages are
// managed here; everything else is edited in code under src/data and src/components.
const Login = lazy(() => import('./pages/Admin/Login'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminRoute = lazy(() => import('./components/AdminRoute'));
const AdminLayout = lazy(() => import('./layout/AdminLayout'));
const ProjectList = lazy(() => import('./pages/Admin/Projects/ProjectList'));
const ProjectForm = lazy(() => import('./pages/Admin/Projects/ProjectForm'));
const ResumeManager = lazy(() => import('./pages/Admin/Resume/ResumeManager'));
const TestimonialList = lazy(() => import('./pages/Admin/Testimonials/TestimonialList'));
const Messages = lazy(() => import('./pages/Admin/Messages'));

function App() {
  // The space intro plays on every full page load, except in the admin panel.
  const [isAdminLoad] = React.useState(() => window.location.pathname.startsWith('/admin'));
  React.useEffect(() => { if (isAdminLoad) markIntroDone(); }, [isAdminLoad]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      {!isAdminLoad && <Preloader />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />

        {/* Admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/projects" element={<ProjectList />} />
            <Route path="/admin/projects/new" element={<ProjectForm />} />
            <Route path="/admin/projects/edit/:id" element={<ProjectForm />} />
            <Route path="/admin/resume" element={<ResumeManager />} />
            <Route path="/admin/reviews" element={<TestimonialList />} />
            <Route path="/admin/testimonials" element={<Navigate to="/admin/reviews" replace />} />
            <Route path="/admin/messages" element={<Messages />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
