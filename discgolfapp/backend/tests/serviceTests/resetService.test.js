import mongoose from 'mongoose';
import { resetTestData } from '../../src/services/resetService.js';
import User from '../../src/models/User';
import ClubPage from '../../src/models/Clubpage';
import Course from '../../src/models/Course';
import Game from '../../src/models/Game';

jest.mock('../../src/models/User', () => ({
    deleteMany: jest.fn(),
    findById: jest.fn(),
    insertMany: jest.fn(),
}));

jest.mock('../../src/models/Clubpage', () => ({
    deleteMany: jest.fn(),
    insertMany: jest.fn(),
}));

jest.mock('../../src/models/Course', () => ({
    deleteMany: jest.fn(),
    insertMany: jest.fn(),
}));

jest.mock('../../src/models/Game', () => ({
    deleteMany: jest.fn(),
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
}));

jest.mock('mongoose', () => {
    const actualMongoose = jest.requireActual('mongoose');
    return {
        ...actualMongoose,
        startSession: jest.fn().mockReturnValue({
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        }),
    };
});

describe('resetTestData', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should reset test data if user is admin', async () => {
        const mockUserId = new mongoose.Types.ObjectId();

        // Mock User.findById to return an admin user with a session method
        User.findById.mockImplementation((userId) => ({
            select: jest.fn().mockReturnValue({
                session: jest.fn().mockResolvedValue({ _id: userId, role: 'admin' }),
            }),
        }));

        // Mock deleteMany and insertMany methods
        User.deleteMany.mockResolvedValue({ deletedCount: 4 });
        ClubPage.deleteMany.mockResolvedValue({ deletedCount: 2 });
        Course.deleteMany.mockResolvedValue({ deletedCount: 3 });
        Game.deleteMany.mockResolvedValue({ deletedCount: 1 });
        User.insertMany.mockResolvedValue({});
        ClubPage.insertMany.mockResolvedValue({});
        Course.insertMany.mockResolvedValue({});

        // Call the function
        await resetTestData(mockUserId);

        // Verify session methods are called
        const session = mongoose.startSession.mock.results[0].value;
        expect(session.startTransaction).toHaveBeenCalled();
        expect(session.commitTransaction).toHaveBeenCalled();
        expect(session.endSession).toHaveBeenCalled();

        // Verify database operations
        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(User.deleteMany).toHaveBeenCalledWith({}, { session });
        expect(ClubPage.deleteMany).toHaveBeenCalledWith({}, { session });
        expect(Course.deleteMany).toHaveBeenCalledWith({}, { session });
        expect(Game.deleteMany).toHaveBeenCalledWith({}, { session });
        expect(User.insertMany).toHaveBeenCalledWith(expect.any(Array), { session });
        expect(ClubPage.insertMany).toHaveBeenCalledWith(expect.any(Array), { session });
        expect(Course.insertMany).toHaveBeenCalledWith(expect.any(Array), { session });
    });

    it('should throw an error if user is not admin', async () => {
        const mockUserId = 'nonAdminUserId';

        User.findById.mockImplementation((userId) => ({
            select: jest.fn().mockReturnValue({
                session: jest.fn().mockResolvedValue({ _id: userId, role: 'user' }),
            }),
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
            select: jest.fn().mockReturnValue({
                session: jest.fn().mockResolvedValue(null),
            }),
        }));

        await expect(resetTestData(mockUserId)).rejects.toThrow("User is not an admin or does not exist");

        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(User.deleteMany).not.toHaveBeenCalled();
        expect(ClubPage.deleteMany).not.toHaveBeenCalled();
        expect(Course.deleteMany).not.toHaveBeenCalled();
        expect(Game.deleteMany).not.toHaveBeenCalled();
    });
});
