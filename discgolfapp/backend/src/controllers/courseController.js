import * as courseService from '../services/courseService.js';
import Course from '../models/Course.js';

/**
 * @author Lars Andreas Strand and Andreas Nilsen
 * @description This file contains the controller functions for the course routes.
 */

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get all courses.
 * It retrieves all courses from the database and sends them as a response.
 * If successful, it sends a 200 status code and the courses data.
 * If there is an error, it sends a 404 status code and the error message.
 */
const getAllCourses = async (req, res) => {
  try {
    const response = await courseService.getAllCourses();
    res.status(200).json({ data: response });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get a specific course by ID.
 * It retrieves the course from the database and sends it as a response.
 * If successful, it sends a 200 status code and the course data.
 * If there is an error, it sends a 404 status code and the error message.
 */
const getCourse = async (req, res) => {
  try {
    const response = await courseService.getCourse(req.params.id);
    res.json({ data: response });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/**
 * Handles the request to get pins and lines for a specific course by ID.
 * Retrieves the pins and lines associated with the course from the database.
 * If successful, sends a 200 status code with the pins and lines data.
 * If the course is not found, sends a 404 status code with an error message.
 * If there is an internal server error, sends a 500 status code with an error message.
 * 
 * @function getCoursePins
 * @param {Object} req - The request object containing the course ID in params.
 * @param {Object} res - The response object to send the data or error message.
 * @returns {Promise<void>}
 * @author Andreas Nilsen
 */
const getCoursePins = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).select('pins lines');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ pins: course.pins, lines: course.lines });
  } catch (error) {
    console.error('Error fetching course pins:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Handles the request to get courses for a specific owner or admin.
 * Admins can view all courses, while club owners can view only their owned courses.
 * If successful, sends a 200 status code with the courses data.
 * If there is an error, sends a 500 status code with an error message.
 * 
 * @function getCoursesForOwner
 * @param {Object} req - The request object containing user ID and role.
 * @param {Object} res - The response object to send the data or error message.
 * @returns {Promise<void>}
 * @author Andreas Nilsen
 */
const getCoursesForOwner = async (req, res) => {
  const { id, role } = req.user;

  try {
    let courses;

    if (role === 'admin') {
      // Admins can view all courses
      courses = await courseService.getAllCourses();
    } else {
      // Club owners can view courses they own
      courses = await courseService.getCoursesForOwner(id);
    }

    res.status(200).json({ data: courses });
  } catch (error) {
    console.error("Error fetching courses for owner or admin:", error);
    res.status(500).json({ message: "An error occurred while fetching courses." });
  }
};

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to create a new course.
 * It creates a new course in the database and sends it as a response.
 * If successful, it sends a 201 status code and the course data.
 * If there is an error, it sends a 500 status code and the error message.
 */
const createNewCourse = async (req, res) => {
  try {
    const newCourseData = req.body;

    if (!newCourseData.name || !newCourseData.location || !newCourseData.town || !newCourseData.postCode || !newCourseData.difficulty || newCourseData.familyFriendly === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newCourse = await courseService.createNewCourse(newCourseData);

    res.status(201).json({ data: newCourse });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to delete a course by ID.
 * It deletes the course from the database and sends a success message as a response.
 * If successful, it sends a 200 status code and a success message.
 * If there is an error, it sends a 404 status code and the error message.
 */
const deleteCourse = async (req, res) => {
  try {
    const response = await courseService.deleteCourse(req.params.id);
    res.status(200).json({ data: response });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to update a course by ID.
 * It updates the course in the database and sends it as a response.
 * If successful, it sends a 200 status code and the updated course data.
 * If there is an error, it sends a 404 status code and the error message.
 */
const updateCourse = async (req, res) => {
  try {
    const response = await courseService.updateCourse(req.params.id, req.body);
    res.json({ data: response });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/**
 * Handles the request to update pins and lines for a specific course by ID.
 * Validates the pins and lines data, ensuring lines refer to existing pins.
 * Updates the course in the database with the new pins and lines data.
 * If successful, sends a 200 status code with the updated pins and lines data.
 * If the course is not found, sends a 404 status code with an error message.
 * If there is an error, sends a 500 status code with an error message.
 * 
 * @function updateCoursePins
 * @param {Object} req - The request object containing the course ID in params and pins/lines data in the body.
 * @param {Object} res - The response object to send the data or error message.
 * @returns {Promise<void>}
 * @author Andreas Nilsen
 */
const updateCoursePins = async (req, res) => {
  try {
    const { id } = req.params;
    const { pins, lines } = req.body;

    if (!Array.isArray(pins)) {
      return res.status(400).json({ message: 'Pins must be an array' });
    }

    // Valider linjer
    if (lines !== undefined) {
      if (!Array.isArray(lines)) {
        return res.status(400).json({ message: 'Lines must be an array' });
      }
      // Sjekk at linjer kun refererer til eksisterende pins
      const pinIds = pins.map((pin) => pin.id);
      for (const line of lines) {
        if (!pinIds.includes(line.pinId1) || !pinIds.includes(line.pinId2)) {
          return res.status(400).json({
            message: 'Line refers to non-existent pin ID',
          });
        }
      }
    }

    const updateData = { pins };
    if (lines !== undefined) {
      updateData.lines = lines;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ pins: updatedCourse.pins, lines: updatedCourse.lines });
  } catch (error) {
    console.error('Error updating pins:', error);
    res.status(500).json({ message: error.message });
  }
};

export { getAllCourses, getCourse, getCoursePins, getCoursesForOwner, createNewCourse, deleteCourse, updateCourse, updateCoursePins };
