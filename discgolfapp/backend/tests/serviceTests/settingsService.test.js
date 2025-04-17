import { getSettings, grantSetting, revokeSetting } from '../../src/services/settingsService.js';
import User from '../../src/models/User.js';

jest.mock('../../src/models/User', () => ({
    findById: jest.fn(() => ({
        select: jest.fn(),
    })),
    findOneAndUpdate: jest.fn(),
}));

describe('settingsService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getSettings', () => {
        it('should return settings for an admin user if they exist', async () => {
            const mockAdminId = 'adminId';
            const mockSettings = [
                { name: 'Setting1', description: 'Description1' },
                { name: 'Setting2', description: 'Description2' },
            ];

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue({ settings: mockSettings }),
            });

            const result = await getSettings(mockAdminId);

            expect(User.findById).toHaveBeenCalledWith(mockAdminId);
            expect(result).toEqual(mockSettings);
        });

        it('should throw an error if no admin is provided', async () => {
            await expect(getSettings(null)).rejects.toThrow('No admin found.');
        });

        it('should throw an error if no settings are found for the user', async () => {
            const mockAdminId = 'adminId';

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(getSettings(mockAdminId)).rejects.toThrow(
                'No settings found on this user. Ask superadmin for access.'
            );
        });
    });

    describe('grantSetting', () => {
        it('should grant a setting to the admin user', async () => {
            const mockDisplayName = 'AdminUser';
            const mockSetting = { name: 'Setting1', description: 'Description1' };
            const mockUpdatedUser = {
                displayName: mockDisplayName,
                settings: [mockSetting],
            };

            User.findOneAndUpdate.mockResolvedValue(mockUpdatedUser);

            const result = await grantSetting(mockDisplayName, mockSetting);

            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { displayName: mockDisplayName },
                { $addToSet: { settings: mockSetting } },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedUser);
        });

        it('should throw an error if the setting could not be granted', async () => {
            const mockDisplayName = 'AdminUser';
            const mockSetting = { name: 'Setting1', description: 'Description1' };

            User.findOneAndUpdate.mockResolvedValue(null);

            await expect(grantSetting(mockDisplayName, mockSetting)).rejects.toThrow(
                'Could not grant setting.'
            );

            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { displayName: mockDisplayName },
                { $addToSet: { settings: mockSetting } },
                { new: true }
            );
        });
    });

    describe('revokeSetting', () => {
        it('should revoke a setting from the admin user', async () => {
            const mockDisplayName = 'AdminUser';
            const mockSetting = { name: 'Setting1', description: 'Description1' };
            const mockUpdatedUser = {
                displayName: mockDisplayName,
                settings: [],
            };

            User.findOneAndUpdate.mockResolvedValue(mockUpdatedUser);

            const result = await revokeSetting(mockDisplayName, mockSetting);

            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { displayName: mockDisplayName },
                { $pull: { settings: mockSetting } },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedUser);
        });

        it('should throw an error if the setting could not be revoked', async () => {
            const mockDisplayName = 'AdminUser';
            const mockSetting = { name: 'Setting1', description: 'Description1' };

            User.findOneAndUpdate.mockResolvedValue(null);

            await expect(revokeSetting(mockDisplayName, mockSetting)).rejects.toThrow(
                'Could not revoke setting.'
            );

            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { displayName: mockDisplayName },
                { $pull: { settings: mockSetting } },
                { new: true }
            );
        });
    });
});
