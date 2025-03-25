import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  course: { type: String, required: true },
  players: { type: [String], required: true },
  scores: { type: Map, of: [Number], required: true },
  date: { type: Date, default: Date.now },
});

const Game = mongoose.model('Game', gameSchema);

export default Game;
