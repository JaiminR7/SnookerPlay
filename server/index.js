import dotenv from 'dotenv';

// Load environment variables
const result = dotenv.config();

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
} else {
  console.log('✅ .env file loaded successfully');
}

// Debug environment variables on startup
console.log('🔍 Environment variables check:', {
  hasMongoUri: !!process.env.MONGO_URI,
  hasClientUrl: !!process.env.CLIENT_URL,
  mongoUri: process.env.MONGO_URI ? 'set' : 'not set'
});

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import tournamentRoute from './routes/tournaments.js';
import registrationRoute from './routes/Registration.js';
import webhookRoute from './routes/webhooks.js';
import tournamentRoutes from './routes/tournamentRoutes.js';
import emailTestRoute from './routes/emailTest.js';

const app = express();

// ✅ Use dynamic CORS with multiple origins for development
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Request logging middleware (ignores /healthz)
app.use((req, res, next) => {
  if (req.path !== '/healthz') {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

// Health check route for Vercel monitoring
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API Routes
app.use('/api/tournaments', tournamentRoute);
app.use('/api/registration', registrationRoute);
app.use('/api/webhooks', webhookRoute);
app.use('/api/v1/tournaments', tournamentRoutes);
app.use('/api/email-test', emailTestRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
