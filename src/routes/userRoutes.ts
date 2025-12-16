import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, totalUser } from '../controllers/UserController';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/total', totalUser);

export default router;
