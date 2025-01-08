import express from 'express';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createNewUser);
router.delete('/:id', deleteUser);
router.patch('/:id', updateUser);
