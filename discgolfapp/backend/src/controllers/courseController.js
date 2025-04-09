import * as courseService from '../services/courseService.js'
import Course from '../models/Course.js';

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
    const response = await courseService.getAllCourses()
    res.status(200).json({ data: response })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to get a specific course by ID.
 * It retrieves the course from the database and sends it as a response.
 * If successful, it sends a 200 status code and the course data.
 * If there is an error, it sends a 404 status code and the error message.
 */

const getCourse = async (req, res) => {
  try {
    const response = await courseService.getCourse(req.params.id)
    res.json({ data: response })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

const getCoursePins = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).select('pins');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course.pins);
  } catch (error) {
    console.error('Error fetching course pins:', error);
    res.status(500).json({ message: error.message });
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
    const response = await courseService.createNewCourse(req.body)
    res.status(201).json({ data: response })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to delete a course by ID.
 * It deletes the course from the database and sends a success message as a response.
 * If successful, it sends a 200 status code and a success message.
 * If there is an error, it sends a 404 status code and the error message.
 */

const deleteCourse = async (req, res) => {
  try {
    const response = await courseService.deleteCourse(req.params.id)
    res.status(200).json({ data: response })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

/**
 * @author Lars Andreas Strand
 * @description This function handles the request to update a course by ID.
 * It updates the course in the database and sends it as a response.
 * If successful, it sends a 200 status code and the updated course data.
 * If there is an error, it sends a 404 status code and the error message.
 */

const updateCourse = async (req, res) => {
  try {
    const response = await courseService.updateCourse(req.params.id, req.body)
    res.json({ data: response })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

const updateCoursePins = async (req, res) => {
  try {
    const { id } = req.params;
    const { pins } = req.body;

    if (!Array.isArray(pins)) {
      return res.status(400).json({ message: "Pins must be an array" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: { pins } },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ data: updatedCourse.pins });
  } catch (error) {
    console.error("Error updating pins:", error);
    res.status(500).json({ message: error.message });
  }
};

export { getAllCourses, getCourse, getCoursePins, createNewCourse, deleteCourse, updateCourse, updateCoursePins }
