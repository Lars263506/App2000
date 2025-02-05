import express from 'express';

import passport from '../config/passportConfig.js';
import { authorizeClubowner } from '../middleware/authorization.js';
import { 
    getNonmemberElements,
    getMemberElements, 
    createNewNonmemberElement, 
    createNewMemberElement,
    deleteNonmemberElement, 
    deleteMemberElement,
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

router.delete('/nonmember/:clubid/:elementid',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    deleteNonmemberElement
);

router.delete('/member/:clubid/:elementid',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    deleteMemberElement
);

router.patch('/:id', 
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    updateElement
);

export default router;
