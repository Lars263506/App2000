import * as invitationsController from '../../src/controllers/invitationsController.js';
import * as invitationsService from '../../src/services/invitationsService.js';

jest.mock('../../src/services/invitationsService.js');

/**
 * @author Lars Andreas Strand
 * @description This test file contains unit tests for the invitationsController module.
 * Copilot was used to generate the initial test cases and the initial structure of the tests.
 * The author has modified some mocks and added comments to the code.
 */

describe('invitationsController', () => {
    describe('getInvitations', () => {
        it('should return all invitations for the user', async () => {
            const mockReq = { user: { id: '123' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockInvitations = [{ id: '1', title: 'Invitation 1' }, { id: '2', title: 'Invitation 2' }];

            invitationsService.getInvitations.mockResolvedValue(mockInvitations);

            await invitationsController.getInvitations(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockInvitations);
        });

        it('should return a 500 error if the service throws an error', async () => {
            const mockReq = { user: { id: '123' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockError = new Error('Failed to fetch invitations');

            invitationsService.getInvitations.mockRejectedValue(mockError);

            await invitationsController.getInvitations(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('addInvitation', () => {
        it('should add a new invitation and return it', async () => {
            const mockReq = {
                user: { id: '123' },
                body: { id: '1', title: 'New Invitation', description: 'Description', text: 'Text' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockInvitation = { id: '1', title: 'New Invitation', description: 'Description', text: 'Text' };

            invitationsService.addInvitation.mockResolvedValue(mockInvitation);

            await invitationsController.addInvitation(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(mockInvitation);
        });

        it('should return a 500 error if the service throws an error', async () => {
            const mockReq = {
                user: { id: '123' },
                body: { id: '1', title: 'New Invitation', description: 'Description', text: 'Text' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockError = new Error('Failed to add invitation');

            invitationsService.addInvitation.mockRejectedValue(mockError);

            await invitationsController.addInvitation(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('deleteInvitation', () => {
        it('should delete an invitation and return a success status', async () => {
            const mockReq = {
                user: { id: '123' },
                body: { invitationId: '1', clubId: '2' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            invitationsService.deleteInvitation.mockResolvedValue();

            await invitationsController.deleteInvitation(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalled();
        });

        it('should return a 500 error if the service throws an error', async () => {
            const mockReq = {
                user: { id: '123' },
                body: { invitationId: '1', clubId: '2' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockError = new Error('Failed to delete invitation');

            invitationsService.deleteInvitation.mockRejectedValue(mockError);

            await invitationsController.deleteInvitation(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('updateInvitation', () => {
        it('should update an invitation and return the updated invitation', async () => {
            const mockReq = {
                user: { id: '123' },
                body: { invitationId: '1', clubId: '2', request: { title: 'Updated Title' } }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockUpdatedInvitation = { id: '1', title: 'Updated Title' };

            invitationsService.updateInvitation.mockResolvedValue(mockUpdatedInvitation);

            await invitationsController.updateInvitation(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedInvitation);
        });

        it('should return a 500 error if the service throws an error', async () => {
            const mockReq = {
                user: { id: '123' },
                body: { invitationId: '1', clubId: '2', request: { title: 'Updated Title' } }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockError = new Error('Failed to update invitation');

            invitationsService.updateInvitation.mockRejectedValue(mockError);

            await invitationsController.updateInvitation(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });
});
