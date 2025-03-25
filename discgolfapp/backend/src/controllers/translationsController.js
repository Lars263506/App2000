import * as translationsService from '../services/translationsService.js'

/**
 * @author Lars Andreas Strand
 * @description Controller for managing translations
 */

/**
 * @description Asks the service for all translations
 */

const getTranslations = async (req, res) => {
    try {
        res.status(200).json(await translationsService.getTranslations())
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/**
 * @description Asks the service to update translations
 */

const updateTranslations = async (req, res) => {
    try {
        const newTranslations = req.body
        res.status(204).json(await translationsService.updateTranslations(newTranslations))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export { getTranslations, updateTranslations }