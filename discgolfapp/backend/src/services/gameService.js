import { v4 as uuid4 } from 'uuid';
import Game from '../models/Game.js';
import User from '../models/User.js';

const saveGameResult = async (userId, game) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }
  if (!game) {
    throw new Error('Game data is required');
  }

  const newGame = {
    gameId: `${game.course}-${uuid4()}`,
    course: game.course,
    players: game.players, 
    scores: game.scores,
    date: new Date(),
  };

  
  await User.findByIdAndUpdate(userId, { $push: { games: newGame } });

  return await Game.create(newGame);
};

export { saveGameResult };
