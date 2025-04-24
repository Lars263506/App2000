import Translation from '../models/Translation.js';

/**
 * @author Lars Andreas Strand
 * @description This file contains the translationsService, which is responsible for handling translation-related tasks.
 * It includes functions for getting all translations, adding a new translation, updating a translation, and updating translations in batch.
 * Copilot was used to structure the code and provide suggestions, but the logic and implementation were done by the author.
 */

/**
 * @author Lars Andreas Strand
 * @description This function retrieves all translations from the database.
 * It returns an array of translations if found, or an empty array if no translations are found.
 * If an error occurs, it logs the error and throws a new error with the error message.
 * @returns {Promise<Array>} - A promise that resolves to an array of translations.
 */

const getAllTranslations = async () => {
    const translations = await Translation.find();

    if (translations && translations.length === 0) {
        return [];
    }

    return translations;
};

/**
 * @author Lars Andreas Strand
 * @description This function adds a new translation to the database.
 * It takes the language, key, and translation text as input.
 * If the translation is created successfully, it returns the created translation.
 * If an error occurs, it logs the error and throws a new error with the error message.
 * @param {string} language - The language of the translation.
 * @param {string} key - The key for the translation.
 * @param {string} translationText - The text of the translation.
 * @return {Promise<Object>} - A promise that resolves to the created translation.
 * @throws {Error} - If there was an error during the creation of the translation.
 */

const addNewTranslation = async (language, key, translationText) => {
    const translation = await Translation.create({
        language,
        key,
        translation: translationText
    });

    if (!translation) {
        throw new Error('Error creating translation');
    }
};

/**
 * @author Lars Andreas Strand
 * @description This function updates an existing translation in the database.
 * It takes the language, key, and new translation text as input.
 * If the translation is updated successfully, it returns the updated translation.
 * If an error occurs, it logs the error and throws a new error with the error message.
 * @param {string} language - The language of the translation.
 * @param {string} key - The key for the translation.
 * @param {string} newTranslation - The new text of the translation.
 * @return {Promise<Object>} - A promise that resolves to the updated translation.
 * @throws {Error} - If there was an error during the update of the translation.
 */

const updateTranslation = async (language, key, newTranslation) => {
    const translation = await Translation.findOneAndUpdate(
        { language, key },
        { translation: newTranslation },
        { new: true }
    );

    if (!translation) {
        throw new Error('Error updating translation');
    }
};

/**
 * @author Lars Andreas Strand
 * @description This function updates multiple translations in the database in batch.
 * It takes an array of updates, each containing the language, key, index, and translation text.
 * It validates the updates, groups them by language and key, and performs bulk operations to update the translations.
 * If the updates are successful, it returns the result of the bulk operations.
 * If an error occurs, it logs the error and throws a new error with the error message.
 */

const updateTranslationsBatch = async (updates) => {
    try {
        const validUpdates = updates.filter(({ language, key, index, translation }) => {
            return (
                typeof language === 'string' &&
                typeof key === 'string' &&
                typeof index === 'number' &&
                typeof translation === 'string'
            );
        });

        if (validUpdates.length === 0) {
            throw new Error('Ingen gyldige oppdateringer funnet.');
        }

        const groupedUpdates = validUpdates.reduce((acc, { language, key, index, translation }) => {
            const groupKey = `${language}:${key}`;
            if (!acc[groupKey]) {
                acc[groupKey] = { language, key, translations: [] };
            }
            acc[groupKey].translations[index] = translation;
            return acc;
        }, {});

        const bulkOperations = Object.values(groupedUpdates).map(({ language, key, translations }) => ({
            updateOne: {
                filter: { language, key },
                update: { $set: { translation: translations.filter(Boolean) } }, // Fjern eventuelle tomme verdier
            },
        }));

        const result = await Translation.bulkWrite(bulkOperations);
        return result;
    } catch (error) {
        console.error('Error in batch update:', error);
        throw new Error('Failed to update translations in batch');
    }
};

export { getAllTranslations, addNewTranslation, updateTranslation, updateTranslationsBatch };
