import express from 'express'
import passport from '../config/passportConfig.js'

import { authorizeClubowner } from '../middleware/authorization.js'
import {
  getAllCourses,
  getCourse,
  getCoursesForOwner,
  getCoursePins,
  createNewCourse,
  deleteCourse,
  updateCourse,
  updateCoursePins
} from '../controllers/courseController.js'

/**
 * @author Ibrahim Queeum and Lars Andreas Strand
 * @description Router for course requests
 * This router handles all the requests related to courses.
 * It also handles middleware for authentication and authorization.
 * It uses the passport middleware for authentication
 * and it uses the authorization middleware for authorization.
 */

const router = express.Router()

router.get('/',
  getAllCourses
)

router.get('/owner',
  passport.authenticate('jwt', { session: false }),
  authorizeClubowner,
  getCoursesForOwner
);

router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeClubowner,
  getCourse
)

router.get('/:id/pins',
  getCoursePins
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
  updateCoursePins
);

export default router
