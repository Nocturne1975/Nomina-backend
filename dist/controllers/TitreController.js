"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalTitres = exports.deleteTitre = exports.updateTitre = exports.createTitre = exports.getTitreById = exports.getTitres = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// GET - lister tous les titres
const getTitres = async (_req, res) => {
    try {
        const titres = await prisma_1.default.titre.findMany({
            include: {
                culture: true,
                categorie: true,
            },
            orderBy: { id: 'asc' },
        });
        res.json(titres);
    }
    catch (error) {
        console.error('Erreur getTitres:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getTitres = getTitres;
// GET - récupérer un titre par id (avec relations)
const getTitreById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const titre = await prisma_1.default.titre.findUnique({
            where: { id },
            include: {
                culture: true,
                categorie: true,
            },
        });
        if (!titre)
            return res.status(404).json({ error: 'Titre non trouvé' });
        res.json(titre);
    }
    catch (error) {
        console.error('Erreur getTitreById:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getTitreById = getTitreById;
// POST - créer un nouveau titre
const createTitre = async (req, res) => {
    try {
        const { valeur, type, genre, cultureId, categorieId } = req.body;
        // valeur est requis selon le schema Prisma
        if (!valeur || typeof valeur !== 'string') {
            return res.status(400).json({ error: 'Le champ "valeur" est requis et doit être une chaîne' });
        }
        const cultureIdNum = cultureId !== undefined && cultureId !== null ? Number(cultureId) : null;
        const categorieIdNum = categorieId !== undefined && categorieId !== null ? Number(categorieId) : null;
        const newTitre = await prisma_1.default.titre.create({
            data: {
                valeur,
                type: type ?? null,
                genre: genre ?? null,
                cultureId: cultureIdNum,
                categorieId: categorieIdNum,
            },
        });
        res.status(201).json(newTitre);
    }
    catch (error) {
        console.error('Erreur createTitre:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.createTitre = createTitre;
// PUT - modifier un titre par son id
const updateTitre = async (req, res) => {
    try {
        const { valeur, type, genre, cultureId, categorieId } = req.body;
        const cultureIdNum = cultureId !== undefined && cultureId !== null ? Number(cultureId) : null;
        const categorieIdNum = categorieId !== undefined && categorieId !== null ? Number(categorieId) : null;
        const updated = await prisma_1.default.titre.update({
            where: { id: Number(req.params.id) },
            data: {
                valeur: valeur ?? undefined,
                type: type ?? null,
                genre: genre ?? null,
                cultureId: cultureId === undefined ? undefined : cultureIdNum,
                categorieId: categorieId === undefined ? undefined : categorieIdNum,
            },
        });
        res.json(updated);
    }
    catch (error) {
        console.error('Erreur updateTitre:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.updateTitre = updateTitre;
// DELETE - supprimer un titre
const deleteTitre = async (req, res) => {
    try {
        await prisma_1.default.titre.delete({ where: { id: Number(req.params.id) } });
        res.status(204).end();
    }
    catch (error) {
        console.error('Erreur deleteTitre:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.deleteTitre = deleteTitre;
// Aggregation - obtenir le nombre total de titres
const totalTitres = async (_req, res) => {
    try {
        const count = await prisma_1.default.titre.count();
        res.json({ total: count });
    }
    catch (error) {
        console.error('Erreur totalTitres:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.totalTitres = totalTitres;
