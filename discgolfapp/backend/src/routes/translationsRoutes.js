import express from 'express';
import passport from '../config/passportConfig.js';

import {
    getAllTranslations,
    addNewTranslation,
    updateTranslation
} from '../controllers/translationsController.js';
import { authorizeAdmin } from '../middleware/authorization.js';

/**
 * @author Lars Andreas Strand
 * @description Routes for translation requests
 * This router handles all the requests related to translations.
 * It also handles middleware for authentication and authorization.
 * It uses the passport middleware for authentication
 * and it uses the authorization middleware for authorization.
 */

const router = express.Router();

router.get('/',
    getAllTranslations
);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    authorizeAdmin,
    addNewTranslation
);

router.put('/',
    passport.authenticate('jwt', { session: false }),
    authorizeAdmin,
    updateTranslation
);


export default router;
