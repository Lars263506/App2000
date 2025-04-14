import * as courseService from '../services/courseService.js';

/**
 * @author Lars Andreas Strand
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

const getCoursePins = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseService.getCoursePins(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ pins: course.pins, lines: course.lines });
  } catch (error) {
    console.error('Error fetching course pins:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCoursesForOwner = async (req, res) => {
  const { id } = req.user;

  try {
    const courses = await courseService.getCoursesForOwner(id);

    res.status(200).json({ data: courses });
  } catch (error) {
    console.error("Feil ved henting av baner for klubbeier:", error);
    res.status(500).json({ message: "En feil oppstod under henting av baner." });
  }
};

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to create a new course.
 * It creates a new course in the database and sends it as a response.
 * If successful, it sends a 201 status code and the course data.
 * If there is an error, it sends a 404 status code and the error message.
 */
const createNewCourse = async (req, res) => {
  try {
    const response = await courseService.createNewCourse(req.body);
    res.status(201).json({ data: response });
  } catch (err) {
    res.status(404).json({ error: err.message });
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

    const updatedCourse = await courseService.updateCoursePins(id, updateData);

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
