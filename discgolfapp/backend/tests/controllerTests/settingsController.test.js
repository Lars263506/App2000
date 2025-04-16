import * as settingsController from '../../src/controllers/settingsController.js';
import * as settingsService from '../../src/services/settingsService.js';

jest.mock('../../src/services/settingsService.js');

describe('settingsController', () => {
    describe('getSettings', () => {
        it('should return user settings', async () => {
            const mockSettings = { theme: 'dark', notifications: true };
            const mockReq = { user: { id: '123' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            settingsService.getSettings.mockResolvedValue(mockSettings);

            await settingsController.getSettings(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockSettings);
        });

        it('should return a 404 error if the service throws an error', async () => {
            const mockReq = { user: { id: '123' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockError = new Error('Settings not found');

            settingsService.getSettings.mockRejectedValue(mockError);

            await settingsController.getSettings(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: mockError.message });
        });
    });

    describe('grantSetting', () => {
        it('should grant a setting to an admin', async () => {
            const mockReq = { body: { displayName: 'AdminUser', setting: 'manageUsers' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockGrantedSetting = { displayName: 'AdminUser', setting: 'manageUsers' };

            settingsService.grantSetting.mockResolvedValue(mockGrantedSetting);

            await settingsController.grantSetting(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockGrantedSetting);
        });

        it('should return a 400 error if displayName or setting is missing', async () => {
            const mockReq = { body: { displayName: '', setting: '' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await settingsController.grantSetting(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Display name and setting are required' });
        });

        it('should return a 404 error if the service throws an error', async () => {
            const mockReq = { body: { displayName: 'AdminUser', setting: 'manageUsers' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockError = new Error('Failed to grant setting');

            settingsService.grantSetting.mockRejectedValue(mockError);

            await settingsController.grantSetting(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: mockError.message });
        });
    });

    describe('revokeSetting', () => {
        it('should revoke a setting from an admin', async () => {
            const mockReq = { body: { displayName: 'AdminUser', setting: 'manageUsers' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockRevokedSetting = { displayName: 'AdminUser', setting: 'manageUsers' };

            settingsService.revokeSetting.mockResolvedValue(mockRevokedSetting);

            await settingsController.revokeSetting(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockRevokedSetting);
        });

        it('should return a 400 error if displayName or setting is missing', async () => {
            const mockReq = { body: { displayName: '', setting: '' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await settingsController.revokeSetting(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Display name and setting are required' });
        });

        it('should return a 404 error if the service throws an error', async () => {
            const mockReq = { body: { displayName: 'AdminUser', setting: 'manageUsers' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockError = new Error('Failed to revoke setting');

            settingsService.revokeSetting.mockRejectedValue(mockError);

            await settingsController.revokeSetting(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: mockError.message });
        });
    });
});
