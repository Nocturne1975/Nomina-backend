import type { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface JwtUserPayload extends JwtPayload {
  sub: string;    // identifiant du user (string si tu utilises UUID ou string id)
  email: string;
  role: string;   // ou string[] si tu as plusieurs rôles
  // iat et exp sont fournis par JwtPayload
  userId?: number;
  roles?: string[]; // adapte selon ton payload
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization manquante' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Format d\'authorization invalide' });
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // En dev/test tu peux choisir de lancer une erreur pour te rappeler de configurer la variable.
    console.error('JWT_SECRET non défini dans les variables d\'environnement');
    return res.status(500).json({ error: 'Configuration serveur manquante' });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtUserPayload;
    // Attache un objet typé sur req.user (voir declaration d'interface)
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};