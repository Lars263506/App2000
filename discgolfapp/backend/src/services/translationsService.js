import Translation from '../models/Translation.js'

/**
 * @author Lars Andreas Strand
 * @description Service for managing translations
 */

/**
 * @description Gets all translations from the database
 */

const getTranslations = async () => {
    const translations = await Translation.find()

    if (!translations) {
        throw new Error('No translations found')
    }

    return translations
}

/**
 * @description Updates translations in the database
 */

const updateTranslations = async (newTranslations) => {
    if (!Array.isArray(newTranslations) || newTranslations.length === 0) {
        throw new Error('No new translations provided');
    }

    const updatePromises = newTranslations.map(async (newTranslation) => {
        return Translation.updateOne(
            { id: newTranslation.id },
            { $set: newTranslation },
            { upsert: true }
        );
    });

    await Promise.all(updatePromises);

    const updatedTranslations = await Translation.find();
    return updatedTranslations;
};

export { getTranslations, updateTranslations }