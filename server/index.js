import dotenv from 'dotenv';

// Load environment variables first, before any other imports
const result = dotenv.config();

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
} else {
  console.log('✅ .env file loaded successfully');
}

// Debug environment variables immediately after loading
console.log('🔍 Environment variables check:', {
  hasMongoUri: !!process.env.MONGO_URI,
  hasResendKey: !!process.env.RESEND_API_KEY,
  hasClientUrl: !!process.env.CLIENT_URL,
  resendKeyStart: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 3) : 'none',
  mongoUri: process.env.MONGO_URI ? 'set' : 'not set'
});

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import tournamentRoute from './routes/tournaments.js';
import registrationRoute from './routes/Registration.js';
import webhookRoute from './routes/webhooks.js';
import tournamentRoutes from './routes/tournamentRoutes.js';
import Registration from './models/Registration.js';

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/tournaments', tournamentRoute);
app.use('/api/registration', registrationRoute);
app.use('/api/webhooks', webhookRoute);
app.use('/api/v1/tournaments', tournamentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

//health check
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// ✅ Add this conditional to avoid trying to load .env on Render
if (process.env.NODE_ENV !== 'production') {
  import('dotenv').then(dotenv => dotenv.config());
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 