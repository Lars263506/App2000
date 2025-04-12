import dotenv from 'dotenv';
dotenv.config();
console.log("CORS_ORIGIN er satt til:", process.env.CORS_ORIGIN);

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
import MemberModel from './models/member.js'; // Importerer modellen her

/**
 * @author Lars Andreas Strand and Andreas Nilsen
 * @description This is the main server file for the Discgolf app, which sets up middleware, routes and database connection, and starts the server
 */

const app = express();

// Middleware to allow cross-origin requests
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware to parse JSON bodies and append them to req.body
app.use(express.json());

// Middleware to log request method and path
app.use((req, res, next) => {
  console.log(`Request method: ${req.method}\nRequest path: ${req.path}`);
  next();
});

// Passport middleware to authenticate requests
app.use(passport.initialize());

// Rate limiter middleware for all requests
app.use(rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again in 15 minutes.'
}));

// Routes for handling requests
app.use('/clubpage', clubpageRoutes);
app.use('/course', courseRoutes);
app.use('/settings', settingsRoutes);
app.use('/users', userRoutes);
app.use('/games', gameRoutes);

app.patch('/clubpage/members/position', async (req, res) => {
  console.log('PATCH request received:', req.body);
  const { displayName, position } = req.body;
  if (!displayName || !position) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const result = await MemberModel.updateOne(
    { displayName },
    { $set: { position } }
  );

  if (result.modifiedCount > 0) {
    return res.status(204).send();
  } else {
    return res.status(404).json({ error: 'Member not found' });
  }
});

const handlePositionChange = async (index, newPosition) => {
  const updatedMembers = [...members];
  updatedMembers[index].position = newPosition;
  setMembers(updatedMembers);

  const accessToken = localStorage.getItem('accessToken');
  const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/clubpage/members/position`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ position: newPosition }),
    });

    if (response.status === 204 || response.status === 200) {
      toast.success('Position oppdatert!');
    } else if (response.status === 404) {
      toast.error('Endepunktet ble ikke funnet (404). Sjekk backend-konfigurasjonen.');
    } else {
      throw new Error(`Server svarte med status: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    toast.error('Feil ved lagring av position.');
  }
};

/**
 * @param process.env.MONGODB_URI
 * @description Connects to the MongoDB database and starts the server
 * @throws Error if there was an error connecting to the database
 */

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    /**
         * @param process.env.PORT
         * @description Starts the server and listens on the specified port
         * @throws Error if there was an error starting the server
         */
    app.listen(process.env.PORT || 4000, () => {
      console.log('Connected to MongoDB and listening on port', process.env.PORT);
    });
  }).catch((error) => {
    console.error('Error connecting to MongoDB: ', error.message);
    console.error('Please check your MongoDB URI and network connection.');
  });
