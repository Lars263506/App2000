import express from 'express';
import passport from '../config/passportConfig.js';

import { authorizeClubowner } from '../middleware/authorization.js';

import {
    getMinutes,
    addMinute,
    deleteMinute,
    updateMinute
} from '../controllers/minutesController.js';

/**
 * @author Lars Andreas Strand
 * @description Router for minutes requests
 * This router handles all the requests related to minutes.
 * It also handles middleware for authentication and authorization.
 * It uses the passport middleware for authentication
 * and it uses the authorization middleware for authorization.
 * Copilot was used for code and comment structure and some code generation, but the logic is based on my own knowledge.
 */

const router = express.Router();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    getMinutes
);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    addMinute
);

router.delete('/',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    deleteMinute
);

router.put('/',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    updateMinute
);

export default router;
