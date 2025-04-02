import express from 'express'

import passport from '../config/passportConfig.js'
import { authorizeAdmin } from '../middleware/authorization.js'
import {
  getAllClubPages,
  getClubPage,
  getView,
  getMembers,
  createNewClubPage,
  deleteClubPage,
  updateClubPage
} from '../controllers/clubpageController.js'
import { checkMemberStatus, optionalAuth } from '../middleware/auth.js'

/**
 * @author Lars263506 (Github)
 * @description Router for webpage requests
 */

const router = express.Router()

/** 
 * @author Lars Andreas Strand
 * @description This router handles all the requests related to club pages.
 * It also handles middleware for authentication and authorization.
 * It uses the passport middleware for authentication 
 * and it uses the authorization middleware for authorization.
 */

router.get('/',
  getAllClubPages
)

router.get('/view/:id',
  checkMemberStatus,
  getView
)

router.get('/members/',
  passport.authenticate('jwt', { session: false }),
  getMembers
)

router.get('/:id',
  optionalAuth,
  getClubPage
)

router.post('/',
  passport.authenticate('jwt', { session: false }),
  authorizeAdmin,
  createNewClubPage
)

router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeAdmin,
  deleteClubPage
)

router.put('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeAdmin,
  updateClubPage
)

export default router
