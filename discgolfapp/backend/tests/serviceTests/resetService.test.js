import mongoose from 'mongoose';
import { resetTestData } from '../../src/services/resetService.js';
import User from '../../src/models/User.js';
import ClubPage from '../../src/models/Clubpage.js';
import Course from '../../src/models/Course.js';
import Game from '../../src/models/Game.js';

jest.mock('../../src/models/User.js');
jest.mock('../../src/models/Clubpage.js');
jest.mock('../../src/models/Course.js');
jest.mock('../../src/models/Game.js');
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
}));

describe('resetTestData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should reset test data if user is admin', async () => {
        const mockUserId = new mongoose.Types.ObjectId();

        User.findById.mockImplementation((userId) => {
            if (userId === 'nonAdminUserId') {
                return {
                    select: jest.fn().mockResolvedValue({ _id: userId, role: 'user' }),
                };
            } else if (userId === 'nonExistentUserId') {
                return {
                    select: jest.fn().mockResolvedValue(null),
                };
            } else {
                return {
                    select: jest.fn().mockResolvedValue({ _id: userId, role: 'admin' }),
                };
            }
        });
        User.deleteMany.mockResolvedValue({ deletedCount: 4 });
        ClubPage.deleteMany.mockResolvedValue({ deletedCount: 2 });
        Course.deleteMany.mockResolvedValue({ deletedCount: 3 });
        Game.deleteMany.mockResolvedValue({ deletedCount: 1 });
        User.insertMany.mockResolvedValue({});
        ClubPage.insertMany.mockResolvedValue({});
        Course.insertMany.mockResolvedValue({});

        await resetTestData(mockUserId);

        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(User.deleteMany).toHaveBeenCalled();
        expect(ClubPage.deleteMany).toHaveBeenCalled();
        expect(Course.deleteMany).toHaveBeenCalled();
        expect(Game.deleteMany).toHaveBeenCalled();
        expect(User.insertMany).toHaveBeenCalled();
        expect(ClubPage.insertMany).toHaveBeenCalled();
        expect(Course.insertMany).toHaveBeenCalled();
    });

    it('should throw an error if user is not admin', async () => {
        const mockUserId = 'nonAdminUserId';

        User.findById.mockImplementation(() => ({
            select: jest.fn().mockResolvedValue({ _id: mockUserId, role: 'user' }),
        }));

        await expect(resetTestData(mockUserId)).rejects.toThrow("User is not an admin or does not exist");

        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(User.deleteMany).not.toHaveBeenCalled();
        expect(ClubPage.deleteMany).not.toHaveBeenCalled();
        expect(Course.deleteMany).not.toHaveBeenCalled();
        expect(Game.deleteMany).not.toHaveBeenCalled();
    });

    it('should throw an error if user does not exist', async () => {
        const mockUserId = 'nonExistentUserId';

        User.findById.mockImplementation(() => ({
            select: jest.fn().mockResolvedValue(null),
        }));

        await expect(resetTestData(mockUserId)).rejects.toThrow("User is not an admin or does not exist");

        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(User.deleteMany).not.toHaveBeenCalled();
        expect(ClubPage.deleteMany).not.toHaveBeenCalled();
        expect(Course.deleteMany).not.toHaveBeenCalled();
        expect(Game.deleteMany).not.toHaveBeenCalled();
    });
});
