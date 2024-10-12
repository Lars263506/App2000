import express from 'express';
import { 
    getAllWebpages, 
    getWebpage, 
    createNewWebpage, 
    deleteWebpage, 
    updateWebpage 
} from '../controllers/webpagesController.js';

const router = express.Router();

router.get('/', getAllWebpages);
router.get('/:id', getWebpage);
router.post('/', createNewWebpage);
router.delete('/:id', deleteWebpage);
router.patch('/:id', updateWebpage);

export default router;