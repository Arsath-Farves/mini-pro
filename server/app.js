require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET environment variable is missing.");
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI environment variable is missing.");
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const recommendationRoutes = require('./routes/recommendations');
const forumRoutes = require('./routes/forum');
const projectRoutes = require('./routes/projects');
const path = require('path');

const app = express();

// ── Connect to MongoDB ─────────────────────────────────
connectDB();

// ── Middleware ─────────────────────────────────────────
app.use(cors({ 
  origin: [
    'http://localhost:5173', 
    process.env.CLIENT_URL // Ensure this is set in Render
  ], 
  credentials: true 
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/projects', projectRoutes);

// ── Health Check ───────────────────────────────────────
app.get('/api/status', (req, res) => {
  res.json({ message: 'Backend is Live — Week 2 Auth Active 🔐' });
});

// ── Start Server ───────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Bharat-Setu Server running on http://localhost:${PORT}`);
  console.log(`🔐 JWT Secret loaded: ${process.env.JWT_SECRET ? 'YES ✅' : 'NO ❌'}`);
  console.log(`📦 MongoDB URI: ${process.env.MONGO_URI}`);
});