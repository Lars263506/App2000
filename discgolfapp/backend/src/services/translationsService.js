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
    const translation = await Translation.findOneAndUpdate(
        { language, key },
        { translation: newTranslation },
        { new: true }
    );

    if (!translation) {
        throw new Error('Error updating translation');
    }
};

export { getAllTranslations, addNewTranslation, updateTranslation };
