"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Exemple de route d'authentification
router.post('/login', (req, res) => {
    // Logique de connexion ici
    res.send('Connexion');
});
exports.default = router;
