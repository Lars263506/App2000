/**
 * Represents a review for a disc golf game or course.
 * 
 * @author Ibrahim Queeum
 * @description This file defines the `Review` type, which represents a review for a disc golf game or course.
 * It includes details such as the username of the reviewer, the rating they provided, and their comments.
 */

type Review = {
    username: string;
    rating: number;
    comment: string;
}

export default Review;
