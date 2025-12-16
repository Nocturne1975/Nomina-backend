"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ConceptController_1 = require("../controllers/ConceptController");
const router = (0, express_1.Router)();
router.get('/', ConceptController_1.getConcepts);
// définir /total avant /:id pour éviter que "total" soit interprété comme un id
router.get('/total', ConceptController_1.totalConcepts);
router.get('/:id', ConceptController_1.getConceptById);
router.post('/', ConceptController_1.createConcept);
router.put('/:id', ConceptController_1.updateConcept);
router.delete('/:id', ConceptController_1.deleteConcept);
exports.default = router;
