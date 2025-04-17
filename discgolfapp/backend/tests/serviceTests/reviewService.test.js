import { getAllReviews, getReviewsByCourseId, addReview } from '../../src/services/reviewService.js';
import Review from '../../src/models/Review.js';
import mongoose from 'mongoose';

jest.mock('../../src/models/Review', () => ({
    find: jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue([]),
    })),
    create: jest.fn(),
}));

describe('reviewService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllReviews', () => {
        it('should return all reviews if they exist', async () => {
            const mockReviews = [
                { id: '1', courseId: 'course1', rating: 5, comment: 'Great course!' },
                { id: '2', courseId: 'course2', rating: 4, comment: 'Good course!' },
            ];

            Review.find.mockResolvedValue(mockReviews);

            const result = await getAllReviews();

            expect(Review.find).toHaveBeenCalled();
            expect(result).toEqual(mockReviews);
        });

        it('should throw an error if no reviews are found', async () => {
            Review.find.mockResolvedValue([]);

            await expect(getAllReviews()).rejects.toThrow('No reviews found');

            expect(Review.find).toHaveBeenCalled();
        });
    });

    describe('getReviewsByCourseId', () => {
        it('should return reviews for a specific course if they exist', async () => {
            const mockCourseId = '507f1f77bcf86cd799439011'; // Valid ObjectId
            const mockReviews = [
                { id: '1', courseId: mockCourseId, rating: 5, comment: 'Great course!' },
            ];

            Review.find.mockImplementation(() => ({
                populate: jest.fn().mockResolvedValue(mockReviews),
            }));

            const result = await getReviewsByCourseId(mockCourseId);

            expect(Review.find).toHaveBeenCalledWith({
                courseId: new mongoose.Types.ObjectId(mockCourseId),
            });
            expect(result).toEqual(mockReviews);
        });

        it('should return an empty array if no reviews are found for the course', async () => {
            const mockCourseId = '507f1f77bcf86cd799439012'; // Valid ObjectId

            Review.find.mockImplementation(() => ({
                populate: jest.fn().mockResolvedValue([]),
            }));

            const result = await getReviewsByCourseId(mockCourseId);

            expect(Review.find).toHaveBeenCalledWith({
                courseId: new mongoose.Types.ObjectId(mockCourseId),
            });
            expect(result).toEqual([]);
        });
    });

    describe('addReview', () => {
        it('should add a new review and return the created review', async () => {
            const mockReviewData = {
                courseId: 'course1',
                userId: 'user1',
                rating: 5,
                comment: 'Amazing course!',
            };
            const mockCreatedReview = { ...mockReviewData, id: '1' };

            Review.create.mockResolvedValue(mockCreatedReview);

            const result = await addReview(mockReviewData);

            expect(Review.create).toHaveBeenCalledWith(mockReviewData);
            expect(result).toEqual(mockCreatedReview);
        });

        it('should throw an error if review creation fails', async () => {
            const mockReviewData = {
                courseId: 'course1',
                userId: 'user1',
                rating: 5,
                comment: 'Amazing course!',
            };

            Review.create.mockRejectedValue(new Error('Failed to create review'));

            await expect(addReview(mockReviewData)).rejects.toThrow('Failed to create review');

            expect(Review.create).toHaveBeenCalledWith(mockReviewData);
        });
    });
});
