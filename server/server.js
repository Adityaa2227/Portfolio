const express = require('express'); // Restored
const mongoose = require('mongoose'); // Restored
const cors = require('cors'); // Restored
const helmet = require('helmet'); // Restored
const morgan = require('morgan'); // Restored
const path = require('path'); // Restored
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); // Restored

const http = require('http'); // Import http
const { Server } = require('socket.io'); // Import Socket.io
const Session = require('./models/Session'); // Import Session model

const app = express();
const server = http.createServer(app); // Create HTTP server

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: ['https://adityaagarwalportfolio.vercel.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Socket Handling
io.on('connection', (socket) => {
  // console.log('New client connected:', socket.id);

  socket.on('analytics:init', async (data) => {
    try {
      // Create new session
      const session = await Session.create({
        socketId: socket.id,
        visitorId: data.visitorId,
        ipHash: data.ipHash || 'unknown',
        deviceType: data.deviceType,
        os: data.os,
        browser: data.browser,
        country: data.country,
        city: data.city,
        isOnline: true,
        startTime: new Date(),
        lastActive: new Date()
      });
      socket.sessionId = session._id;
      
      // Broadcast live count
      const liveCount = await Session.countDocuments({ isOnline: true });
      io.emit('analytics:liveUpdate', { liveUsers: liveCount });
    } catch (err) {
      console.error('Analytics Init Error:', err);
    }
  });

  socket.on('analytics:pageview', async (data) => {
    if (!socket.sessionId) return;
    try {
      await Session.findByIdAndUpdate(socket.sessionId, {
        $push: { 
          pagesVisited: { path: data.path, timestamp: new Date() } 
        },
        $inc: { pageCount: 1 },
        lastActive: new Date()
      });
    } catch (err) {
      console.error('Pageview Error:', err);
    }
  });

  socket.on('disconnect', async () => {
    if (socket.sessionId) {
      try {
        const session = await Session.findById(socket.sessionId);
        if (session) {
            const duration = (new Date() - new Date(session.startTime)) / 1000;
            session.isOnline = false;
            session.endedAt = new Date();
            session.duration = duration;
            await session.save();
        }
        
        // Broadcast live count
        const liveCount = await Session.countDocuments({ isOnline: true });
        io.emit('analytics:liveUpdate', { liveUsers: liveCount });
      } catch (err) {
        console.error('Disconnect Error:', err);
      }
    }
  });
});

app.use(cors({
  origin: ['https://adityaagarwalportfolio.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(helmet({
  crossOriginResourcePolicy: false, 
}));
app.use(morgan('common'));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Placeholder
if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    res.send('Portfolio API is running...');
  });
}

// Import Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const socialRoutes = require('./routes/socialRoutes');
const contactRoutes = require('./routes/contactRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const codingProfileRoutes = require('./routes/codingProfileRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes'); // Import Analytics

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/socials', socialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/coding-profiles', codingProfileRoutes);
app.use('/api/bio', require('./routes/bioRoutes'));
app.use('/api/analytics', analyticsRoutes); // Use Analytics

// ... (Error middleware stays the same) ...

const PORT = process.env.PORT || 5000;

// Connect to DB and Start Server
const connectDB = require('./config/db');
connectDB().then(() => {
  // Use server.listen instead of app.listen
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
});
