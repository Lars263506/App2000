import jwt from 'jsonwebtoken'

import User from '../models/User.js'

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
