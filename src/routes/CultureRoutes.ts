import { Router } from 'express';
import { getCultureById, createCulture, updateCulture, deleteCulture, totalCulture } from '../controllers/CultureController';


const router = Router();

router.get('/:id', getCultureById);
router.post('/', createCulture);
router.put('/:id', updateCulture);
router.delete('/:id', deleteCulture);
router.get('/total', totalCulture);

export default router;