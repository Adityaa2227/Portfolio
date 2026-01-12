import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
  return (
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
  );
}

export default App;
