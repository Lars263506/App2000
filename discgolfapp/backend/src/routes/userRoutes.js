import express from 'express'

import passport from '../config/passportConfig.js'
import upload from '../middleware/uploadMiddleware.js'
import { authorizeAdmin, authorizeClubowner } from '../middleware/authorization.js'
import { optionalAuth } from '../middleware/auth.js'
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter.js'
import {
  getAllUsers,
  getPermissions,
  getProfile,
  getProfileImage,
  getUserClubs,
  getUserGames,
  searchUsers,
  checkIfAdmin,
  hasAccess,
  getUser,
  getUserByEmail,
  registerUser,
  loginUser,
  postProfileImage,
  changeDisplayName,
  changeEmail,
  changePassword,
  changeRole,
  changeUser,
  deleteUser,
  getAllClubOwners
} from '../controllers/userController.js'

/**
 * @author Lars Andreas Strand
 * @description Router for user requests
 * This router handles all the requests related to users.
 * It also handles middleware for authentication and authorization.
 * It uses the passport middleware for authentication
 * and it uses the authorization middleware for authorization.
 * Copilot was used for code and comment structure and some code generation, but the logic is based on my own knowledge.
 */

const router = express.Router()

router.get('/',
  passport.authenticate('jwt', { session: false }),
  authorizeAdmin,
  getAllUsers
)

router.get('/permissions',
  optionalAuth,
  getPermissions
)

router.get('/me',
  passport.authenticate('jwt', { session: false }),
  getProfile
)

router.get('/profile-image/:filename',
  getProfileImage
)

router.get('/my-clubs',
  passport.authenticate('jwt', { session: false }),
  getUserClubs
)

router.get('/my-games',
  passport.authenticate('jwt', { session: false }),
  getUserGames
)

router.get('/admin',
  optionalAuth,
  checkIfAdmin
)

router.get('/has-access',
  optionalAuth,
  authorizeClubowner,
  hasAccess
)

router.get('/search',
  passport.authenticate('jwt', { session: false }),
  searchUsers
);

router.get('/clubowners',
  passport.authenticate('jwt', { session: false }),
  authorizeAdmin,
  getAllClubOwners
);

router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeAdmin,
  getUser
)

router.post('/get-by-email',
  passport.authenticate('jwt', { session: false }),
  authorizeAdmin,
  getUserByEmail
)

router.post('/',
  registerLimiter,
  registerUser
)

router.post('/login',
  loginLimiter,
  loginUser
)

router.post('/update-profile-image',
  passport.authenticate('jwt', { session: false }),
  upload.single('profileImage'),
  postProfileImage
)

router.put('/change-display-name',
  passport.authenticate('jwt', { session: false }),
  changeDisplayName
)

router.put('/change-email',
  passport.authenticate('jwt', { session: false }),
  changeEmail
)

router.put('/change-password',
  passport.authenticate('jwt', { session: false }),
  changePassword
)

router.put('/change-role',
passport.authenticate('jwt', { session: false }),
authorizeAdmin,
changeRole
)

router.put('/',
  passport.authenticate('jwt', { session: false }),
  authorizeAdmin,
  changeUser
)

router.delete('/',
  passport.authenticate('jwt', { session: false }),
  authorizeAdmin,
  deleteUser
)

export default router
