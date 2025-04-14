import express from 'express'
import passport from 'passport'

import { optionalAuth, validateSession, validateRefreshToken } from '../middleware/auth.js'
import { refreshSession } from '../controllers/authController.js'


const router = express.Router()

router.get('/validate-session',
  optionalAuth,
  validateSession
)

router.get('/refresh-session',
  validateRefreshToken,
  refreshSession
)

export default router
