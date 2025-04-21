import {
    getInvitations,
    addInvitation,
    deleteInvitation,
    updateInvitation
} from '../../src/services/invitationsService.js';
import ClubPage from '../../src/models/Clubpage.js';
import User from '../../src/models/User.js';

jest.mock('../../src/models/Clubpage', () => ({
    findOne: jest.fn().mockImplementation(() => ({
        select: jest.fn().mockResolvedValue({ invitations: [] }),
    })),
    findOneAndUpdate: jest.fn().mockResolvedValue({ invitations: [] }),
}));

jest.mock('../../src/models/User', () => ({
    findById: jest.fn(() => ({
        select: jest.fn().mockResolvedValue({ displayName: 'Test User' }),
    })),
}));

describe('invitationsService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getInvitations', () => {
        it('should return invitations for a user if they exist', async () => {
            const mockUser = { displayName: 'Test User' };
            const mockInvitations = [{ id: '1', title: 'Invitation 1' }];

            // Set up mocks for this test
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue({ invitations: mockInvitations }),
            });

            const result = await getInvitations('userId');

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(ClubPage.findOne).toHaveBeenCalledWith({
                members: { $elemMatch: { displayName: mockUser.displayName } },
            });
            expect(result).toEqual(mockInvitations);
        });

        it('should return an empty array if no invitations are found', async () => {
            const mockUser = { displayName: 'Test User' };

            // Set up mocks for this test
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            const result = await getInvitations('userId');

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(ClubPage.findOne).toHaveBeenCalledWith({
                members: { $elemMatch: { displayName: mockUser.displayName } },
            });
            expect(result).toEqual([]);
        });
    });

    describe('addInvitation', () => {
        it('should add an invitation if the user is the club owner', async () => {
            const mockClubOwner = { displayName: 'Club Owner' };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockClubOwner),
            });
            ClubPage.findOneAndUpdate.mockResolvedValue({});

            await addInvitation('clubOwnerId', '1', 'Title', 'Description', 'Text');

            expect(User.findById).toHaveBeenCalledWith('clubOwnerId');
            expect(ClubPage.findOneAndUpdate).toHaveBeenCalledWith(
                { clubOwner: mockClubOwner.displayName },
                {
                    $push: {
                        invitations: {
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
                addInvitation('clubOwnerId', '1', 'Title', 'Description', 'Text')
            ).rejects.toThrow('User must be the club owner to add invitations.');

            expect(User.findById).toHaveBeenCalledWith('clubOwnerId');
            expect(ClubPage.findOneAndUpdate).not.toHaveBeenCalled();
        });
    });

    describe('deleteInvitation', () => {
        it('should delete an invitation if the user is the club owner', async () => {
            const mockUser = { displayName: 'Club Owner' };
            const mockInvitations = [{ id: '1', title: 'Invitation 1' }];

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.findOneAndUpdate.mockResolvedValue({ invitations: mockInvitations });

            const result = await deleteInvitation('clubOwnerId', '1', 'clubId');

            expect(User.findById).toHaveBeenCalledWith('clubOwnerId');
            expect(ClubPage.findOneAndUpdate).toHaveBeenCalledWith(
                { clubOwner: mockUser.displayName, _id: 'clubId' },
                { $pull: { invitations: { id: '1' } } },
                { new: true }
            );
            expect(result).toEqual(mockInvitations);
        });

        it('should throw an error if the club is not found or the user is not the club owner', async () => {
            const mockUser = { displayName: 'Club Owner' };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.findOneAndUpdate.mockResolvedValue(null);

            await expect(
                deleteInvitation('clubOwnerId', '1', 'clubId')
            ).rejects.toThrow('Club not found or user is not the club owner.');

            expect(User.findById).toHaveBeenCalledWith('clubOwnerId');
            expect(ClubPage.findOneAndUpdate).toHaveBeenCalledWith(
                { clubOwner: mockUser.displayName, _id: 'clubId' },
                { $pull: { invitations: { id: '1' } } },
                { new: true }
            );
        });
    });

    describe('updateInvitation', () => {
        it('should update an invitation if the user is the club owner', async () => {
            const mockUser = { displayName: 'Club Owner' };
            const mockUpdatedInvitations = [{ id: '1', title: 'Updated Title' }];

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.findOneAndUpdate.mockResolvedValue({ invitations: mockUpdatedInvitations });

            const result = await updateInvitation('userId', '1', 'clubId', {
                title: 'Updated Title',
            });

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(ClubPage.findOneAndUpdate).toHaveBeenCalledWith(
                { clubOwner: mockUser.displayName, _id: 'clubId' },
                { $set: { 'invitations.$[elem].title': 'Updated Title' } },
                { arrayFilters: [{ 'elem.id': '1' }], new: true }
            );
            expect(result).toEqual(mockUpdatedInvitations);
        });

        it('should throw an error if the club is not found or the user is not the club owner', async () => {
            const mockUser = { displayName: 'Club Owner' };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });
            ClubPage.findOneAndUpdate.mockResolvedValue(null);

            await expect(
                updateInvitation('userId', '1', 'clubId', { title: 'Updated Title' })
            ).rejects.toThrow('Club not found or user is not the club owner.');

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(ClubPage.findOneAndUpdate).toHaveBeenCalledWith(
                { clubOwner: mockUser.displayName, _id: 'clubId' },
                { $set: { 'invitations.$[elem].title': 'Updated Title' } },
                { arrayFilters: [{ 'elem.id': '1' }], new: true }
            );
        });
    });
});
