import express from 'express';

import passport from '../config/passportConfig.js';
import { authorizeClubowner } from '../middleware/authorization.js';
import {
    getAllClubPages,
    getClubPage,
    getView,
    createNewClubPage,
    deleteClubPage,
    updateClubPage
} from '../controllers/clubpageController.js';
import { checkMemberStatus, optionalAuth } from '../middleware/auth.js';

/**
 * @author Lars263506 (Github)
 * @description Router for webpage requests
 */
const router = express.Router();

router.get('/',
    getAllClubPages
);

router.get('/view/:id',
    checkMemberStatus,
    getView
);

router.get('/:id',
    optionalAuth,
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
