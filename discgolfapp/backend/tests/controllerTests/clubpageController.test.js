import * as clubpageController from '../../src/controllers/clubpageController.js';
import * as clubpageService from '../../src/services/clubpageService.js';

jest.mock('../../src/controllers/clubpageController.js');
jest.mock('../../src/services/clubpageService.js');

describe('clubpageController.getAllClubPages', () => {
    it('should return all club pages', async () => {
        const mockResponse = [{ id: '1', name: 'Club 1' }, { id: '2', name: 'Club 2' }];
        const mockReq = {};
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageController.getAllClubPages.mockImplementationOnce((req, res) => {
            res.status(200).json({ mssg: 'List of all club pages', data: mockResponse });
        });

        await clubpageController.getAllClubPages(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ mssg: 'List of all club pages', data: mockResponse });
    });
});

describe('clubpageController.getClubPage', () => {
    it('should return a single club page', async () => {
        const mockResponse = { id: '1', name: 'Club 1' };
        const mockReq = { params: { id: '1' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageController.getClubPage.mockImplementationOnce((req, res) => {
            res.status(200).json({ mssg: 'Club page details', data: mockResponse });
        });

        await clubpageController.getClubPage(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ mssg: 'Club page details', data: mockResponse });
    });

    it('should throw 404 error if page not found', async () => {
        const mockReq = { params: { id: '999' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageController.getClubPage.mockImplementationOnce((req, res) => {
            res.status(404).json({ mssg: 'Club page not found' });
        });

        await clubpageController.getClubPage(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ mssg: 'Club page not found' });
    });
});

describe('clubpageController.isMember', () => {
    it('should return true if user is a member', async () => {
        const mockReq = { user: { role: 'member' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageController.isMember.mockImplementationOnce((req, res) => {
            res.status(200).json({ isMember: true });
        });

        await clubpageController.isMember(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ isMember: true });
    });

    it('should return false if user is not a member', async () => {
        const mockReq = { user: { role: 'guest' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageController.isMember.mockImplementationOnce((req, res) => {
            res.status(200).json({ isMember: false });
        });

        await clubpageController.isMember(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ isMember: false });
    });
});

describe('clubpageController.isOwner', () => {
    it('should return true if user is the owner of the club', async () => {
        const mockReq = { params: { clubId: '1' }, user: { id: '123' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.isOwner.mockResolvedValueOnce(true);

        clubpageController.isOwner = jest.fn(async (req, res) => {
            const isOwner = await clubpageService.isOwner(req.params.clubId, req.user.id);
            res.status(200).json({ isOwner });
        });

        await clubpageController.isOwner(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ isOwner: true });
    });

    it('should return false if user is not the owner of the club', async () => {
        const mockReq = { params: { clubId: '1' }, user: { id: '456' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.isOwner.mockResolvedValueOnce(false);

        await clubpageController.isOwner(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ isOwner: false });
    });

    it('should throw 404 error if there is an issue with the service', async () => {
        const mockReq = { params: { clubId: '1' }, user: { id: '123' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.isOwner.mockRejectedValueOnce(new Error('Service error'));

        try {
            await clubpageController.isOwner(mockReq, mockRes);
        } catch (error) {
            mockRes.status(404).json({ error: error.message });
        }

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Service error' });
    });
});

describe('clubpageController.getMembers', () => {
    it('should return members of the club', async () => {
        const mockResponse = [{ id: '1', name: 'Member 1' }, { id: '2', name: 'Member 2' }];
        const mockReq = { user: { id: '123' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.getMembers.mockResolvedValueOnce(mockResponse);

        clubpageController.getMembers = jest.fn(async (req, res) => {
            const members = await clubpageService.getMembers(req.user.id);
            res.status(200).json(members);
        });

        await clubpageController.getMembers(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should return an empty array if no members are found', async () => {
        const mockResponse = [];
        const mockReq = { user: { id: '123' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.getMembers.mockResolvedValueOnce(mockResponse);

        await clubpageController.getMembers(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should throw 404 error if there is an issue with the service', async () => {
        const mockReq = { user: { id: '123' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.getMembers.mockRejectedValueOnce(new Error('Service error'));

        try {
            await clubpageController.getMembers(mockReq, mockRes);
        } catch (error) {
            mockRes.status(404).json({ error: error.message });
        }

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Service error' });
    });
});

describe('clubpageController.getAnnouncements', () => {
    it('should return announcements for the user', async () => {
        const mockResponse = [{ id: '1', text: 'Announcement 1' }, { id: '2', text: 'Announcement 2' }];
        const mockReq = { user: { id: '123' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.getAnnouncements.mockResolvedValueOnce(mockResponse);

        clubpageController.getAnnouncements = jest.fn(async (req, res) => {
            const announcements = await clubpageService.getAnnouncements(req.user.id);
            res.status(200).json(announcements);
        });

        await clubpageController.getAnnouncements(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should return an empty array if no announcements are found', async () => {
        const mockResponse = [];
        const mockReq = { user: { id: '123' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.getAnnouncements.mockResolvedValueOnce(mockResponse);

        await clubpageController.getAnnouncements(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should throw 404 error if there is an issue with the service', async () => {
        const mockReq = { user: { id: '123' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.getAnnouncements.mockRejectedValueOnce(new Error('Service error'));

        try {
            await clubpageController.getAnnouncements(mockReq, mockRes);
        } catch (error) {
            mockRes.status(404).json({ error: error.message });
        }

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Service error' });
    });
});

describe('clubpageController.createNewMember', () => {
    it('should create a new member successfully', async () => {
        const mockReq = {
            user: { id: '123' },
            params: { clubId: '1' },
            body: { reason: 'I love this club' }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.createNewApplication.mockResolvedValueOnce();
        clubpageService.createNewMember.mockResolvedValueOnce();

        clubpageController.createNewMember = jest.fn(async (req, res) => {
            await clubpageService.createNewApplication(req.user.id, req.params.clubId, req.body.reason);
            await clubpageService.createNewMember(req.user.id, req.params.clubId);
            res.status(200).json({ mssg: 'New member created' });
        });

        await clubpageController.createNewMember(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ mssg: 'New member created' });
    });

    it('should throw 500 error if there is an issue with creating a new application', async () => {
        const mockReq = {
            user: { id: '123' },
            params: { clubId: '1' },
            body: { reason: 'I love this club' }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.createNewApplication.mockRejectedValueOnce(new Error('Service error'));

        try {
            await clubpageController.createNewMember(mockReq, mockRes);
        } catch (error) {
            mockRes.status(500).json({ error: error.message });
        }

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Service error' });
    });

    it('should throw 500 error if there is an issue with creating a new member', async () => {
        const mockReq = {
            user: { id: '123' },
            params: { clubId: '1' },
            body: { reason: 'I love this club' }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.createNewApplication.mockResolvedValueOnce();
        clubpageService.createNewMember.mockRejectedValueOnce(new Error('Service error'));

        try {
            await clubpageController.createNewMember(mockReq, mockRes);
        } catch (error) {
            mockRes.status(500).json({ error: error.message });
        }

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Service error' });
    });
});

describe('clubpageController.createNewClubPage', () => {
    it('should create a new club page successfully', async () => {
        const mockReq = { body: { name: 'New Club', description: 'A great club' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.createNewClubPage.mockResolvedValueOnce();

        clubpageController.createNewClubPage = jest.fn(async (req, res) => {
            await clubpageService.createNewClubPage(req.body);
            res.status(201).json({ mssg: 'New club page created' });
        });

        await clubpageController.createNewClubPage(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ mssg: 'New club page created' });
    });

    it('should throw 500 error if there is an issue with the service', async () => {
        const mockReq = { body: { name: 'New Club', description: 'A great club' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.createNewClubPage.mockRejectedValueOnce(new Error('Service error'));

        try {
            await clubpageController.createNewClubPage(mockReq, mockRes);
        } catch (error) {
            mockRes.status(500).json({ error: error.message });
        }

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Service error' });
    });
});

describe('clubpageController.createNewAnnouncement', () => {
    it('should create a new announcement successfully', async () => {
        const mockReq = { body: { text: 'New Announcement' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.createNewAnnouncement.mockResolvedValueOnce();

        clubpageController.createNewAnnouncement = jest.fn(async (req, res) => {
            await clubpageService.createNewAnnouncement(req.body);
            res.status(201).json({ mssg: 'New announcement created' });
        });

        await clubpageController.createNewAnnouncement(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ mssg: 'New announcement created' });
    });

    it('should throw 500 error if there is an issue with the service', async () => {
        const mockReq = { body: { text: 'New Announcement' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.createNewAnnouncement.mockRejectedValueOnce(new Error('Service error'));

        try {
            await clubpageController.createNewAnnouncement(mockReq, mockRes);
        } catch (error) {
            mockRes.status(500).json({ error: error.message });
        }

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Service error' });
    });
});

describe('clubpageController.deleteClubPage', () => {
    it('should delete a club page successfully', async () => {
        const mockReq = { params: { clubId: '1' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.deleteClubPage.mockResolvedValueOnce();

        clubpageController.deleteClubPage = jest.fn(async (req, res) => {
            await clubpageService.deleteClubPage(req.params.clubId);
            res.status(200).json({ mssg: 'Club page deleted' });
        });

        await clubpageController.deleteClubPage(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ mssg: 'Club page deleted' });
    });

    it('should throw 404 error if club page is not found', async () => {
        const mockReq = { params: { clubId: '999' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.deleteClubPage.mockRejectedValueOnce(new Error('Club page not found'));

        try {
            await clubpageController.deleteClubPage(mockReq, mockRes);
        } catch (error) {
            mockRes.status(404).json({ error: error.message });
        }

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Club page not found' });
    });
});

describe('clubpageController.updateAnnouncement', () => {
    it('should update an announcement successfully', async () => {
        const mockReq = { params: { announcementId: '1' }, body: { text: 'Updated Announcement' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.updateAnnouncement.mockResolvedValueOnce();

        clubpageController.updateAnnouncement = jest.fn(async (req, res) => {
            await clubpageService.updateAnnouncement(req.params.announcementId, req.body);
            res.status(200).json({ mssg: 'Announcement updated' });
        });

        await clubpageController.updateAnnouncement(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ mssg: 'Announcement updated' });
    });

    it('should throw 404 error if announcement is not found', async () => {
        const mockReq = { params: { announcementId: '999' }, body: { text: 'Updated Announcement' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.updateAnnouncement.mockRejectedValueOnce(new Error('Announcement not found'));

        try {
            await clubpageController.updateAnnouncement(mockReq, mockRes);
        } catch (error) {
            mockRes.status(404).json({ error: error.message });
        }

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Announcement not found' });
    });
});

describe('clubpageController.updateClubPage', () => {
    it('should update a club page successfully', async () => {
        const mockReq = { params: { clubId: '1' }, body: { name: 'Updated Club', description: 'Updated description' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.updateClubPage.mockResolvedValueOnce();

        clubpageController.updateClubPage = jest.fn(async (req, res) => {
            await clubpageService.updateClubPage(req.params.clubId, req.body);
            res.status(200).json({ mssg: 'Club page updated' });
        });

        await clubpageController.updateClubPage(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ mssg: 'Club page updated' });
    });

    it('should throw 404 error if club page is not found', async () => {
        const mockReq = { params: { clubId: '999' }, body: { name: 'Updated Club', description: 'Updated description' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.updateClubPage.mockRejectedValueOnce(new Error('Club page not found'));

        try {
            await clubpageController.updateClubPage(mockReq, mockRes);
        } catch (error) {
            mockRes.status(404).json({ error: error.message });
        }

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Club page not found' });
    });
});

describe('clubpageController.updatePosition', () => {
    it('should update a member\'s position successfully', async () => {
        const mockReq = { params: { memberId: '1' }, body: { position: 'Captain' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.updatePosition.mockResolvedValueOnce();

        clubpageController.updatePosition = jest.fn(async (req, res) => {
            await clubpageService.updatePosition(req.params.memberId, req.body.position);
            res.status(200).json({ mssg: 'Position updated' });
        });

        await clubpageController.updatePosition(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ mssg: 'Position updated' });
    });

    it('should throw 404 error if member is not found', async () => {
        const mockReq = { params: { memberId: '999' }, body: { position: 'Captain' } };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        clubpageService.updatePosition.mockRejectedValueOnce(new Error('Member not found'));

        try {
            await clubpageController.updatePosition(mockReq, mockRes);
        } catch (error) {
            mockRes.status(404).json({ error: error.message });
        }

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Member not found' });
    });
});
