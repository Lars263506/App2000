import ClubPage from '../../src/models/Clubpage.js';
import User from '../../src/models/User.js';
import {
    getClubPage,
    isOwner
} from '../../src/services/clubpageService.js';

jest.mock('../../src/models/Clubpage', () => ({
    findById: jest.fn(() => ({
        select: jest.fn().mockResolvedValue(null),
    })),
    findOne: jest.fn(),
}));

jest.mock('../../src/models/User', () => ({
    findById: jest.fn(() => ({
        select: jest.fn().mockResolvedValue(null),
    })),
}));

describe('clubpageService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getClubPage', () => {
        it('should return the club page if it exists', async () => {
            const mockClubPage = { id: '1', name: 'Test Club' };
            ClubPage.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockClubPage),
            });

            const result = await getClubPage('1');

            expect(ClubPage.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockClubPage);
    });

        it('should throw an error if the club page does not exist', async () => {
            ClubPage.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(getClubPage('1')).rejects.toThrow('Club page not found');

            expect(ClubPage.findById).toHaveBeenCalledWith('1');
        });
    });

    describe('isOwner', () => {
        it('should return true if the user is the owner of the club', async () => {
            const mockUser = { displayName: 'Test User' };
            const mockClubPage = { id: 'clubId', clubOwner: 'Test User' };
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockClubPage),
            });

            const result = await isOwner('clubId', 'userId');

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(ClubPage.findOne).toHaveBeenCalledWith({ _id: 'clubId', clubOwner: 'Test User' });
            expect(result).toBe(true);
        });

        it('should return false if the user is not the owner of the club', async () => {
            const mockUser = { displayName: 'Test User' };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            const result = await isOwner('clubId', 'userId');

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(ClubPage.findOne).toHaveBeenCalledWith({ _id: 'clubId', clubOwner: 'Test User' });
        });

        it('should throw an error if the user does not exist', async () => {
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(isOwner('clubId', 'userId')).rejects.toThrow('User not found');

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(ClubPage.findOne).not.toHaveBeenCalled();
        });
    });
});
