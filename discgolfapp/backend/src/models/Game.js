import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: null }, 
});

const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  course: { type: String, required: true },
  players: { type: [playerSchema], required: true }, 
  scores: { type: Map, of: [Number], required: true },
  date: { type: Date, default: Date.now },
});

const Game = mongoose.model('Game', gameSchema);

export default Game;
