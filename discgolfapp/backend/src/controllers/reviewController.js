import * as reviewService from '../services/reviewService.js';
import Course from '../models/Course.js';


/**
 * @author Ibrahim Queeum
 * @description This file contains the controller logic for handling review-related operations. 
 * It provides endpoints to fetch all reviews, fetch reviews for a specific course, and add a new review. 
 * The controller interacts with the review service and the Course model to perform database operations.
 * 
/**
 
 * @description Get all reviews.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Get all reviews for a specific course by course ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const getReviewsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const reviews = await reviewService.getReviewsByCourseId(courseId);
    res.status(200).json(reviews); // Return the reviews
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

/**
 * @description Add a new review for a course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const addReview = async (req, res) => {
  try {
    const { courseId, username, rating, comment } = req.body;

    console.log('Request body:', req.body); // Debugging log

    // Create the new review
    const newReview = await reviewService.addReview({
      courseId,
      username: username || 'Anonymous',
      rating,
      comment,
    });

    console.log('New review created:', newReview); // Debugging log

    // Add the review to the course's reviews array
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { reviews: newReview._id } }, // Push the review's ID to the reviews array
      { new: true }
    );

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(400).json({ message: error.message });
  }
};

export { getAllReviews, getReviewsByCourseId, addReview };
