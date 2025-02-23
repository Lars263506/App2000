import express from 'express';

import { 
    getAllCourses, 
} from '../controllers/courseController.js';

/**
 * @author Lars263506 (Github)
 * @description Router for course requests
 */
const router = express.Router();

router.get('/',
    getAllCourses
);

// router.get('/view',
//     optionalAuth,
//     getView
// );

// router.get('/:id',
//     optionalAuth, 
//     getClubPage
// );

// router.post('/',
//     passport.authenticate('jwt', { session: false }),
//     authorizeClubowner,
//     createNewClubPage
// );

// router.delete('/:id',
//     passport.authenticate('jwt', { session: false }),
//     authorizeClubowner,
//     deleteClubPage
// );

// router.patch('/:id', 
//     passport.authenticate('jwt', { session: false }),
//     authorizeClubowner,
//     updateClubPage
// );

export default router;
