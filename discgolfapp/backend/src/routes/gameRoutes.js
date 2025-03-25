import express from 'express';
import passport from '../config/passportConfig.js';

import { saveGameResult } from '../controllers/gameController.js';

const router = express.Router();

router.post('/',
    passport.authenticate('jwt', { session: false }), 
    saveGameResult
);

export default router;
