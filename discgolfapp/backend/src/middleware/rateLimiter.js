import { rateLimit } from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Please try again in 15 minutes.'
})

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many registration attempts. Please try again in 15 minutes.'
})

const translationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many translation requests. Please try again in 15 minutes.'
})

export { loginLimiter, registerLimiter, translationLimiter }
