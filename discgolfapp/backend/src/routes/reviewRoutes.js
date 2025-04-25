import express from 'express';
import { getAllReviews, getReviewsByCourseId, addReview } from '../controllers/reviewController.js';

/**
 * @author Ibrahim Queeum
 * @description This file defines the routes for handling review-related operations.
 * It maps HTTP requests to the appropriate controller functions for fetching all reviews, fetching reviews by course ID,
 * and adding a new review.
 * Copilot has been used to generate the code for the functions and comments,
 * but has been reviewed and edited by the author.
 */


const router = express.Router();

/**
 * @description Get all reviews.
 * @route GET /reviews
 */
router.get('/', getAllReviews);

/**
 * @description Get all reviews for a specific course by course ID.
 * @route GET /reviews/course/:courseId
 */
router.get('/course/:courseId', getReviewsByCourseId);

/**
 * @description Add a new review for a course.
 * @route POST /reviews
 */
router.post('/', addReview);

export default router;
