import * as minutesService from '../services/minutesService.js';

/**
 * @author Lars Andreas Strand
 * @description This file contains the controller functions for the minutes routes.
 * It handles the requests and responses for getting, adding, deleting, and updating minutes.
 * It uses the minutesService to interact with the database and perform the necessary operations.
 * It also handles errors and sends appropriate responses to the client.
 * Copilot was used for code and comment structure and some code generation, but the logic is based on my own knowledge.
 */

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get all minutes for a user.
 * It retrieves all minutes from the database and sends them as a response.
 * If successful, it sends a 200 status code and the minutes data.
 * If there is an error, it sends a 500 status code and the error message.
 */

const getMinutes = async (req, res) => {
    try {
        const userId = req.user.id;
        const minutes = await minutesService.getMinutes(userId);
        res.status(200).json(minutes);
    } catch (error) {
        console.error('Error fetching minutes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to add a minute.
 * It retrieves the minute data from the request body and adds it to the database.
 * If successful, it sends a 201 status code and the created minute data.
 * If there is an error, it sends a 500 status code and the error message.
 */

const addMinute = async (req, res) => {
    try {
        const clubownerId = req.user.id;
        const { id, title, description, text } = req.body;
        const minute = await minutesService.addMinute(clubownerId, id, title, description, text);
        res.status(201).json(minute);
    } catch (error) {
        console.error('Error adding minute:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to delete a minute.
 * It retrieves the minute ID from the request body and deletes it from the database.
 * If successful, it sends a 200 status code.
 * If there is an error, it sends a 500 status code and the error message.
 */

const deleteMinute = async (req, res) => {
    try {
        const clubownerId = req.user.id;
        const { minuteId, clubId } = req.body;
        await minutesService.deleteMinute(clubownerId, minuteId, clubId);
        res.status(200).send();
    } catch (error) {
        console.error('Error deleting minute:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to update a minute.
 * It retrieves the minute ID and updated data from the request body and updates it in the database.
 * If successful, it sends a 200 status code and the updated minute data.
 * If there is an error, it sends a 500 status code and the error message.
 */

const updateMinute = async (req, res) => {
    try {
        const clubownerId = req.user.id;
        const { minuteId, clubId, request } = req.body;
        const updatedMinute = await minutesService.updateMinute(clubownerId, minuteId, clubId, request);
        res.status(200).json(updatedMinute);
    } catch (error) {
        console.error('Error updating minute:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { getMinutes, addMinute, deleteMinute, updateMinute };
