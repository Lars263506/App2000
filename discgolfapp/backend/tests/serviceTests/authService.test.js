import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { refreshSession } from '../../src/services/authService.js';
import User from '../../src/models/User.js';

jest.mock('../../src/models/User', () => ({
    findById: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe('refreshSession', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should refresh session tokens for a valid user', async () => {
        const mockUserId = new mongoose.Types.ObjectId();
        const mockUser = { _id: mockUserId, role: 'user' };
        const mockAccessToken = 'newAccessToken';
        const mockRefreshToken = 'newRefreshToken';

        User.findById.mockReturnValue({
            select: jest.fn(() => Promise.resolve(mockUser)),
        });
        jwt.sign
            .mockReturnValueOnce(mockAccessToken) // For access token
            .mockReturnValueOnce(mockRefreshToken); // For refresh token

        const result = await refreshSession(mockUserId);

        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(jwt.sign).toHaveBeenCalledTimes(2);
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: mockUser._id, role: mockUser.role },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '1h' }
        );
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: mockUser._id, role: mockUser.role },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
        );
        expect(result).toEqual({ newAccessToken: mockAccessToken, newRefreshToken: mockRefreshToken });
    });

    it('should throw an error if user does not exist', async () => {
        const mockUserId = new mongoose.Types.ObjectId();

        User.findById.mockReturnValue({
            select: jest.fn(() => Promise.resolve(null)),
        });

        await expect(refreshSession(mockUserId)).rejects.toThrow('Error refreshing session: Cannot read properties of null (reading \'_id\')');

        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw an error if there is an issue with token generation', async () => {
        const mockUserId = new mongoose.Types.ObjectId();
        const mockUser = { _id: mockUserId, role: 'user' };

        User.findById.mockReturnValue({
            select: jest.fn(() => Promise.resolve(mockUser)),
        });
        jwt.sign.mockImplementation(() => {
            throw new Error('Token generation failed');
        });

        await expect(refreshSession(mockUserId)).rejects.toThrow('Error refreshing session: Token generation failed');

        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(jwt.sign).toHaveBeenCalled();
    });
});
