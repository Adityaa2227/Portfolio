import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from './pages/Home';
import Preloader from './components/Common/Preloader';
import { markIntroDone } from './lib/intro';
import { useAnalytics } from './lib/analytics';

// Other public pages load when first visited (and are prefetched once the intro ends).
const loadAllProjects = () => import('./pages/Public/AllProjects');
const loadProjectDetail = () => import('./pages/Public/ProjectDetail');
const AllProjects = lazy(loadAllProjects);
const ProjectDetail = lazy(loadProjectDetail);
const NotFound = lazy(() => import('./pages/NotFound'));
const Blog = lazy(() => import('./pages/Public/Blog'));
const BlogPost = lazy(() => import('./pages/Public/BlogPost'));

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
const Analytics = lazy(() => import('./pages/Admin/Analytics'));
const Settings = lazy(() => import('./pages/Admin/Settings'));
const PostList = lazy(() => import('./pages/Admin/Blog/PostList'));
const PostEditor = lazy(() => import('./pages/Admin/Blog/PostEditor'));

function App() {
  // The space intro plays on every full page load, except in the admin panel.
  const [isAdminLoad] = React.useState(() => window.location.pathname.startsWith('/admin'));
  useAnalytics();
  React.useEffect(() => { if (isAdminLoad) markIntroDone(); }, [isAdminLoad]);

  // Warm the project pages in the background so clicking a project is instant.
  React.useEffect(() => {
    if (isAdminLoad) return undefined;
    const t = setTimeout(() => { loadAllProjects(); loadProjectDetail(); }, 4000);
    return () => clearTimeout(t);
  }, [isAdminLoad]);

  return (
    <>
      {/* Outside the Suspense boundary so a lazy page loading never restarts the intro */}
      {!isAdminLoad && <Preloader />}
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

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
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/blog" element={<PostList />} />
            <Route path="/admin/blog/new" element={<PostEditor />} />
            <Route path="/admin/blog/edit/:id" element={<PostEditor />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </>
  );
}

export default App;
