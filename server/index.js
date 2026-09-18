require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Ensure database initializes and seeds
require('./config/db');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets (logos, images, etc.)
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TrekBest SQLite + Node.js API Server is active!',
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// SMTP Email Health & Verification Route
const { testSmtpConnection, isSmtpConfigured } = require('./config/email');
app.get('/api/email/status', async (req, res) => {
  const configured = isSmtpConfigured();
  if (!configured) {
    return res.json({
      configured: false,
      message: 'SMTP is currently in simulation mode. Add SMTP_USER and SMTP_PASS in .env to send real emails.'
    });
  }
  const result = await testSmtpConnection();
  res.json({ configured: true, ...result });
});

// Serve React production build if available
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  // Catch-all route for SPA in Express 5
  app.use((req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    const dbType = (process.env.DB_TYPE || 'postgres').toUpperCase();
    const dbTarget = dbType === 'POSTGRES' 
      ? `PostgreSQL (${process.env.PG_HOST || 'localhost'}:${process.env.PG_PORT || 5432}/${process.env.PG_DATABASE || 'trekbest'})`
      : `SQLite (${process.env.DB_PATH || 'data/trekbest.db'})`;

    console.log('====================================================');
    console.log(`🚀 TrekBest Backend Server running on http://localhost:${PORT}`);
    console.log(`🗄️ Database: ${dbTarget}`);
    console.log('====================================================');
  });
}

module.exports = app;
