import jwt from 'jsonwebtoken'

import User from '../models/User.js'

/**
 * @author Lars Andreas Strand
 * @description This file contains the authService, which is responsible for handling authentication-related tasks.
 * It includes functions for generating JWT tokens, refreshing sessions, and verifying tokens.
 * Copilot was used to structure the code and provide suggestions, but the logic and implementation were done by the author.
 * Changes were made to the code based on Copilot's review
 */

/**
 * @author Lars Andreas Strand
 * @description This function generates a JWT token for a user.
 * It takes a user object as input and returns an access token and a refresh token.
 * The access token is signed with the user's ID and role, and has an expiration time set in the environment variables.
 * The refresh token is also signed with the user's ID and role, and has a longer expiration time.
 * The tokens are signed using the secrets stored in the environment variables.
 * @param {String} userId - The ID of the user for whom to generate the token.
 * @return {Object} - An object containing the access token and refresh token.
 * @throws {Error} - If there was an error during the token generation.
 */

const refreshSession = async (userId) => {
    try {
        const user = await User.findById(userId).select('-hashedPassword')

        const payload = { id: user._id, role: user.role }

        const accessExpiration = process.env.JWT_ACCESS_EXPIRATION || '1h'
        const refreshExpiration = process.env.JWT_REFRESH_EXPIRATION || '7d'

        const newAccessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: accessExpiration })
        const newRefreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: refreshExpiration })

        return { newAccessToken, newRefreshToken }
    } catch (err) {
        throw new Error('Error refreshing session: ' + err.message)
    }
}

export { refreshSession }
