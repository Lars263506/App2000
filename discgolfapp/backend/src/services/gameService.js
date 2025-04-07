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

  const players = await Promise.all(
    game.players.map(async (player) => {
      const foundPlayer = await User.findOne({ displayName: player.name });
      return {
        name: player.name,
        id: foundPlayer ? foundPlayer._id : null,
        email: foundPlayer ? foundPlayer.email : null,
      };
    })
  );

  const newGame = await Game.create({
    gameId: `${game.course}-${uuid4()}`,
    course: game.course,
    players,
    scores: game.scores,
    date: game.date,
  });

  user.games.push(newGame._id);
  await user.save();

  await Promise.all(
    players
      .filter((player) => player.id)
      .map(async (player) => {
        const playerUser = await User.findById(player.id);
        if (playerUser) {
          playerUser.games.push(newGame._id);
          await playerUser.save();
        }
      })
  );

  return newGame;
};

export { saveGameResult };
