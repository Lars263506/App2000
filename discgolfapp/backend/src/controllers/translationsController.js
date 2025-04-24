import * as translationsService from '../services/translationsService.js';

/**
 * @author Lars Andreas Strand
 * @description This file contains the controller functions for the translations routes.
 * It handles the requests and responses for getting, adding, and updating translations.
 * It uses the translationsService to interact with the database and perform the necessary operations.
 * It also handles errors and sends appropriate responses to the client.
 * Copilot was used for code and comment structure and some code generation, but the logic is based on my own knowledge.
 */

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get all translations.
 * It retrieves all translations from the database and sends them as a response.
 * If successful, it sends a 200 status code and the translations data.
 * If there is an error, it sends a 500 status code and the error message.
 */

const getAllTranslations = async (req, res) => {
    try {
        const translations = await translationsService.getAllTranslations();
        res.status(200).json(translations);
    } catch (error) {
        console.error('Error fetching translations:', error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to add a new translation.
 * It retrieves the translation data from the request body and adds it to the database.
 * If successful, it sends a 201 status code and a success message.
 * If there is an error, it sends a 500 status code and the error message.
 */

const addNewTranslation = async (req, res) => {
    try {
        const { language, key, translation } = req.body;
        await translationsService.addNewTranslation(language, key, translation);
        res.status(201).json({ message: 'Translation added successfully' });
    } catch (error) {
        console.error('Error adding translation:', error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to update an existing translation.
 * It retrieves the translation data from the request body and updates it in the database.
 * If successful, it sends a 200 status code and a success message.
 * If there is an error, it sends a 500 status code and the error message.
 */

const updateTranslation = async (req, res) => {
    try {
        const { language, key, newTranslation } = req.body;
        await translationsService.updateTranslation(language, key, newTranslation);
        res.status(200).json({message: 'Translation updated successfully'});
    } catch (error) {
        console.error('Error updating translation:', error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to update multiple translations in a batch.
 * It retrieves the translation updates from the request body and updates them in the database.
 * If successful, it sends a 200 status code and a success message.
 * If there is an error, it sends a 500 status code and the error message.
 */

const updateTranslationsBatch = async (req, res) => {
    try {
        const updates = req.body;
        await translationsService.updateTranslationsBatch(updates);
        res.status(200).json({ message: 'Translations updated successfully' });
    } catch (error) {
        console.error('Error updating translations:', error);
        res.status(500).json({ error: error.message });
    }
};

export {
    getAllTranslations,
    addNewTranslation,
    updateTranslation,
    updateTranslationsBatch
};
