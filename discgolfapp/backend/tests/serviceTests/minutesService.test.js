import {
    getMinutes,
    addMinute,
    deleteMinute,
    updateMinute
} from '../../src/services/minutesService.js';
import ClubPage from '../../src/models/Clubpage.js';
import User from '../../src/models/User.js';

jest.mock('../../src/models/Clubpage', () => ({
    findOne: jest.fn().mockImplementation(() => ({
        select: jest.fn().mockResolvedValue({ minutes: [] }),
    })),
    findOneAndUpdate: jest.fn().mockResolvedValue({ minutes: [] }),
}));

jest.mock('../../src/models/User', () => ({
    findById: jest.fn(() => ({
        select: jest.fn().mockResolvedValue({ displayName: 'Test User' }),
    })),
}));

describe('minutesService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getMinutes', () => {
        it('should return minutes for a user if they exist', async () => {
            const mockUser = { displayName: 'Test User' };
            const mockMinutes = [{ id: '1', title: 'Minute 1' }];

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue({ minutes: mockMinutes }),
            });

            const result = await getMinutes('userId');

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(ClubPage.findOne).toHaveBeenCalledWith({
                members: { $elemMatch: { displayName: mockUser.displayName } },
            });
            expect(result).toEqual(mockMinutes);
        });

        it('should return an empty array if no minutes are found', async () => {
            const mockUser = { displayName: 'Test User' };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            const result = await getMinutes('userId');

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(ClubPage.findOne).toHaveBeenCalledWith({
                members: { $elemMatch: { displayName: mockUser.displayName } },
            });
            expect(result).toEqual([]);
        });
    });

    describe('addMinute', () => {
        it('should add a minute if the user is the club owner', async () => {
            const mockClubOwner = { displayName: 'Club Owner' };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockClubOwner),
            });
            ClubPage.findOneAndUpdate.mockResolvedValue({});

            await addMinute('clubOwnerId', '1', 'Title', 'Description', 'Text');

            expect(User.findById).toHaveBeenCalledWith('clubOwnerId');
            expect(ClubPage.findOneAndUpdate).toHaveBeenCalledWith(
                { clubOwner: mockClubOwner.displayName },
                {
                    $push: {
                        minutes: {
                            id: '1',
                            title: 'Title',
                            description: 'Description',
                            text: 'Text',
                        },
                    },
                }
            );
        });

        it('should throw an error if the user is not the club owner', async () => {
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(
                addMinute('clubOwnerId', '1', 'Title', 'Description', 'Text')
            ).rejects.toThrow('User must be the club owner to add minutes.');

            expect(User.findById).toHaveBeenCalledWith('clubOwnerId');
            expect(ClubPage.findOneAndUpdate).not.toHaveBeenCalled();
        });
    });

    describe('deleteMinute', () => {
        it('should delete a minute if the user is the club owner', async () => {
            const mockUser = { displayName: 'Club Owner' };
            const mockMinutes = [{ id: '1', title: 'Minute 1' }];

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.findOneAndUpdate.mockResolvedValue({ minutes: mockMinutes });

            const result = await deleteMinute('clubOwnerId', '1', 'clubId');

            expect(User.findById).toHaveBeenCalledWith('clubOwnerId');
            expect(ClubPage.findOneAndUpdate).toHaveBeenCalledWith(
                { clubOwner: mockUser.displayName, _id: 'clubId' },
                { $pull: { minutes: { id: '1' } } },
                { new: true }
            );
            expect(result).toEqual(mockMinutes);
        });

        it('should throw an error if the club is not found or the user is not the club owner', async () => {
            const mockUser = { displayName: 'Club Owner' };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.findOneAndUpdate.mockResolvedValue(null);

            await expect(
                deleteMinute('clubOwnerId', '1', 'clubId')
            ).rejects.toThrow('Club not found or user is not the club owner.');

            expect(User.findById).toHaveBeenCalledWith('clubOwnerId');
            expect(ClubPage.findOneAndUpdate).toHaveBeenCalledWith(
                { clubOwner: mockUser.displayName, _id: 'clubId' },
                { $pull: { minutes: { id: '1' } } },
                { new: true }
            );
        });
    });

    describe('updateMinute', () => {
        it('should update a minute if the user is the club owner', async () => {
            const mockUser = { displayName: 'Club Owner' };
            const mockUpdatedMinutes = [{ id: '1', title: 'Updated Title' }];

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.findOneAndUpdate.mockResolvedValue({ minutes: mockUpdatedMinutes });

            const result = await updateMinute('userId', '1', 'clubId', {
                title: 'Updated Title',
            });

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(ClubPage.findOneAndUpdate).toHaveBeenCalledWith(
                { clubOwner: mockUser.displayName, _id: 'clubId' },
                { $set: { 'minutes.$[elem].title': 'Updated Title' } },
                { arrayFilters: [{ 'elem.id': '1' }], new: true }
            );
            expect(result).toEqual(mockUpdatedMinutes);
        });

        it('should throw an error if the club is not found or the user is not the club owner', async () => {
            const mockUser = { displayName: 'Club Owner' };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.findOneAndUpdate.mockResolvedValue(null);

            await expect(
                updateMinute('userId', '1', 'clubId', { title: 'Updated Title' })
            ).rejects.toThrow('Club not found or user is not the club owner.');

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(ClubPage.findOneAndUpdate).toHaveBeenCalledWith(
                { clubOwner: mockUser.displayName, _id: 'clubId' },
                { $set: { 'minutes.$[elem].title': 'Updated Title' } },
                { arrayFilters: [{ 'elem.id': '1' }], new: true }
            );
        });
    });
});
