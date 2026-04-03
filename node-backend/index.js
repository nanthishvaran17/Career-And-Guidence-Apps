const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const db = require('./database/db'); // Ensure DB is initialized

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: '*', // Allow all origins (for debugging/deployment)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());

// Run Seeder on Startup - MOVED TO db.js
// const seedData = require('./database/seed');
// seedData();
app.use(express.json());

// Routes
const recommendationRoutes = require('./routes/recommendations');
const govtJobRoutes = require('./routes/govt-jobs');
const scholarshipRoutes = require('./routes/scholarships');
const internshipRoutes = require('./routes/internships');
const collegeRoutes = require('./routes/colleges');
const chatbotRoutes = require('./routes/chatbot'); // AI Chatbot Route
const userRoutes = require('./routes/users'); // User Profile Route
const authRoutes = require('./routes/auth'); // Social Auth Route

app.use('/api/recommendations', recommendationRoutes);
app.use('/api/govt-jobs', govtJobRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/chat', chatbotRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
const skillsRoutes = require('./routes/skills');
app.use('/api/skills', skillsRoutes);
const aptitudeRoutes = require('./routes/aptitude');
app.use('/api/aptitude', aptitudeRoutes);
const schoolRoutes = require('./routes/schools');
app.use('/api/schools', schoolRoutes);
const jobRoutes = require('./routes/jobs');
app.use('/api/jobs', jobRoutes);
const securityRoutes = require('./routes/security');
app.use('/api/security', securityRoutes);
const roadmapRoutes = require('./routes/roadmap');
app.use('/api/roadmap', roadmapRoutes);
const advisoryRoutes = require('./routes/advisory');
app.use('/api/advisory', advisoryRoutes);
const resumeRoutes = require('./routes/resume');
app.use('/api/resume', resumeRoutes);


// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from the React app (Unified Build)
const publicPath = path.resolve(__dirname, 'public');

console.log(`[Static] Serving frontend from: ${publicPath} (Exists: ${fs.existsSync(publicPath)})`);

app.use(express.static(publicPath));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error(`[Static] FATAL: index.html not found in ${publicPath}`);
    res.status(404).send("Frontend build not found. System initializing...");
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
 