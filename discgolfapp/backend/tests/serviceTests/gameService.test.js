import mongoose from 'mongoose';
import { saveGameResult } from '../../src/services/gameService.js';
import Game from '../../src/models/Game.js';
import User from '../../src/models/User.js';

jest.mock('../../src/models/Game', () => ({
    create: jest.fn(),
}));

jest.mock('../../src/models/User', () => ({
    findById: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
}));

describe('gameService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('saveGameResult', () => {
        it('should save a game result and return the saved game', async () => {
            const mockUserId = new mongoose.Types.ObjectId();
            const mockGame = {
                course: 'Test Course',
                players: [{ name: 'Player 1' }, { name: 'Player 2' }],
                scores: [50, 60],
                date: '2023-10-01',
            };
            const mockPlayers = [
                { name: 'Player 1', id: 'player1Id', email: 'player1@example.com' },
                { name: 'Player 2', id: null, email: null },
            ];
            const mockNewGame = {
                gameId: 'Test Course-uuid',
                course: 'Test Course',
                players: mockPlayers,
                scores: [50, 60],
                date: '2023-10-01',
            };

            User.findById.mockResolvedValue({ _id: mockUserId, games: [], save: jest.fn() });
            User.findOne.mockImplementation((query) => {
                if (query.displayName === 'Player 1') {
                    return { _id: 'player1Id', email: 'player1@example.com' };
                }
                return null;
            });
            Game.create.mockResolvedValue(mockNewGame);

            const result = await saveGameResult(mockUserId, mockGame);

            expect(User.findById).toHaveBeenCalledWith(mockUserId);
            expect(User.findOne).toHaveBeenCalledWith({ displayName: 'Player 1' });
            expect(User.findOne).toHaveBeenCalledWith({ displayName: 'Player 2' });
            expect(Game.create).toHaveBeenCalledWith({
                gameId: expect.any(String),
                course: 'Test Course',
                players: mockPlayers,
                scores: [50, 60],
                date: '2023-10-01',
            });
            expect(result).toEqual(mockNewGame);
        });

        it('should throw an error if the user is not found', async () => {
            const mockUserId = new mongoose.Types.ObjectId();
            const mockGame = {
                course: 'Test Course',
                players: [{ name: 'Player 1' }],
                scores: [50],
                date: '2023-10-01',
            };

            User.findById.mockResolvedValue(null);

            await expect(saveGameResult(mockUserId, mockGame)).rejects.toThrow('User not found');

            expect(User.findById).toHaveBeenCalledWith(mockUserId);
            expect(Game.create).not.toHaveBeenCalled();
        });

        it('should throw an error if the game data is not provided', async () => {
            const mockUserId = new mongoose.Types.ObjectId();

            User.findById.mockResolvedValue({ _id: mockUserId });

            await expect(saveGameResult(mockUserId, null)).rejects.toThrow('Game data is required');

            expect(User.findById).toHaveBeenCalledWith(mockUserId);
            expect(Game.create).not.toHaveBeenCalled();
        });
    });
});
