import mongoose from 'mongoose';

/**
 * @author Lars Andreas Strand
 * @description This is the schema for the Game model.
 * It defines the structure of the Game document in the database.
 */

const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  course: { type: String, required: true },
  players: { type: [String], required: true },
  scores: { type: Map, of: [Number], required: true },
  date: { type: Date, default: Date.now },
});

const Game = mongoose.model('Game', gameSchema);

export default Game;
