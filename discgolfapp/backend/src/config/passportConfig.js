import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import User from '../models/User.js'

/**
 * @author Lars Andreas Strand
 * @description This file contains the configuration for the Passport JWT strategy that is used to authenticate users in the application.
 * It uses the JWT token from the request header to verify the user's identity and retrieve their information from the database.
 * It exports the configured passport instance to be used in the server.js file.
 */

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_SECRET
}

const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const authorizedUser = await User.findById(payload.id)

    if (authorizedUser) {
      done(null, { id: authorizedUser.id, role: authorizedUser.role })
    } else {
      done(null, false)
    }
  } catch (error) {
    done(error, false)
  }
})

passport.use(jwtStrategy)

export default passport
