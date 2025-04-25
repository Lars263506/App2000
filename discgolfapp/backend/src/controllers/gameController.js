import * as gameService from '../services/gameService.js';

/**
 * @author Ibrahim Queeum and Lars Andreas Strand
 * @description This file contains the controller functions for the game routes.
 * Copilot has been used to generate the code for the functions and comments,
 * but has been reviewed and edited by the authors.
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
    const { course, players, scores, date } = req.body;

    // Valider at nødvendige felter er til stede
    if (!course || !Array.isArray(players) || players.length === 0 || !scores || !date) {
      return res.status(400).json({ message: 'Invalid game data' });
    }

    const userId = req.user.id;
    const result = await gameService.saveGameResult(userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error saving game result:', error);
    res.status(500).json({ message: 'Failed to save game result', error: error.message });
  }
};

export { saveGameResult };
