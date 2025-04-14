import * as courseService from '../services/courseService.js';
import Course from '../models/Course.js';

const getAllCourses = async (req, res) => {
  try {
    const response = await courseService.getAllCourses();
    res.status(200).json({ data: response });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

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

const getClubsForOwner = async (req, res) => {
  try {
    const { clubOwnerId } = req.params;
    const clubs = await courseService.getClubsForClubOwner(clubOwnerId);
    res.status(200).json({ data: clubs });
  } catch (error) {
    console.error('Error fetching clubs for club owner:', error);
    res.status(500).json({ message: error.message });
  }
};

const createNewCourse = async (req, res) => {
  try {
    const response = await courseService.createNewCourse(req.body);
    res.status(201).json({ data: response });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const response = await courseService.deleteCourse(req.params.id);
    res.status(200).json({ data: response });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

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

export { getAllCourses, getCourse, getCoursePins, getClubsForOwner, createNewCourse, deleteCourse, updateCourse, updateCoursePins };