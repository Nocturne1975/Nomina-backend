"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TitreController_1 = require("../controllers/TitreController");
const router = (0, express_1.Router)();
router.get('/', TitreController_1.getTitres);
// définir /total avant /:id pour éviter que "total" soit interprété comme un id
router.get('/total', TitreController_1.totalTitres);
router.get('/:id', TitreController_1.getTitreById);
router.post('/', TitreController_1.createTitre);
router.put('/:id', TitreController_1.updateTitre);
router.delete('/:id', TitreController_1.deleteTitre);
exports.default = router;
