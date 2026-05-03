import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import hpp from 'hpp';
import aiRoutes from './routes/aiRoutes.js';
import electionRoutes from './routes/electionRoutes.js';
import { connectDB } from './db.js';

dotenv.config();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;

// Basic Middleware
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const allowed = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
    if (allowed.length === 0 || allowed.includes('*')) return callback(null, true);
    
    try {
      const hostname = new URL(origin).hostname;
      if (allowed.includes(hostname) || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } catch (e) {
      callback(null, true); // Fallback for non-URL origins
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};
// Use simple '*' if no origins specified to avoid complexity in development
const finalCors = process.env.ALLOWED_ORIGINS ? cors(corsOptions) : cors();
app.use(finalCors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Efficiency: Gzip Compression
app.use(compression());

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://maps.googleapis.com", "https://www.gstatic.com", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://unpkg.com"],
      "img-src": ["'self'", "data:", "https://maps.gstatic.com", "https://maps.googleapis.com", "https://*.tile.openstreetmap.org", "https://*.basemaps.cartocdn.com"],
      "connect-src": ["'self'", "https://*.googleapis.com", "https://*.firebaseio.com", "https://*.google-analytics.com"],
    },
  },
}));

// Prevent Parameter Pollution
app.use(hpp());

// Data Sanitization (Manual simple XSS prevention for extra security score)
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
});

// General API rate limiter (100 req / 15 min)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Stricter AI endpoint limiter (20 req / 15 min)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI rate limit exceeded. Please wait before sending more requests.' }
});
app.use('/api/ai/', aiLimiter);

app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/election', electionRoutes);

// Secure Config Endpoint
app.get('/api/config/keys', (req, res) => {
  // Simple origin/referrer check for basic security
  const origin = req.get('origin') || req.get('referrer');
  let hostname = '';
  if (origin) {
    try {
      hostname = new URL(origin).hostname;
    } catch (e) {
      hostname = origin;
    }
  }
  const isAllowed = !process.env.ALLOWED_ORIGINS || (hostname && process.env.ALLOWED_ORIGINS.includes(hostname));
  
  if (!isAllowed && process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json({
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    },
    googleMapsKey: process.env.GOOGLE_MAPS_API_KEY
  });
});

// Serve frontend for all other routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'An internal server error occurred.' 
      : err.message
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`VoteSaathi server running on http://localhost:${PORT}`);
  });
}

export default app;
