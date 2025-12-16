"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FragmentsHistoireController_1 = require("../controllers/FragmentsHistoireController");
const router = (0, express_1.Router)();
router.get('/', FragmentsHistoireController_1.getFragmentsHistoire);
// définir /total avant /:id pour éviter que "total" soit interprété comme un id
router.get('/total', FragmentsHistoireController_1.totalFragmentsHistoire);
router.get('/:id', FragmentsHistoireController_1.getFragmentHistoireById);
router.post('/', FragmentsHistoireController_1.createFragmentHistoire);
router.put('/:id', FragmentsHistoireController_1.updateFragmentHistoire);
router.delete('/:id', FragmentsHistoireController_1.deleteFragmentHistoire);
exports.default = router;
