import * as translationsService from '../services/translationsService.js';

const getAllTranslations = async (req, res) => {
    try {
        const translations = await translationsService.getAllTranslations();
        res.status(200).json(translations);
    } catch (error) {
        console.error('Error fetching translations:', error);
        res.status(500).json({ error: error.message });
    }
}

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

export { getAllTranslations, addNewTranslation, updateTranslation };
