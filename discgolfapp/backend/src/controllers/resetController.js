import * as resetService from '../services/resetService.js';

/**
 * @author Lars Andreas Strand
 * @description This file contains the controller function for resetting test data.
 * It handles the request to reset test data for a user.
 * It uses the resetService to interact with the database and perform the necessary operations.
 * It also handles errors and sends appropriate responses to the client.
 * Copilot was used for code and comment structure and some code generation, but the logic is based on my own knowledge.
 */

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to reset test data.
 * It retrieves the user ID from the request and calls the resetService to reset the test data.
 * If successful, it sends a 200 status code and a success message.
 * If there is an error, it sends a 500 status code and the error message.
 */

const resetTestData = async (req, res) => {
    try {
        if (req.user) {
            await resetService.resetTestData(req.user.id);
            res.status(200).json({ message: 'Test data reset successfully' });
        }
        else {
            res.status(403).json({ message: 'Forbidden' });
        }
    } catch (error) {
        console.error('Error resetting test data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { resetTestData };
