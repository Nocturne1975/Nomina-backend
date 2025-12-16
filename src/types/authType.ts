import { JwtPayload } from 'jsonwebtoken';

// Payload attendu dans ton token
export interface JWTPayload extends JwtPayload {
  sub: string;    // identifiant du user (string si tu utilises UUID ou string id)
  email: string;
  role: string;   // ou string[] si tu as plusieurs rôles
  // iat et exp sont fournis par JwtPayload
}

// Typage de la réponse du login
export interface LoginResponse {
  token: string;
  expiresIn: number;
}
