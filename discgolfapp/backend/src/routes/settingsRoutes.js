import express from 'express'

import passport from '../config/passportConfig.js'
import { authorizeAdmin } from '../middleware/authorization.js'
import {
  getSettings,
  grantSetting,
  revokeSetting
} from '../controllers/settingsController.js'

/**
 * @author Lars Andreas Strand
 * @description Router for settings requests
 * This router handles all the requests related to settings.
 * It also handles middleware for authentication and authorization.
 * It uses the passport middleware for authentication
 * and it uses the authorization middleware for authorization.
 */

const router = express.Router()

router.get('/',
    passport.authenticate('jwt', { session: false }),
    authorizeAdmin,
    getSettings
)

router.post('/',
  passport.authenticate('jwt', { session: false }),
  authorizeAdmin,
  grantSetting
)

router.delete('/',
  passport.authenticate('jwt', { session: false }),
  authorizeAdmin,
  revokeSetting
)

export default router
