import express from 'express';

import passport from '../config/passportConfig.js';
import { authorizeClubowner } from '../middleware/authorization.js';
import { 
    getNonmemberElements,
    getMemberElements, 
    createNewElement, 
    deleteElement, 
    updateElement 
} from '../controllers/elementController.js';

/**
 * @author Lars Andreas Strand og Adrian Johansen
 * @description Router for element requests
 */
const router = express.Router();

router.get('/nonmember/:id',
    getNonmemberElements
);

router.get('/member/:id',
    passport.authenticate('jwt', { session: false }),
    getMemberElements
);

router.post('/:id',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    createNewElement
);

router.delete('/:id',
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
