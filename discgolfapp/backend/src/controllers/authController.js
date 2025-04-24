import * as authService from '../services/authService.js'

/**
 * @author Lars Andreas Strand
 * @description Refreshes the access token and refresh token for the user when it is expired.
 * Copilot was used for code and comment structure and some code generation, but the logic is based on my own knowledge.
 */

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
