import * as clubpageController from '../../src/controllers/clubpageController.js';
import * as clubpageService from '../../src/services/clubpageService.js';

jest.mock('../../src/services/clubpageService.js');

describe('clubpageController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAllClubPages should return all club pages', async () => {
        const mockReq = {};
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        clubpageService.getAllClubPages.mockResolvedValue([{ id: 1, name: 'Club 1' }]);

        await clubpageController.getAllClubPages(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ mssg: 'List of all club pages', data: [{ id: 1, name: 'Club 1' }] });
    });

    test('getClubPage should return a specific club page', async () => {
        const mockReq = { params: { id: 1 }, headers: { user: JSON.stringify({ role: 'member' }) } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        clubpageService.getClubPage.mockResolvedValue({ id: 1, name: 'Club 1' });

        await clubpageController.getClubPage(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ mssg: 'Club page found', data: { id: 1, name: 'Club 1' } });
    });

    test('getMembers should return members of a club', async () => {
        const mockReq = { params: { id: 1 } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        clubpageService.getMembers.mockResolvedValue([{ id: 1, name: 'Member 1' }]);

        await clubpageController.getMembers(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ data: [{ id: 1, name: 'Member 1' }] });
    });

    test('createNewMember should create a new member', async () => {
        const mockReq = {
            params: { clubId: 1 },
            headers: { user: JSON.stringify({ id: 1 }) },
            body: { reason: 'Joining reason' },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        clubpageService.createNewApplication.mockResolvedValue({});
        clubpageService.createNewMember.mockResolvedValue({});

        await clubpageController.createNewMember(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ mssg: 'New member created' });
    });

    test('createNewClubPage should create a new club page', async () => {
        const mockReq = {
            body: {
                name: 'New Club',
                clubOwner: 'Owner',
                description: 'Description',
                address: 'Address',
                zipCode: '12345',
                websiteURL: 'http://example.com',
                email: 'email@example.com',
                phone: '123456789',
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        clubpageService.createNewClubPage.mockResolvedValue();

        await clubpageController.createNewClubPage(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ mssg: 'New club page created' });
    });

    test('deleteClubPage should delete a club page', async () => {
        const mockReq = { params: { id: 1 } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        clubpageService.deleteClubPage.mockResolvedValue({ id: 1 });

        await clubpageController.deleteClubPage(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ mssg: 'Club page deleted', data: { id: 1 } });
    });

    test('updateAnnouncement should update an announcement', async () => {
        const mockReq = {
            params: { clubId: 1, index: 0 },
            body: { text: 'Updated text' },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        clubpageService.updateAnnouncement.mockResolvedValue('Announcement updated');

        await clubpageController.updateAnnouncement(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ mssg: 'Announcement updated' });
    });

    test('updatePosition should update a member position', async () => {
        const mockReq = {
            body: { displayName: 'Member 1', position: 'New Position' },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        clubpageService.updatePosition.mockResolvedValue([{ id: 1, position: 'New Position' }]);

        await clubpageController.updatePosition(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([{ id: 1, position: 'New Position' }]);
    });
});
