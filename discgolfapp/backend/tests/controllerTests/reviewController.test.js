import * as reviewController from '../../src/controllers/reviewController.js';
import * as reviewService from '../../src/services/reviewService.js';
import Course from '../../src/models/Course.js';

jest.mock('../../src/services/reviewService.js');
jest.mock('../../src/models/Course.js');

/**
 * @author Lars Andreas Strand
 * @description This test file contains unit tests for the reviewController module.
 * Copilot was used to generate the initial test cases and the initial structure of the tests.
 * The author has modified some mocks and added comments to the code.
 */

describe('reviewController', () => {
    describe('getAllReviews', () => {
        it('should return all reviews', async () => {
            const mockReviews = [{ id: '1', comment: 'Great course!' }, { id: '2', comment: 'Not bad' }];
            const mockReq = {};
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            reviewService.getAllReviews.mockResolvedValue(mockReviews);

            await reviewController.getAllReviews(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockReviews);
        });

        it('should return a 500 error if the service throws an error', async () => {
            const mockReq = {};
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockError = new Error('Failed to fetch reviews');

            reviewService.getAllReviews.mockRejectedValue(mockError);

            await reviewController.getAllReviews(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: mockError.message });
        });
    });

    describe('getReviewsByCourseId', () => {
        it('should return reviews for a specific course', async () => {
            const mockReviews = [{ id: '1', comment: 'Great course!' }];
            const mockReq = { params: { courseId: '123' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            reviewService.getReviewsByCourseId.mockResolvedValue(mockReviews);

            await reviewController.getReviewsByCourseId(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockReviews);
        });

        it('should return a 500 error if the service throws an error', async () => {
            const mockReq = { params: { courseId: '123' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockError = new Error('Failed to fetch reviews');

            reviewService.getReviewsByCourseId.mockRejectedValue(mockError);

            await reviewController.getReviewsByCourseId(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Failed to fetch reviews', error: mockError.message });
        });
    });

    describe('addReview', () => {
        it('should add a new review and return it', async () => {
            const mockReq = {
                body: {
                    courseId: '123',
                    username: 'JohnDoe',
                    rating: 5,
                    comment: 'Amazing course!'
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockReview = { id: '1', ...mockReq.body };

            reviewService.addReview.mockResolvedValue(mockReview);
            Course.findByIdAndUpdate.mockResolvedValue();

            await reviewController.addReview(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(mockReview);
        });

        it('should return a 400 error if the service throws an error', async () => {
            const mockReq = {
                body: {
                    courseId: '123',
                    username: 'JohnDoe',
                    rating: 5,
                    comment: 'Amazing course!'
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockError = new Error('Failed to add review');

            reviewService.addReview.mockRejectedValue(mockError);

            await reviewController.addReview(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: mockError.message });
        });
    });
});
