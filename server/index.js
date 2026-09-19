require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Ensure database initializes and seeds
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets (logos, images, etc.)
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// Vercel Serverless URL Normalizer: Restore original requested path if rewritten while preserving query parameters
app.use((req, res, next) => {
  if (req.query && req.query.url) {
    const targetUrl = req.query.url;
    const queryParams = new URLSearchParams();
    for (const [key, val] of Object.entries(req.query)) {
      if (key !== 'url') {
        queryParams.append(key, val);
      }
    }
    const qs = queryParams.toString();
    req.url = targetUrl + (qs ? `?${qs}` : '');
  } else if (req.headers['x-matched-path']) {
    req.url = req.headers['x-matched-path'];
  } else if (req.headers['x-forwarded-uri']) {
    req.url = req.headers['x-forwarded-uri'];
  } else if (req.url.startsWith('/api/index.js')) {
    req.url = req.url.replace('/api/index.js', '') || '/';
  }
  next();
});

// API Health Check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    message: 'TrekBest API Server is active!',
    timestamp: new Date().toISOString()
  });
});

// Database Health & Persistence Status
app.get(['/api/db-status', '/db-status'], async (req, res) => {
  try {
    const isVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
    const dbStatus = db.getDbStatus ? await db.getDbStatus() : { status: 'unknown' };
    res.json({
      success: true,
      isVercel,
      ...dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Import route handlers
const packageRoutes = require('./routes/packageRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const statsRoutes = require('./routes/statsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Mount routes on BOTH '/api/...' and root so Vercel rewrites work seamlessly
const mountRoutes = (prefix = '') => {
  app.use(`${prefix}/packages`, packageRoutes);
  app.use(`${prefix}/bookings`, bookingRoutes);
  app.use(`${prefix}/invoices`, invoiceRoutes);
  app.use(`${prefix}/stats`, statsRoutes);
  app.use(`${prefix}/contact`, contactRoutes);
  app.use(`${prefix}/reviews`, reviewRoutes);
};

mountRoutes('/api');
mountRoutes('');

// SMTP Email Health & Verification Route
const { testSmtpConnection, isSmtpConfigured } = require('./config/email');
app.get(['/api/email/status', '/email/status'], async (req, res) => {
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

// Any unmatched API route returns JSON 404, never HTML
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: `API route not found: ${req.method} ${req.originalUrl || req.url}` });
});

// Serve React production build if available
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  // Catch-all route for SPA in Express
  app.use((req, res) => {
    // If request was an API call that somehow reached here, return JSON!
    if (req.url.startsWith('/api') || req.path.startsWith('/api') || req.originalUrl?.startsWith('/api')) {
      return res.status(404).json({ success: false, error: `API endpoint not found: ${req.method} ${req.originalUrl || req.url}` });
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Global Error Handler for API errors
app.use((err, req, res, next) => {
  console.error('Express Error:', err);
  if (req.url.startsWith('/api') || req.originalUrl?.startsWith('/api')) {
    return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
  }
  next(err);
});

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
