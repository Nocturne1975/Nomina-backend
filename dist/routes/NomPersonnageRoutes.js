"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NomPersonnageController_1 = require("../controllers/NomPersonnageController");
const router = (0, express_1.Router)();
router.get('/', NomPersonnageController_1.getNomPersonnages);
// Important: définir /total avant /:id sinon "total" sera capturé par le paramètre :id
router.get('/total', NomPersonnageController_1.totalNomPersonnage);
router.get('/:id', NomPersonnageController_1.getNomPersonnageById);
router.post('/', NomPersonnageController_1.createNomPersonnage);
router.put('/:id', NomPersonnageController_1.updateNomPersonnage);
router.delete('/:id', NomPersonnageController_1.deleteNomPersonnage);
exports.default = router;
