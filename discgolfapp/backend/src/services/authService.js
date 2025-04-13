import jwt from 'jsonwebtoken'

import User from '../models/User.js'

const refreshSession = async (userId) => {
    try {
        const user = User.findById(userId).select('-hashedPassword')

        const payload = { id: user._id, role: user.role }

        const newAccessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '10s' })
        const newRefreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })

        return { newAccessToken, newRefreshToken }
    } catch (err) {
        throw new Error('Error refreshing session: ' + err.message)
    }
}

export { refreshSession }
