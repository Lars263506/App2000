import express from 'express';
import passport from '../config/passportConfig.js';

import { saveGameResult } from '../controllers/gameController.js';

/**
 * @author Lars Andreas Strand
 * @description Router for game requests
 * This router handles all the requests related to game results.
 * It also handles middleware for authentication and authorization.
 * It uses the passport middleware for authentication
 * and it uses the authorization middleware for authorization.
 */

const router = express.Router();

router.post('/',
    passport.authenticate('jwt', { session: false }), 
    saveGameResult
);

export default router;
