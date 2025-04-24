import express from 'express'

import { optionalAuth, validateSession, validateRefreshToken } from '../middleware/auth.js'
import { refreshSession } from '../controllers/authController.js'

/**
 * @author Lars Andreas Strand
 * @description This is the auth routes file.
 * It defines the routes for authentication related operations.
 * Copilot was used for code and comment structure and some code generation, but the logic is based on my own knowledge.
 */

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
