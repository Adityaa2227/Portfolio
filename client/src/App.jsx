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
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const location = useLocation();

  // Trigger loader on route change for specific pages
  useEffect(() => {
    // You can customize which paths trigger the loader
    const cinematicPaths = ['/', '/projects', '/all-projects'];
    // Check if the new path is one of the cinematic ones
    // We also want to ensure we don't trigger it if we are ALREADY loading (initial load)
    // But initial load is handled by useState(true).
    
    // Logic: If path changes to a cinematic path, Reset Loader.
    // Note: This effect runs on mount (initial) and on update.
    // On mount, isLoading is already true.
    
    if (cinematicPaths.includes(location.pathname)) {
        setIsLoading(true);
        // We keep showContent true so the old content stays until loader covers it?
        // Or we hide it?
        // If we want "Curtain Lift" effect, we effectively want to hiding the content
        // until the loader says "Ready".
        // But if showContent is true, the NEW route renders immediately under the loader.
        // That is actually what we want (Curtain Lift).
    }
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
            <Loader 
                onBackendFound={() => setShowContent(true)}
                onComplete={() => setIsLoading(false)} 
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
