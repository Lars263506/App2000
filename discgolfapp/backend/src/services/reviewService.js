import Review from '../models/Review.js';
import mongoose from 'mongoose';


/**
 * @author Ibrahim Queeum
 * @description This file contains the service logic for handling review-related operations.
 * It provides functions to fetch all reviews, fetch reviews for a specific course, and add a new review.
 * These functions interact with the Review model to perform database operations.
 * Copilot has been used to generate the code for the functions and comments,
 * but has been reviewed and edited by the author.
 */


/**
 * @description Fetch all reviews.
 * @returns An array of all reviews.
 */
const getAllReviews = async () => {
  const reviews = await Review.find();
  if (!reviews || reviews.length === 0) {
    throw new Error('No reviews found');
  }
  return reviews;
};

/**
 * @description Fetch all reviews for a specific course by course ID.
 * @param {string} courseId - The ID of the course.
 * @returns An array of reviews for the course.
 */
const getReviewsByCourseId = async (courseId) => {

  const reviews = await Review.find({ courseId: new mongoose.Types.ObjectId(courseId) }).populate('userId', 'displayName');
  return reviews;
};

/**
 * @description Add a new review for a course.
 * @param {object} reviewData - The review data (courseId, username, rating, comment).
 * @returns The created review object.
 */
const addReview = async (reviewData) => {
  const newReview = await Review.create(reviewData);
  return newReview;
};

export { getAllReviews, getReviewsByCourseId, addReview };
