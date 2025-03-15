import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'

import passport from './config/passportConfig.js'
import clubpageRoutes from './routes/clubpageRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import elementRoutes from './routes/elementRoutes.js'
import userRoutes from './routes/userRoutes.js'
import User from './models/User.js'
import multer from 'multer';
import { GridFSBucket } from 'mongodb';

/**
 * @author Lars263506 (Github)
 * @author Andreas Nilsen line 56-124
 * @description This is the main server file for the Discgolf app, which sets up middleware, routes and database connection, and starts the server
 */

const app = express()

// Middleware to allow cross-origin requests
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

// Middleware to parse JSON bodies and append them to req.body
app.use(express.json())

// Middleware to log request method and path
app.use((req, res, next) => {
  console.log(`Request method: ${req.method}\nRequest path: ${req.path}`)
  next()
})

// Passport middleware to authenticate requests
app.use(passport.initialize())

// Rate limiter middleware for all requests
app.use(rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again in 15 minutes.'
}))

// Routes for handling requests
app.use('/clubpage', clubpageRoutes)
app.use('/course', courseRoutes)
app.use('/element', elementRoutes)
app.use('/users', userRoutes)

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
      console.log('Connected to MongoDB and listening on port', process.env.PORT)
    })
  }).catch((error) => {
    console.error('Error connecting to MongoDB: ', error.message)
    console.error('Please check your MongoDB URI and network connection.')
  })
