import express from 'express';

import passport from '../config/passportConfig.js';
import { optionalAuth } from '../middleware/optionalauth.js';
import { authorizeClubowner } from '../middleware/authorization.js';
import { 
    getElements,
    createNewElement,
    deleteElement, 
    updateElement 
} from '../controllers/elementController.js';

/**
 * @author Lars Andreas Strand og Adrian Johansen
 * @description Router for element requests
 */
const router = express.Router();

router.get('/:id',
    optionalAuth, 
    getElements
);

router.post('/:id',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    createNewElement
);

router.delete('/:clubid/:elementid',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    deleteElement
);

router.patch('/:id', 
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    updateElement
);

export default router;
