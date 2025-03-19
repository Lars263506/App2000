import express from 'express'

import passport from '../config/passportConfig.js'
import { authorizeAdmin } from '../middleware/authorization.js'
import {
  getSettings,
  grantSetting,
  revokeSetting
} from '../controllers/settingsController.js'

/**
 * @author Lars263506 (Github)
 * @description Router for webpage requests
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
