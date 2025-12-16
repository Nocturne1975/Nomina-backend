"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalConcepts = exports.deleteConcept = exports.updateConcept = exports.createConcept = exports.getConceptById = exports.getConcepts = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// GET - lister tous les concepts
const getConcepts = async (_req, res) => {
    try {
        const concepts = await prisma_1.default.concept.findMany({
            include: {
                categorie: true,
            },
            orderBy: { id: 'asc' },
        });
        res.json(concepts);
    }
    catch (error) {
        console.error('Erreur getConcepts:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getConcepts = getConcepts;
// GET - récupérer un concept par id (avec la catégorie)
const getConceptById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const concept = await prisma_1.default.concept.findUnique({
            where: { id },
            include: {
                categorie: true,
            },
        });
        if (!concept)
            return res.status(404).json({ error: 'Concept non trouvé' });
        res.json(concept);
    }
    catch (error) {
        console.error('Erreur getConceptById:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getConceptById = getConceptById;
// POST - créer un nouveau concept
const createConcept = async (req, res) => {
    try {
        const { valeur, type, mood, keywords, categorieId } = req.body;
        // valeur est requis selon le schema Prisma
        if (!valeur || typeof valeur !== 'string') {
            return res.status(400).json({ error: 'Le champ "valeur" est requis et doit être une chaîne' });
        }
        const categorieIdNum = categorieId !== undefined && categorieId !== null ? Number(categorieId) : null;
        const newConcept = await prisma_1.default.concept.create({
            data: {
                valeur,
                type: type ?? null,
                mood: mood ?? null,
                keywords: keywords ?? null,
                categorieId: categorieIdNum,
            },
        });
        res.status(201).json(newConcept);
    }
    catch (error) {
        console.error('Erreur createConcept:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.createConcept = createConcept;
// PUT - modifier un concept par son id
const updateConcept = async (req, res) => {
    try {
        const { valeur, type, mood, keywords, categorieId } = req.body;
        const categorieIdNum = categorieId !== undefined && categorieId !== null ? Number(categorieId) : null;
        const updated = await prisma_1.default.concept.update({
            where: { id: Number(req.params.id) },
            data: {
                valeur: valeur ?? undefined,
                type: type ?? null,
                mood: mood ?? null,
                keywords: keywords ?? null,
                categorieId: categorieId === undefined ? undefined : categorieIdNum,
            },
        });
        res.json(updated);
    }
    catch (error) {
        console.error('Erreur updateConcept:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.updateConcept = updateConcept;
// DELETE - supprimer un concept
const deleteConcept = async (req, res) => {
    try {
        await prisma_1.default.concept.delete({ where: { id: Number(req.params.id) } });
        res.status(204).end();
    }
    catch (error) {
        console.error('Erreur deleteConcept:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.deleteConcept = deleteConcept;
// Aggregation - obtenir le nombre total de concepts
const totalConcepts = async (_req, res) => {
    try {
        const count = await prisma_1.default.concept.count();
        res.json({ total: count });
    }
    catch (error) {
        console.error('Erreur totalConcepts:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.totalConcepts = totalConcepts;
