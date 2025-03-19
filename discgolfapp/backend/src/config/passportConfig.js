import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import User from '../models/User.js'

/**
 * @author Lars263506 (Github)
 * @description This file contains the configuration for the Passport JWT strategy
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
