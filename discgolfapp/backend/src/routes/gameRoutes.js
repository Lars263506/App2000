import express from 'express';
import { getAllGames, getGameById } from '../services/gameService.js';

const router = express.Router();

// Rute for å hente alle spill
router.get('/', async (req, res) => {
  try {
    const games = await getAllGames();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Noe gikk galt med å hente spillene' });
  }
});

// Rute for å hente spill etter ID
router.get('/:id', async (req, res) => {
  try {
    const game = await getGameById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
