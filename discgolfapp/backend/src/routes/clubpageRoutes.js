import express from 'express';

import passport from '../config/passportConfig.js';
import { authorizeClubowner } from '../middleware/authorization.js';
import { 
    getAllClubPages, 
    getClubPage, 
    createNewClubPage, 
    deleteClubPage, 
    updateClubPage 
} from '../controllers/clubpageController.js';

/**
 * @author Lars263506 (Github)
 * @description Router for webpage requests
 */
const router = express.Router();

router.get('/',
    getAllClubPages
);

router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    getClubPage
);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    createNewClubPage
);

router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    deleteClubPage
);

router.patch('/:id', 
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    updateClubPage
);

export default router;
