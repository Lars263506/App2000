import { jest } from '@jest/globals'
import { refreshSession } from '../../src/controllers/authController.js'
import * as authService from '../../src/services/authService.js'

/**
 * @author Lars Andreas Strand
 * @description This test file contains unit tests for the authController module.
 * Copilot was used to generate the initial test cases and the initial structure of the tests.
 * The author has modified some mocks and added comments to the code.
 */

describe('authController - refreshSession', () => {
    let mockReq, mockRes

    beforeEach(() => {
        mockReq = {
            user: { id: '123' }
        }
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        jest.clearAllMocks()
    })

    it('should return new access and refresh tokens on success', async () => {
        const mockTokens = {
            newAccessToken: 'access-token',
            newRefreshToken: 'refresh-token'
        }
        jest.spyOn(authService, 'refreshSession').mockResolvedValue(mockTokens)

        await refreshSession(mockReq, mockRes)

        expect(authService.refreshSession).toHaveBeenCalledWith('123')
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith(mockTokens)
    })

    it('should return a 500 status and error message on failure', async () => {
        const mockError = new Error('Something went wrong')
        jest.spyOn(authService, 'refreshSession').mockRejectedValue(mockError)

        await refreshSession(mockReq, mockRes)

        expect(authService.refreshSession).toHaveBeenCalledWith('123')
        expect(mockRes.status).toHaveBeenCalledWith(500)
        expect(mockRes.json).toHaveBeenCalledWith({ error: mockError.message })
    })
})
