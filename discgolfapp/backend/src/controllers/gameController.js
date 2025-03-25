import * as gameService from '../services/gameService.js';

const saveGameResult = async (req, res) => {
  try {
    const userId = req.user.id;
    const game = req.body;
    const result =  await gameService.saveGameResult(userId, game);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save game result', error });
  }
};
export { saveGameResult };
