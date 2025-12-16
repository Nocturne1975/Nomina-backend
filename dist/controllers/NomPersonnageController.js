"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalNomPersonnage = exports.deleteNomPersonnage = exports.updateNomPersonnage = exports.createNomPersonnage = exports.getNomPersonnageById = exports.getNomPersonnages = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// GET - lister tous les noms de personnage
const getNomPersonnages = async (_req, res) => {
    try {
        const noms = await prisma_1.default.nomPersonnage.findMany({
            include: {
                culture: true,
                categorie: true,
            },
            orderBy: { id: 'asc' },
        });
        res.json(noms);
    }
    catch (error) {
        console.error('Erreur getNomPersonnages:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getNomPersonnages = getNomPersonnages;
// GET - récupérer un nom de personnage par id (avec relations)
const getNomPersonnageById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const nom = await prisma_1.default.nomPersonnage.findUnique({
            where: { id },
            include: {
                culture: true,
                categorie: true,
            },
        });
        if (!nom)
            return res.status(404).json({ error: 'NomPersonnage non trouvé' });
        res.json(nom);
    }
    catch (error) {
        console.error('Erreur getNomPersonnageById:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getNomPersonnageById = getNomPersonnageById;
// POST - créer un nouveau NomPersonnage
const createNomPersonnage = async (req, res) => {
    try {
        const { valeur, genre, cultureId, categorieId, } = req.body;
        // conversion si les ids sont envoyés en string
        const cultureIdNum = cultureId !== undefined && cultureId !== null ? Number(cultureId) : null;
        const categorieIdNum = categorieId !== undefined && categorieId !== null ? Number(categorieId) : null;
        const newNomPersonnage = await prisma_1.default.nomPersonnage.create({
            data: {
                valeur: valeur ?? null,
                genre: genre ?? null,
                // on peut fournir directement les FK
                cultureId: cultureIdNum,
                categorieId: categorieIdNum,
            },
        });
        res.status(201).json(newNomPersonnage);
    }
    catch (error) {
        console.error('Erreur createNomPersonnage:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.createNomPersonnage = createNomPersonnage;
// PUT - modifier un NomPersonnage par son id
const updateNomPersonnage = async (req, res) => {
    try {
        const { valeur, genre, cultureId, categorieId, } = req.body;
        const cultureIdNum = cultureId !== undefined && cultureId !== null ? Number(cultureId) : null;
        const categorieIdNum = categorieId !== undefined && categorieId !== null ? Number(categorieId) : null;
        const updated = await prisma_1.default.nomPersonnage.update({
            where: { id: Number(req.params.id) },
            data: {
                valeur: valeur ?? null,
                genre: genre ?? null,
                cultureId: cultureIdNum,
                categorieId: categorieIdNum,
            },
        });
        res.json(updated);
    }
    catch (error) {
        console.error('Erreur updateNomPersonnage:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.updateNomPersonnage = updateNomPersonnage;
// DELETE - supprimer un NomPersonnage
const deleteNomPersonnage = async (req, res) => {
    try {
        await prisma_1.default.nomPersonnage.delete({ where: { id: Number(req.params.id) } });
        res.status(204).end();
    }
    catch (error) {
        console.error('Erreur deleteNomPersonnage:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.deleteNomPersonnage = deleteNomPersonnage;
// Aggregation - obtenir le nombre total de NomPersonnage
const totalNomPersonnage = async (_req, res) => {
    try {
        const count = await prisma_1.default.nomPersonnage.count();
        res.json({ total: count });
    }
    catch (error) {
        console.error('Erreur totalNomPersonnage:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.totalNomPersonnage = totalNomPersonnage;
