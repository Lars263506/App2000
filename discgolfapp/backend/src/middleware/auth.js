import passport from '../config/passportConfig.js'
import User from '../models/User.js'
import ClubPage from '../models/Clubpage.js'

/**
 * @author Lars Andreas Strand
 * @description This file contains the middleware functions for authentication and authorization.
 * It uses the Passport JWT strategy to authenticate users and check their roles.
 * Each function returns a middleware function that can be used in the routes to protect them or provide role-based access control.
 */

/**
 * @author Lars Andreas Strand
 * @description This middleware function checks if the user is authenticated and is a member of the club.
 *  It uses the Passport JWT strategy to authenticate the user and checks their role.
 *  If the user is authenticated and is a member of the club, it sets the logged in user to have the role of 'member'.
 *  If the user is not authenticated, it sets the role to 'user'.
 *  If the user is authenticated but not a member of the club, it sets the role to 'user'.
 */

const checkMemberStatus = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (error, user) => {
    if (error) return next(error)
    if (!user) {
      req.user = { role: 'user' }
      return next()
    }
    if (req.header('Authorization') === undefined) {
      req.user = { role: 'user' }
      return next()
    }

    if (user.role === 'clubowner' || user.role === 'admin') {
      req.user = user
      return next()
    }

    try {
      const member = await User.findById({ _id: user.id }).select('-hashedPassword')

      if (!member) {
        req.user = { ...user, role: 'user' }
        return next()
      }

      console.log('Member:', member)

      const isMember = await ClubPage.findOne(
        { _id: req.params.clubId, "members.displayName": member.displayName }
      )

      req.user = { ...user, role: isMember ? 'member' : 'user' }
      return next()
    } catch (err) {
      return next(err)
    }
  })(req, res, next)
}

/**
 * @author Lars Andreas Strand
 * @description This middleware function checks if the user is authenticated and sets the user role to 'user' if not.
 * It uses the Passport JWT strategy to authenticate the user.
 * If the user is authenticated, it sets the user role to the authenticated user's role.
 * If the user is not authenticated, it sets the role to 'user'.
 * It is used to provide optional authentication for routes that do not require authentication,
 * but still want to provide the user's role from the JWT token.
 */

const optionalAuth = (req, res, next) => {
  if (req.header('Authorization')) {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err) return next(err)
      req.user = user
      return next()
    })(req, res, next)
  } else {
    req.user = { role: 'user' }
    next()
  }
}

export { checkMemberStatus, optionalAuth }
