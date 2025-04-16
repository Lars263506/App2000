import * as minutesController from '../../src/controllers/minutesController.js';
import * as minutesService from '../../src/services/minutesService.js';

jest.mock('../../src/services/minutesService.js');

describe('minutesController', () => {
    describe('getMinutes', () => {
        it('should return all minutes for the user', async () => {
            const mockReq = { user: { id: '123' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockMinutes = [{ id: '1', title: 'Minute 1' }, { id: '2', title: 'Minute 2' }];

            minutesService.getMinutes.mockResolvedValue(mockMinutes);

            await minutesController.getMinutes(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockMinutes);
        });

        it('should return a 500 error if the service throws an error', async () => {
            const mockReq = { user: { id: '123' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockError = new Error('Failed to fetch minutes');

            minutesService.getMinutes.mockRejectedValue(mockError);

            await minutesController.getMinutes(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('addMinute', () => {
        it('should add a new minute and return it', async () => {
            const mockReq = {
                user: { id: '123' },
                body: { id: '1', title: 'New Minute', description: 'Description', text: 'Text' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockMinute = { id: '1', title: 'New Minute', description: 'Description', text: 'Text' };

            minutesService.addMinute.mockResolvedValue(mockMinute);

            await minutesController.addMinute(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(mockMinute);
        });

        it('should return a 500 error if the service throws an error', async () => {
            const mockReq = {
                user: { id: '123' },
                body: { id: '1', title: 'New Minute', description: 'Description', text: 'Text' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockError = new Error('Failed to add minute');

            minutesService.addMinute.mockRejectedValue(mockError);

            await minutesController.addMinute(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('deleteMinute', () => {
        it('should delete a minute and return a success status', async () => {
            const mockReq = {
                user: { id: '123' },
                body: { minuteId: '1', clubId: '2' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            minutesService.deleteMinute.mockResolvedValue();

            await minutesController.deleteMinute(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalled();
        });

        it('should return a 500 error if the service throws an error', async () => {
            const mockReq = {
                user: { id: '123' },
                body: { minuteId: '1', clubId: '2' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockError = new Error('Failed to delete minute');

            minutesService.deleteMinute.mockRejectedValue(mockError);

            await minutesController.deleteMinute(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('updateMinute', () => {
        it('should update a minute and return the updated minute', async () => {
            const mockReq = {
                user: { id: '123' },
                body: { minuteId: '1', clubId: '2', request: { title: 'Updated Title' } }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockUpdatedMinute = { id: '1', title: 'Updated Title' };

            minutesService.updateMinute.mockResolvedValue(mockUpdatedMinute);

            await minutesController.updateMinute(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedMinute);
        });

        it('should return a 500 error if the service throws an error', async () => {
            const mockReq = {
                user: { id: '123' },
                body: { minuteId: '1', clubId: '2', request: { title: 'Updated Title' } }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockError = new Error('Failed to update minute');

            minutesService.updateMinute.mockRejectedValue(mockError);

            await minutesController.updateMinute(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });
});
