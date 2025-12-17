import { Router } from 'express';
import { loginController } from '../controllers/authControllers';

const router = Router();

router.post('/login', loginController);

export default router;