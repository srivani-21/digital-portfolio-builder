// server.js - Entry point of the backend application

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
// Allow JSON data in request body
app.use(express.json());

// Allow requests from the React frontend (running on a different port)
app.use(cors());

// ─── Routes ────────────────────────────────────────────────────────────────────
// We'll plug in routes here as we build them
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/admin', adminRoutes);

// ─── Health Check Route ─────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Digital Portfolio Builder API is running...');
});

// ─── Start Server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});