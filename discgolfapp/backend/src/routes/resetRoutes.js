import express from 'express';
import passport from '../config/passportConfig.js';

import { authorizeAdmin } from '../middleware/authorization.js';

import {
    resetTestData
} from '../controllers/resetController.js';

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

router.post('/testdata',
    passport.authenticate('jwt', { session: false }),
    authorizeAdmin,
    resetTestData
);


export default router;
