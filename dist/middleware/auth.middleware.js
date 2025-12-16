"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Attache un objet typé sur req.user (voir declaration d'interface)
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error('JWT verification failed:', err);
        return res.status(401).json({ error: 'Token invalide ou expiré' });
    }
};
exports.authenticate = authenticate;
