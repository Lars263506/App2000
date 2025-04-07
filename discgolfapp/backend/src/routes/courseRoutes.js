import express from 'express'
import passport from '../config/passportConfig.js'

import { authorizeClubowner } from '../middleware/authorization.js'
import {
  getAllCourses,
  getCourse,
  createNewCourse,
  deleteCourse,
  updateCourse
} from '../controllers/courseController.js'
import { updateCoursePins } from '../services/courseService.js';

/**
 * @author Ibrahim Queeum and Lars Andreas Strand
 * @description Router for course requests
 */
const router = express.Router()

router.get('/',
  getAllCourses
)

router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeClubowner,
  getCourse
)

router.get('/:id/pins',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const pins = await getCoursePins(id);
      res.status(200).json(pins);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.post('/',
  passport.authenticate('jwt', { session: false }),
  authorizeClubowner,
  createNewCourse
)

router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeClubowner,
  deleteCourse
)

router.patch('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeClubowner,
  updateCourse
)

router.put('/:id/pins',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      console.log("Request params:", req.params);
      console.log("Request body:", req.body);

      const { id } = req.params;
      const { pins } = req.body;
      const updatedPins = await updateCoursePins(id, pins);
      res.status(200).json(updatedPins);
    } catch (error) {
      console.error("Error updating pins:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

export default router
