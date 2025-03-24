import Game from '../models/Game.js';

export const saveGameResult = async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(201).json({ message: 'Game result saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save game result', error });
  }
};

export const getUserGames = async (req, res) => {
  try {
    const userId = req.user._id;
    const games = await Game.find({ players: userId });
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch games', error });
  }
};
