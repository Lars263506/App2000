import * as gameService from '../services/gameService.js';

/**
 * @author Ibrahim Queeum and Lars Andreas Strand
 * @description This file contains the controller functions for the game routes.
 */

/**
 * @author Ibrahim Queeum and Lars Andreas Strand
 * @description This function handles the request to save a game result.
 * It retrieves the user ID from the request and saves the game result in the database.
 * If successful, it sends a 201 status code and the saved game result.
 * If there is an error, it sends a 500 status code and the error message.
 */

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
