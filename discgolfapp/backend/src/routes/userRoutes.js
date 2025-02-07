import express from 'express';

import passport from '../config/passportConfig.js';
import { authorizeAdmin } from '../middleware/authorization.js';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter.js';
import { 
    getAllUsers,
    getUser,
    getUserByEmail,
    registerUser, 
    loginUser, 
    logoutUser, 
    changeDisplayName,
    changeEmail, 
    changePassword,
    changeRole, 
    deleteUser 
} from '../controllers/userController.js';

/**
 * @author Lars263506 (Github)
 * @description Router for user requests
 */
const router = express.Router();

router.get('/', 
    passport.authenticate('jwt', { session: false }), 
    authorizeAdmin, 
    getAllUsers
);

router.get('/:id', 
    passport.authenticate('jwt', { session: false }), 
    authorizeAdmin, 
    getUser
);

router.get('/logout', 
    logoutUser
);

router.post('/get-by-email', 
    passport.authenticate('jwt', { session: false }), 
    authorizeAdmin, 
    getUserByEmail
);
router.post('/', 
    registerLimiter, 
    registerUser
);

router.post('/login', 
    loginLimiter, 
    loginUser
);

router.put('/change-display-name', 
    passport.authenticate('jwt', { session: false }), 
    changeDisplayName
);

router.put('/change-email', 
    passport.authenticate('jwt', { session: false }), 
    changeEmail
);

router.put('/change-password', 
    passport.authenticate('jwt', { session: false }), 
    changePassword
);

router.put('/change-role', 
    passport.authenticate('jwt', { session: false }), 
    authorizeAdmin, 
    changeRole
);

router.delete('/', 
    passport.authenticate('jwt', { session: false }), 
    authorizeAdmin, 
    deleteUser
);

export default router;
