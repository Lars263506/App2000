import express from 'express';

import passport from '../config/passportConfig.js';
import { authorizeClubowner } from '../middleware/authorization.js';
import { 
    getNonmemberElements,
    getMemberElements, 
    createNewNonmemberElement, 
    createNewMemberElement,
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

router.post('/nonmember/:id',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    createNewNonmemberElement
);

router.post('/member/:id',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    createNewMemberElement
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
