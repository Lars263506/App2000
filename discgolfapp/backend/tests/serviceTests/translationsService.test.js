import {
    getAllTranslations,
    addNewTranslation,
    updateTranslation,
    updateTranslationsBatch,
} from '../../src/services/translationsService.js';
import Translation from '../../src/models/Translation.js';

jest.mock('../../src/models/Translation', () => ({
    find: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    bulkWrite: jest.fn(),
}));

describe('translationsService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllTranslations', () => {
        it('should return all translations if they exist', async () => {
            const mockTranslations = [
                { language: 'en', key: 'greeting', translation: 'Hello' },
                { language: 'es', key: 'greeting', translation: 'Hola' },
            ];

            Translation.find.mockResolvedValue(mockTranslations);

            const result = await getAllTranslations();

            expect(Translation.find).toHaveBeenCalled();
            expect(result).toEqual(mockTranslations);
        });

        it('should return an empty array if no translations exist', async () => {
            Translation.find.mockResolvedValue([]);

            const result = await getAllTranslations();

            expect(Translation.find).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });

    describe('addNewTranslation', () => {
        it('should add a new translation and return the created translation', async () => {
            const mockTranslationData = {
                language: 'en',
                key: 'farewell',
                translation: 'Goodbye',
            };
            const mockCreatedTranslation = { ...mockTranslationData, id: '1' };

            Translation.create.mockResolvedValue(mockCreatedTranslation);

            const result = await addNewTranslation(
                mockTranslationData.language,
                mockTranslationData.key,
                mockTranslationData.translation
            );

            expect(Translation.create).toHaveBeenCalledWith(mockTranslationData);
            expect(result).toBeUndefined(); // The function does not return anything
        });

        it('should throw an error if the translation could not be created', async () => {
            Translation.create.mockResolvedValue(null);

            await expect(
                addNewTranslation('en', 'farewell', 'Goodbye')
            ).rejects.toThrow('Error creating translation');

            expect(Translation.create).toHaveBeenCalledWith({
                language: 'en',
                key: 'farewell',
                translation: 'Goodbye',
            });
        });
    });

    describe('updateTranslation', () => {
        it('should update an existing translation and return the updated translation', async () => {
            const mockUpdatedTranslation = {
                language: 'en',
                key: 'greeting',
                translation: 'Hi',
            };

            Translation.findOneAndUpdate.mockResolvedValue(mockUpdatedTranslation);

            const result = await updateTranslation(
                'en',
                'greeting',
                'Hi'
            );

            expect(Translation.findOneAndUpdate).toHaveBeenCalledWith(
                { language: 'en', key: 'greeting' },
                { translation: 'Hi' },
                { new: true }
            );
            expect(result).toBeUndefined(); // The function does not return anything
        });

        it('should throw an error if the translation could not be updated', async () => {
            Translation.findOneAndUpdate.mockResolvedValue(null);

            await expect(
                updateTranslation('en', 'greeting', 'Hi')
            ).rejects.toThrow('Error updating translation');

            expect(Translation.findOneAndUpdate).toHaveBeenCalledWith(
                { language: 'en', key: 'greeting' },
                { translation: 'Hi' },
                { new: true }
            );
        });
    });

    describe('updateTranslationsBatch', () => {
        it('should update translations in batch and return the result', async () => {
            const mockUpdates = [
                { language: 'en', key: 'greeting', index: 0, translation: 'Hi' },
                { language: 'es', key: 'greeting', index: 0, translation: 'Hola' },
            ];
            const mockBulkResult = { modifiedCount: 2 };

            Translation.bulkWrite.mockResolvedValue(mockBulkResult);

            const result = await updateTranslationsBatch(mockUpdates);

            expect(Translation.bulkWrite).toHaveBeenCalledWith([
                {
                    updateOne: {
                        filter: { language: 'en', key: 'greeting' },
                        update: { $set: { translation: ['Hi'] } },
                    },
                },
                {
                    updateOne: {
                        filter: { language: 'es', key: 'greeting' },
                        update: { $set: { translation: ['Hola'] } },
                    },
                },
            ]);
            expect(result).toEqual(mockBulkResult);
        });

        it('should throw an error if no valid updates are provided', async () => {
            const mockInvalidUpdates = [
                { language: null, key: null, index: null, translation: null },
            ];

            await expect(
                updateTranslationsBatch(mockInvalidUpdates)
            ).rejects.toThrow('Failed to update translations in batch');

            expect(Translation.bulkWrite).not.toHaveBeenCalled();
        });

        it('should throw an error if the batch update fails', async () => {
            const mockUpdates = [
                { language: 'en', key: 'greeting', index: 0, translation: 'Hi' },
            ];

            Translation.bulkWrite.mockRejectedValue(
                new Error('Failed to update translations in batch')
            );

            await expect(
                updateTranslationsBatch(mockUpdates)
            ).rejects.toThrow('Failed to update translations in batch');

            expect(Translation.bulkWrite).toHaveBeenCalled();
        });
    });
});
