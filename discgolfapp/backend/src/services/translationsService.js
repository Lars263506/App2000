import Translation from '../models/Translation.js';

const getAllTranslations = async (req, res) => {
    const translations = await Translation.find();

    if (translations && translations.length === 0) {
        throw new Error('No translations found');
    }

    return translations;
};

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

const updateTranslation = async (language, key, newTranslation) => {
    console.log('Updating translation:', language, key, newTranslation);
    const translation = await Translation.findOneAndUpdate(
        { language, key },
        { translation: newTranslation },
        { new: true }
    );

    if (!translation) {
        throw new Error('Error updating translation');
    }
};

const updateTranslationsBatch = async (updates) => {
    console.log('Batch updating translations:', updates);

    try {
        // Valider oppdateringene
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

        // Grupper oppdateringene etter språk og nøkkel
        const groupedUpdates = validUpdates.reduce((acc, { language, key, index, translation }) => {
            const groupKey = `${language}:${key}`;
            if (!acc[groupKey]) {
                acc[groupKey] = { language, key, translations: [] };
            }
            acc[groupKey].translations[index] = translation;
            return acc;
        }, {});

        // Utfør bulk-operasjoner for å erstatte hele translation-arrayen
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
