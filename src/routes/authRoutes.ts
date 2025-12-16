import { Router } from 'express';

const router = Router();

// Exemple de route d'authentification
router.post('/login', (req, res) => {
  // Logique de connexion ici
  res.send('Connexion');
});

export default router;