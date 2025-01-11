import express from 'express';
import mongoose from 'mongoose';

import webpagesRoutes from './routes/webpagesRoutes.js';
import userRoutes from './routes/userRoutes.js';

/**
 * @author Lars263506 (Github)
 * @description This is the main server file for the Discgolf app, which sets up middleware, routes and database connection, and starts the server
 */

const app = express();

// Middleware to parse JSON bodies and append them to req.body
app.use(express.json());


// Middleware to log request method and path
app.use((req, res, next) => {
    console.log(`Request method: ${req.method}\nRequest path: ${req.path}`);
    next();
});


// Routes for handling requests
app.use('/webpages', webpagesRoutes);
app.use('/users', userRoutes);


// Database connection and server start

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
            console.log("Connected to MongoDB and listening on port", process.env.PORT);
        });
}).catch((error) => {
    console.error("Error connecting to MongoDB: ", error.message);
    console.error("Please check your MongoDB URI and network connection.");
});

