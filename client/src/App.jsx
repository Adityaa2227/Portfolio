import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Loader from './components/Common/Loader';
import { AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import AllProjects from './pages/Public/AllProjects';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './layout/AdminLayout';
import ProjectList from './pages/Admin/Projects/ProjectList';
import ProjectForm from './pages/Admin/Projects/ProjectForm';
import SkillList from './pages/Admin/Skills/SkillList';
import ResumeManager from './pages/Admin/Resume/ResumeManager';
import TestimonialList from './pages/Admin/Testimonials/TestimonialList';
import { SocialList, MessageList } from './pages/Admin/Socials/SocialMessageCombined';
import BioManager from './pages/Admin/Bio/BioManager';
import ExperienceList from './pages/Admin/Experience/ExperienceList';
import ExperienceForm from './pages/Admin/Experience/ExperienceForm';
import ProfileList from './pages/Admin/CodingProfiles/ProfileList';
import ProfileForm from './pages/Admin/CodingProfiles/ProfileForm';

function App() {
  const isInitialAdminRoute = window.location.pathname.startsWith('/admin');
  const [isLoading, setIsLoading] = useState(() => !isInitialAdminRoute && sessionStorage.getItem('appLoaded') !== 'true');
  const [showContent, setShowContent] = useState(() => isInitialAdminRoute || sessionStorage.getItem('appLoaded') === 'true');
  const location = useLocation();

  // Trigger loader on route change for specific pages
  useEffect(() => {
    // We disable the loader for route changes to prevent it from showing again,
    // as requested so that when anyone refreshes or navigates, they won't get it again.
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
            <Loader 
                onBackendFound={() => setShowContent(true)}
                onComplete={() => {
                    setIsLoading(false);
                    sessionStorage.setItem('appLoaded', 'true');
                }} 
            />
        )}
      </AnimatePresence>
      
      {showContent && (
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<AllProjects />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/projects" element={<ProjectList />} />
              <Route path="/admin/projects/new" element={<ProjectForm />} />
              <Route path="/admin/projects/edit/:id" element={<ProjectForm />} />
              <Route path="/admin/skills" element={<SkillList />} />
              <Route path="/admin/resume" element={<ResumeManager />} />
              <Route path="/admin/testimonials" element={<TestimonialList />} />
              <Route path="/admin/socials" element={<SocialList />} />
              <Route path="/admin/messages" element={<MessageList />} />
              
              <Route path="/admin/bio" element={<BioManager />} />
              
              <Route path="/admin/experience" element={<ExperienceList />} />
              <Route path="/admin/experience/new" element={<ExperienceForm />} />
              <Route path="/admin/experience/edit/:id" element={<ExperienceForm />} />

              <Route path="/admin/profiles" element={<ProfileList />} />
              <Route path="/admin/profiles/new" element={<ProfileForm />} />
              <Route path="/admin/profiles/edit/:id" element={<ProfileForm />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<div className="text-white p-10">404 - Not Found</div>} />
        </Routes>
      )}
    </>
  );
}

export default App;
