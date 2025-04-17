import * as gameController from '../../src/controllers/gameController.js';
import * as gameService from '../../src/services/gameService.js';

jest.mock('../../src/services/gameService.js');

describe('gameController', () => {
    describe('saveGameResult', () => {
        it('should save a game result and return the saved result', async () => {
            const mockReq = {
                body: {
                    course: 'Course 1',
                    players: ['Player 1', 'Player 2'],
                    scores: [50, 60],
                    date: '2023-10-01'
                },
                user: { id: '123' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockResult = { id: '1', ...mockReq.body, userId: '123' };

            gameService.saveGameResult.mockResolvedValue(mockResult);

            await gameController.saveGameResult(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(mockResult);
        });

        it('should return a 400 error if required fields are missing', async () => {
            const mockReq = {
                body: {
                    players: ['Player 1', 'Player 2'],
                    scores: [50, 60],
                    date: '2023-10-01'
                },
                user: { id: '123' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await gameController.saveGameResult(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid game data' });
        });

        it('should return a 500 error if the service throws an error', async () => {
            const mockReq = {
                body: {
                    course: 'Course 1',
                    players: ['Player 1', 'Player 2'],
                    scores: [50, 60],
                    date: '2023-10-01'
                },
                user: { id: '123' }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockError = new Error('Failed to save game result');

            gameService.saveGameResult.mockRejectedValue(mockError);

            await gameController.saveGameResult(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Failed to save game result', error: mockError.message });
        });
    });
});
