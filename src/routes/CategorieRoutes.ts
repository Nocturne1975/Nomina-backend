import { Router } from 'express';
import { getCategorieById, createCategorie, updateCategorie, deleteCategorie, totalCategorie } from '../controllers/CategorieController';


const router = Router();

router.get('/:id', getCategorieById);
router.post('/', createCategorie);
router.put('/:id', updateCategorie);
router.delete('/:id', deleteCategorie);
router.get('/total', totalCategorie);

export default router;
