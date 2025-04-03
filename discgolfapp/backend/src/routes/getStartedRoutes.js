import express from 'express'
import { getGetStartedContent, saveGetStartedContent } from '../controllers/getStartedController.js'
import passport from '../config/passportConfig.js'
import { authorizeAdmin } from '../middleware/authorization.js'

const router = express.Router()

// GET: Hent lagret "Kom i gang"-innhold
router.get('/', getGetStartedContent)

// POST: Opprett eller oppdater innhold – krever admin
router.post('/',
  passport.authenticate('jwt', { session: false }),
  authorizeAdmin,
  saveGetStartedContent
)

export default router
