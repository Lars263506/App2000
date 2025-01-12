import express from 'express';

import passport from '../config/passportConfig.js';
import { authorizeAdmin } from '../middleware/authorization.js';
import { 
    getUser,
    getUserByEmail,
    registerUser, 
    loginUser, 
    logoutUser, 
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

router.get('/:id', passport.authenticate('jwt', { session: false }), authorizeAdmin, getUser);
router.get('/logout', logoutUser);
router.post('/get-by-email', passport.authenticate('jwt', { session: false }), authorizeAdmin, getUserByEmail);
router.post('/', registerUser);
router.post('/login', loginUser);
router.put('/change-email', passport.authenticate('jwt', { session: false }), changeEmail);
router.put('/change-password', passport.authenticate('jwt', { session: false }), changePassword);
router.put('/change-role', passport.authenticate('jwt', { session: false }), authorizeAdmin, changeRole);
router.delete('/', passport.authenticate('jwt', { session: false }), authorizeAdmin, deleteUser);

export default router;