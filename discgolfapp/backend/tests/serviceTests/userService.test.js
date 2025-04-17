import {
    getAllUsers,
    getPermissions,
    getProfile,
    getUser,
    getUserByEmail,
    getUserClubs,
    registerUser,
    loginUser,
    deleteUser,
    searchUsers,
} from '../../src/services/userService.js';
import User from '../../src/models/User.js';
import ClubPage from '../../src/models/Clubpage.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../src/models/User', () => ({
    find: jest.fn(),
    findById: jest.fn(() => ({
        select: jest.fn(),
    })),
    findOne: jest.fn(() => ({
        select: jest.fn(),
    })),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    create: jest.fn(),
}));

jest.mock('../../src/models/Clubpage', () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    updateMany: jest.fn(),
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe('userService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('should return all users excluding hashed passwords', async () => {
            const mockUsers = [
                { displayName: 'User1', email: 'user1@example.com' },
                { displayName: 'User2', email: 'user2@example.com' },
            ];

            User.find.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUsers),
            });

            const result = await getAllUsers();

            expect(User.find).toHaveBeenCalledWith({});
            expect(result).toEqual(mockUsers);
        });

        it('should throw an error if no users are found', async () => {
            User.find.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(getAllUsers()).rejects.toThrow('Users not found');
        });
    });

    describe('getPermissions', () => {
        it('should return edit rights if the user is a club owner', async () => {
            const mockUser = { displayName: 'ClubOwner' };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.findOne.mockResolvedValue({});

            const result = await getPermissions('userId');

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(ClubPage.findOne).toHaveBeenCalledWith({ clubOwner: mockUser.displayName });
            expect(result).toEqual({ editRights: true });
        });

        it('should return no edit rights if the user is not a club owner', async () => {
            const mockUser = { displayName: 'RegularUser' };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.findOne.mockResolvedValue(null);

            const result = await getPermissions('userId');

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(ClubPage.findOne).toHaveBeenCalledWith({ clubOwner: mockUser.displayName });
            expect(result).toEqual({ editRights: false });
        });
    });

    describe('getProfile', () => {
        it('should return the user profile excluding sensitive fields', async () => {
            const mockProfile = { displayName: 'User1', email: 'user1@example.com' };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockProfile),
            });

            const result = await getProfile('userId');

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(result).toEqual(mockProfile);
        });

        it('should throw an error if the user is not found', async () => {
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(getProfile('userId')).rejects.toThrow('User not found');
        });
    });

    describe('getUser', () => {
        it('should return a user excluding hashed password', async () => {
            const mockUser = { displayName: 'User1', email: 'user1@example.com' };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await getUser('userId');

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(result).toEqual(mockUser);
        });

        it('should throw an error if the user is not found', async () => {
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(getUser('userId')).rejects.toThrow('User not found');
        });
    });

    describe('getUserByEmail', () => {
        it('should return a user by email excluding hashed password', async () => {
            const mockUser = { displayName: 'User1', email: 'user1@example.com' };

            User.find.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await getUserByEmail('user1@example.com');

            expect(User.find).toHaveBeenCalledWith({ email: 'user1@example.com' });
            expect(result).toEqual(mockUser);
        });

        it('should throw an error if the user is not found', async () => {
            User.find.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(getUserByEmail('user1@example.com')).rejects.toThrow('User not found');
        });
    });

    describe('getUserClubs', () => {
        it('should return a list of clubs the user is a member of', async () => {
            const mockUser = { displayName: 'User1' };
            const mockClubs = [{ name: 'Club1' }, { name: 'Club2' }];

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.find.mockResolvedValue(mockClubs);

            const result = await getUserClubs('userId');

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(ClubPage.find).toHaveBeenCalledWith({ 'members.displayName': mockUser.displayName });
            expect(result).toEqual(mockClubs);
        });

        it('should return an empty array if no clubs are found', async () => {
            const mockUser = { displayName: 'User1' };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.find.mockResolvedValue([]);

            const result = await getUserClubs('userId');

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(ClubPage.find).toHaveBeenCalledWith({ 'members.displayName': mockUser.displayName });
            expect(result).toEqual([]);
        });
    });

    describe('registerUser', () => {
        it('should register a new user and return the creation time', async () => {
            const mockUser = { createdAt: new Date() };
            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.create.mockResolvedValue(mockUser);

            const result = await registerUser('User1', 'user1@example.com', 'password123');

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(User.create).toHaveBeenCalledWith({
                displayName: 'User1',
                email: 'user1@example.com',
                hashedPassword: 'hashedPassword',
                role: 'user',
                emailChangedAt: expect.any(Date),
                passwordChangedAt: expect.any(Date),
                roleChangedAt: expect.any(Date),
            });
            expect(result).toEqual({ createdAt: mockUser.createdAt });
        });

        it('should throw an error if the email is already in use', async () => {
            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.create.mockRejectedValue(new Error('Email is already in use'));

            await expect(registerUser('User1', 'user1@example.com', 'password123')).rejects.toThrow(
                'Email is already in use'
            );
        });
    });

    describe('loginUser', () => {
        it('should log in a user and return tokens', async () => {
            const mockUser = { _id: 'userId', role: 'user', hashedPassword: 'hashedPassword', displayName: 'User1' };
            bcrypt.compare.mockResolvedValue(true);
            User.findOne.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('token');

            const result = await loginUser('user1@example.com', 'password123');

            expect(User.findOne).toHaveBeenCalledWith({ email: 'user1@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
            expect(jwt.sign).toHaveBeenCalledTimes(2);
            expect(result).toEqual({
                accessToken: 'token',
                refreshToken: 'token',
                displayName: 'User1',
            });
        });

        it('should throw an error if the email or password is incorrect', async () => {
            User.findOne.mockResolvedValue(null);

            await expect(loginUser('user1@example.com', 'password123')).rejects.toThrow(
                'Incorrect email or password'
            );
        });
    });

    describe('deleteUser', () => {
        it('should delete a user and return success', async () => {
            User.findOneAndDelete.mockResolvedValue({});

            const result = await deleteUser('user1@example.com');

            expect(User.findOneAndDelete).toHaveBeenCalledWith({ email: 'user1@example.com' });
            expect(result).toEqual({ success: true });
        });

        it('should throw an error if the user is not found', async () => {
            User.findOneAndDelete.mockResolvedValue(null);

            await expect(deleteUser('user1@example.com')).rejects.toThrow('User not found');
        });
    });

    describe('searchUsers', () => {
        it('should return a list of users matching the query', async () => {
            const mockUsers = [
                { displayName: 'User1', email: 'user1@example.com' },
                { displayName: 'User2', email: 'user2@example.com' },
            ];

            User.find.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUsers),
            });

            const result = await searchUsers('User');

            expect(User.find).toHaveBeenCalledWith({
                $or: [
                    { displayName: { $regex: 'User', $options: 'i' } },
                    { email: { $regex: 'User', $options: 'i' } },
                ],
            });
            expect(result).toEqual(mockUsers);
        });

        it('should return an empty array if no users match the query', async () => {
            User.find.mockReturnValue({
                select: jest.fn().mockResolvedValue([]),
            });

            const result = await searchUsers('NonExistentUser');

            expect(User.find).toHaveBeenCalledWith({
                $or: [
                    { displayName: { $regex: 'NonExistentUser', $options: 'i' } },
                    { email: { $regex: 'NonExistentUser', $options: 'i' } },
                ],
            });
            expect(result).toEqual([]);
        });
    });
});
