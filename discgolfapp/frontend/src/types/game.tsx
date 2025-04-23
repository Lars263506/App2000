/**
 * Represents a disc golf game.
 * 
 * @author Ibrahim Queeum
 * @description This file defines the `Game` type, which represents a disc golf game. 
 * It includes details such as the game ID, course, players, scores, and the date the game was played.
 */

type Game = {
    gameId: string;
    course: string;
    players: { _id: string; name: string }[]; 
    scores: { [playerName: string]: number[] }; 
    date: string; 
};

export default Game;
