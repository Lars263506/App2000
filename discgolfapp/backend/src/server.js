import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'

import passport from './config/passportConfig.js'
import authRoutes from './routes/authRoutes.js'
import clubpageRoutes from './routes/clubpageRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import userRoutes from './routes/userRoutes.js'
import gameRoutes from './routes/gameRoutes.js'
import translationsRoutes from './routes/translationsRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'

/**
 * @author Lars Andreas Strand and Andreas Nilsen
 * @description This is the main server file for the Discgolf app,
 * which sets up middleware, routes and database connection, and starts the server
 */

const app = express()

// Middleware to allow cross-origin requests
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
app.use('/auth', authRoutes)
app.use('/clubpage', clubpageRoutes)
app.use('/course', courseRoutes)
app.use('/settings', settingsRoutes)
app.use('/users', userRoutes)
app.use('/games', gameRoutes)
app.use('/translations', translationsRoutes)
app.use('/reviews', reviewRoutes)

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
