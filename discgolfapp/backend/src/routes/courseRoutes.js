import express from 'express';
import passport from '../config/passportConfig.js';

import { authorizeClubowner } from '../middleware/authorization.js';
import {
    getAllCourses,
    getCourse,
    createNewCourse,
    deleteCourse,
    updateCourse
} from '../controllers/courseController.js';

/**
 * @author Ibrahim Queeum and Lars Andreas Strand
 * @description Router for course requests
 */
const router = express.Router();

router.get('/',
    getAllCourses
);

router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    getCourse
);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    createNewCourse
);

router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    deleteCourse
);

router.patch('/:id',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    updateCourse
);

export default router;

