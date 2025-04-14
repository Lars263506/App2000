import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';

import passport from './config/passportConfig.js';
import clubpageRoutes from './routes/clubpageRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import gameRoutes from './routes/gameRoutes.js';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`Request method: ${req.method}\nRequest path: ${req.path}`);
  next();
});

app.use(passport.initialize());
app.use(rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again in 15 minutes.'
}));

// Route registration
app.use('/clubpage', clubpageRoutes);
app.use('/course', courseRoutes);
app.use('/settings', settingsRoutes);
app.use('/users', userRoutes);
app.use('/games', gameRoutes);

// MongoDB init
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log('Connected to MongoDB and listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB: ', error.message);
    console.error('Please check your MongoDB URI and network connection.');
  });
