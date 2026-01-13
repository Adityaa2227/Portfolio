import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import UAParser from 'ua-parser-js';
import { v4 as uuidv4 } from 'uuid';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AnalyticsTracker = () => {
  const location = useLocation();
  const socketRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    // 1. Initialize Socket Connection
    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
    });

    // 2. Gather User Data
    const parser = new UAParser();
    const result = parser.getResult();
    
    // Persistent Visitor ID
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem('visitorId', visitorId);
    }

    // 3. Init Session
    // Fetch generic location data if possible (client-side simplified)
    // For now we send what we have
    socketRef.current.emit('analytics:init', {
      visitorId,
      deviceType: result.device.type || 'desktop',
      os: result.os.name,
      browser: result.browser.name,
      // IP/Location is strictly handled better on server-side or via separate service, 
      // but we send placeholders if needed. Server can deduce IP.
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // 4. Track Page Views
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.emit('analytics:pageview', {
        path: location.pathname
      });
    }
  }, [location]);

  return null; // Headless component
};

export default AnalyticsTracker;
