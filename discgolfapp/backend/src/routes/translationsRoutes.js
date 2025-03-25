import express from 'express'

import passport from '../config/passportConfig.js'
import { authorizeAdmin } from '../middleware/authorization.js'
import { translationLimiter } from '../middleware/rateLimiter.js'
import {
  getTranslations,
  updateTranslations
} from '../controllers/translationsController.js'

/**
 * @author Lars263506 (Github)
 * @description Router for translations requests
 */
const router = express.Router()

router.get('/',
    translationLimiter,
    getTranslations
)

router.put('/',
  passport.authenticate('jwt', { session: false }),
  authorizeAdmin,
  updateTranslations
)

export default router
