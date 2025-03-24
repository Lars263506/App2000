import express from 'express';
import { saveGameResult, getUserGames } from '../controllers/gameController.js';
import { protect } from '../middleware/authMiddleware.js'; // Sørg for at du har en middleware for autentisering

const router = express.Router();

router.post('/games', protect, saveGameResult);
router.get('/users/my-games', protect, getUserGames);

export default router;
