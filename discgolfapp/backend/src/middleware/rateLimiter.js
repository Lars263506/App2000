import { rateLimit } from 'express-rate-limit'

/**
 * @author Lars Andreas Strand
 * @description This file contains the rate limiter middleware for the server.
 * It limits the number of requests from a single IP address to prevent abuse and DDoS attacks.
 */

/**
 * @author Lars Andreas Strand
 * @description This rate limiter is used to limit the number of login attempts from a single IP address.
 * It allows a maximum of 5 requests per 15 minutes.
 * If the limit is exceeded, it sends a message to the client indicating that too many login attempts have been made.
 */

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Please try again in 15 minutes.'
})

/**
 * @author Lars Andreas Strand
 * @description This rate limiter is used to limit the number of registration attempts from a single IP address.
 * It allows a maximum of 5 requests per 15 minutes.
 * If the limit is exceeded, it sends a message to the client indicating that too many registration attempts have been made.
 */

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many registration attempts. Please try again in 15 minutes.'
})

export { loginLimiter, registerLimiter }
