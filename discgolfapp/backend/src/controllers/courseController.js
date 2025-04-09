import * as courseService from '../services/courseService.js'
import Course from '../models/Course.js';

const getAllCourses = async (req, res) => {
  try {
    const response = await courseService.getAllCourses()
    res.json({ data: response })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

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

const createNewCourse = async (req, res) => {
  try {
    const response = await courseService.createNewCourse(req.body)
    res.json({ data: response })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

const deleteCourse = async (req, res) => {
  try {
    const response = await courseService.deleteCourse(req.params.id)
    res.json({ data: response })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

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
