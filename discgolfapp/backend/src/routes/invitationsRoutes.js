import express from 'express';
import passport from '../config/passportConfig.js';

import { checkMemberStatus } from '../middleware/auth.js';
import { authorizeClubowner } from '../middleware/authorization.js';

import {
    getInvitations,
    addInvitation,
    deleteInvitation,
    updateInvitation
} from '../controllers/invitationsController.js';

/**
 * @author Lars Andreas Strand
 * @description Router for invitations requests
 * This router handles all the requests related to invitations.
 * It also handles middleware for authentication and authorization.
 * It uses the passport middleware for authentication
 * and it uses the authorization middleware for authorization.
 */

const router = express.Router();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    getInvitations
);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    addInvitation
);
router.delete('/',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    deleteInvitation
);
router.put('/',
    passport.authenticate('jwt', { session: false }),
    authorizeClubowner,
    updateInvitation
);

export default router;
