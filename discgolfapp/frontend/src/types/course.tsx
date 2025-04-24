import Review from './review';

/**
 * Course Type Definition
 * Represents a golf course with its details, including location, difficulty, and reviews.
 * 
 * @typedef {Object} Course
 * @property {string} id - Unique identifier for the course.
 * @property {string} _id - MongoDB identifier for the course.
 * @property {string} name - Name of the course.
 * @property {string} courseOwner - Owner of the course.
 * @property {string} town - Town where the course is located.
 * @property {string} location - Specific location of the course.
 * @property {string} url - URL for more information about the course.
 * @property {string} postCode - Postal code of the course's location.
 * @property {number} latitude - Latitude coordinate of the course.
 * @property {number} longitude - Longitude coordinate of the course.
 * @property {string} difficulty - Difficulty level of the course.
 * @property {boolean} familyFriendly - Indicates if the course is family-friendly.
 * @property {number} holes - Number of holes in the course.
 * @property {Review[]} reviews - List of reviews for the course.
 * @author Andreas Nilsen
 */

type Course = {
    id: string;
    _id: string;
    name: string;
    courseOwner: string;
    town: string;
    location: string;
    url: string;
    postCode: string;
    latitude: number;
    longitude: number;
    difficulty: string;
    familyFriendly: boolean;
    holes: number;
    reviews: Review[];
  }
  export default Course;
