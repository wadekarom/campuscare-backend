const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const dotenv   = require('dotenv');

dotenv.config();

const app = express();

// ── Middleware ─────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// ── Routes ────────────────────────────────
const authRoutes      = require('./routes/auth.routes');
const labRoutes       = require('./routes/labs.routes');
const complaintRoutes = require('./routes/complaint.routes');
const adminRoutes     = require('./routes/admin.routes');
const technicianRoutes = require('./routes/technician.routes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/labs', labRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/technician', technicianRoutes);

// ── Health check ─────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CampusCare API is running',
    timestamp: new Date().toISOString()
  });
});

// ── 404 handler ──────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`
  });
});

module.exports = app;