import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Loader from './components/Common/Loader';
import { AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import AllProjects from './pages/Public/AllProjects';

function App() {
  const isInitialAdminRoute = window.location.pathname.startsWith('/admin');
  const [isLoading, setIsLoading] = useState(() => !isInitialAdminRoute && sessionStorage.getItem('appLoaded') !== 'true');
  const [showContent, setShowContent] = useState(() => isInitialAdminRoute || sessionStorage.getItem('appLoaded') === 'true');

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
            <Loader
                onComplete={() => {
                    setIsLoading(false);
                    setShowContent(true);
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

          {/* 404 */}
          <Route path="*" element={<div className="text-white p-10">404 - Not Found</div>} />
        </Routes>
      )}
    </>
  );
}

export default App;
