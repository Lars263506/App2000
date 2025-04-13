import express from 'express'

import passport from '../config/passportConfig.js'
import { authorizeAdmin, authorizeClubowner } from '../middleware/authorization.js'
import {
  getAllClubPages,
  getClubPage,
  getView,
  isMember,
  getMembers,
  getInvitations,
  getAnnouncements,
  addInvitation,
  createNewMember,
  createNewClubPage,
  createNewAnnouncement,
  deleteInvitation,
  deleteClubPage,
  updateInvitation,
  updateAnnouncement,
  updateClubPage
} from '../controllers/clubpageController.js'
import {

} from '../controllers/invitationsController.js'
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

router.get('/is-member/:clubId',
  checkMemberStatus,
  isMember
)

router.get('/members/',
  passport.authenticate('jwt', { session: false }),
  getMembers
)

router.get('/invitations',
  passport.authenticate('jwt', { session: false }),
  checkMemberStatus,
  getInvitations
);

router.get('/announcements/',
  passport.authenticate('jwt', { session: false }),
  getAnnouncements
)

router.get('/:id',
  optionalAuth,
  getClubPage
)

router.post('/join/:clubId',
  passport.authenticate('jwt', { session: false }),
  createNewMember
)

router.post('/invitations',
  passport.authenticate('jwt', { session: false }),
  authorizeClubowner,
  addInvitation
);

router.post('/',
  passport.authenticate('jwt', { session: false }),
  authorizeAdmin,
  createNewClubPage
)

router.post('/announcements/:clubId',
  passport.authenticate('jwt', { session: false }),
  authorizeClubowner,
  createNewAnnouncement
)

router.delete('/invitations/:invitationId',
  passport.authenticate('jwt', { session: false }),
  authorizeClubowner,
  deleteInvitation
);

router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeAdmin,
  deleteClubPage
)

router.put('/announcements/:clubId/:index',
  passport.authenticate('jwt', { session: false }),
  authorizeClubowner,
  updateAnnouncement
)

router.put('/invitations',
  passport.authenticate('jwt', { session: false }),
  authorizeClubowner,
  updateInvitation
);

router.put('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeAdmin,
  updateClubPage
)

export default router
