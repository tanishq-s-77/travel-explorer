import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import destinationsRouter from './routes/destinations.js';
import wishlistRouter from './routes/wishlist.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Body parsing
app.use(express.json());

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'travel-explorer-backend',
    env: {
      supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_URL !== 'your_supabase_url_here'),
      openWeatherConfigured: Boolean(process.env.OPENWEATHER_API_KEY && process.env.OPENWEATHER_API_KEY !== 'your_openweathermap_api_key_here'),
      unsplashConfigured: Boolean(process.env.UNSPLASH_ACCESS_KEY && process.env.UNSPLASH_ACCESS_KEY !== 'your_unsplash_access_key_here')
    }
  });
});

// API Routes
app.use('/api/destinations', destinationsRouter);
app.use('/api/wishlist', wishlistRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Travel Explorer API',
    endpoints: {
      health: '/api/health',
      destinations: '/api/destinations',
      destinationDetail: '/api/destinations/:id',
      wishlist: '/api/wishlist'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected server error occurred.'
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 Travel Explorer API running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Destinations: http://localhost:${PORT}/api/destinations`);
  console.log(`========================================`);
});
