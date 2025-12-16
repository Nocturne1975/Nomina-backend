"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LieuxController_1 = require("../controllers/LieuxController");
const router = (0, express_1.Router)();
router.get('/', LieuxController_1.getLieux);
// Définir /total avant /:id pour éviter que "total" soit interprété comme un id
router.get('/total', LieuxController_1.totalLieux);
router.get('/:id', LieuxController_1.getLieuById);
router.post('/', LieuxController_1.createLieu);
router.put('/:id', LieuxController_1.updateLieu);
router.delete('/:id', LieuxController_1.deleteLieu);
exports.default = router;
