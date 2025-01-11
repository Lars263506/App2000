import express from 'express';
import { 
    getUser,
    getUserByEmail,
    registerUser, 
    loginUser, 
    logoutUser, 
    changeEmail, 
    changePassword, 
    deleteUser 
} from '../controllers/userController.js';

/**
 * @module routes/userRoutes
 * @description Router for user requests
 */
const router = express.Router();

router.get('/:id', getUser);
router.get('/logout', logoutUser);
router.post('/get-by-email', getUserByEmail);
router.post('/', registerUser);
router.post('/login', loginUser);
router.put('/change-email', changeEmail);
router.put('/change-password', changePassword);
router.delete('/', deleteUser);

export default router;