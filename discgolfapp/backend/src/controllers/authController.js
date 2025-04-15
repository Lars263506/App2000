import * as authService from '../services/authService.js'

const refreshSession = async (req, res) => {
    try {
        const userId = req.user.id
        const { newAccessToken, newRefreshToken } = await authService.refreshSession(userId)
        res.status(200).json({ newAccessToken, newRefreshToken })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export { refreshSession }
