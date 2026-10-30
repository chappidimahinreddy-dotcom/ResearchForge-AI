const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');

const healthRoutes = require('./routes/health');

const app = express();

// 1. Security Headers via Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. Strict CORS Configuration
const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or curl/Postman (origin is undefined)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 3. General Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});
app.use(generalLimiter);

// 4. Request Body Parsers (Memory limits)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Mount Core Routes
app.use('/api', healthRoutes);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));

// Placeholder mounts for upcoming phases (will be replaced by full router modules)
app.use('/api/discovery', (req, res, next) => {
  if (app.locals.discoveryRouter) return app.locals.discoveryRouter(req, res, next);
  next();
});
app.use('/api/explore', require('./routes/explore'));
app.use('/api/documents', (req, res, next) => {
  if (app.locals.documentsRouter) return app.locals.documentsRouter(req, res, next);
  next();
});
app.use('/api/sources', (req, res, next) => {
  if (app.locals.sourcesRouter) return app.locals.sourcesRouter(req, res, next);
  next();
});
app.use('/api/ai', (req, res, next) => {
  if (app.locals.aiRouter) return app.locals.aiRouter(req, res, next);
  next();
});
app.use('/api/reports', (req, res, next) => {
  if (app.locals.reportsRouter) return app.locals.reportsRouter(req, res, next);
  next();
});
app.use('/api/export', (req, res, next) => {
  if (app.locals.exportRouter) return app.locals.exportRouter(req, res, next);
  next();
});
app.use('/api/settings', (req, res, next) => {
  if (app.locals.settingsRouter) return app.locals.settingsRouter(req, res, next);
  next();
});

// 6. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// 7. Centralized Error Handling Middleware
// Never exposes stack traces in production; strips sensitive fields
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const isProduction = env.NODE_ENV === 'production';

  console.error(`[Error] ${req.method} ${req.url} - ${err.message}`);

  res.status(status).json({
    error: err.name || 'InternalServerError',
    message: isProduction && status === 500 ? 'An unexpected internal error occurred.' : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  });
});

module.exports = app;
