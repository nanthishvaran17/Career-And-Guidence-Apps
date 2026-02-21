const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const db = require('./database/db'); // Ensure DB is initialized

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: '*', // Allow all origins (for debugging/deployment)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

app.use('/api/recommendations', recommendationRoutes);
app.use('/api/govt-jobs', govtJobRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/chat', chatbotRoutes);
app.use('/api/users', userRoutes);
const skillsRoutes = require('./routes/skills');
app.use('/api/skills', skillsRoutes);
const aptitudeRoutes = require('./routes/aptitude');
app.use('/api/aptitude', aptitudeRoutes);
const schoolRoutes = require('./routes/schools');
app.use('/api/schools', schoolRoutes);
const jobRoutes = require('./routes/jobs');
app.use('/api/jobs', jobRoutes);

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
