"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalLieux = exports.deleteLieu = exports.updateLieu = exports.createLieu = exports.getLieuById = exports.getLieux = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// GET - lister tous les lieux
const getLieux = async (_req, res) => {
    try {
        const lieux = await prisma_1.default.lieux.findMany({
            include: {
                categorie: true,
            },
            orderBy: { id: 'asc' },
        });
        res.json(lieux);
    }
    catch (error) {
        console.error('Erreur getLieux:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getLieux = getLieux;
// GET - récupérer un lieu par id (avec la catégorie)
const getLieuById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const lieu = await prisma_1.default.lieux.findUnique({
            where: { id },
            include: {
                categorie: true,
            },
        });
        if (!lieu)
            return res.status(404).json({ error: 'Lieu non trouvé' });
        res.json(lieu);
    }
    catch (error) {
        console.error('Erreur getLieuById:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getLieuById = getLieuById;
// POST - créer un nouveau lieu
const createLieu = async (req, res) => {
    try {
        const { value, type, categorieId } = req.body;
        // value est requis selon le schema Prisma
        if (!value || typeof value !== 'string') {
            return res.status(400).json({ error: 'Le champ "value" est requis et doit être une chaîne' });
        }
        const categorieIdNum = categorieId !== undefined && categorieId !== null ? Number(categorieId) : null;
        const newLieu = await prisma_1.default.lieux.create({
            data: {
                value,
                type: type ?? null,
                categorieId: categorieIdNum,
            },
        });
        res.status(201).json(newLieu);
    }
    catch (error) {
        console.error('Erreur createLieu:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.createLieu = createLieu;
// PUT - modifier un lieu par son id
const updateLieu = async (req, res) => {
    try {
        const { value, type, categorieId } = req.body;
        const categorieIdNum = categorieId !== undefined && categorieId !== null ? Number(categorieId) : null;
        const updated = await prisma_1.default.lieux.update({
            where: { id: Number(req.params.id) },
            data: {
                // si la valeur est absente dans le body on laisse la valeur existante en passant null explicitement uniquement si
                // le client envoie null; ici on applique valeur || null pour rester cohérent avec les autres contrôleurs
                value: value ?? undefined,
                type: type ?? null,
                categorieId: categorieIdNum,
            },
        });
        res.json(updated);
    }
    catch (error) {
        console.error('Erreur updateLieu:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.updateLieu = updateLieu;
// DELETE - supprimer un lieu
const deleteLieu = async (req, res) => {
    try {
        await prisma_1.default.lieux.delete({ where: { id: Number(req.params.id) } });
        res.status(204).end();
    }
    catch (error) {
        console.error('Erreur deleteLieu:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.deleteLieu = deleteLieu;
// Aggregation - obtenir le nombre total de lieux
const totalLieux = async (_req, res) => {
    try {
        const count = await prisma_1.default.lieux.count();
        res.json({ total: count });
    }
    catch (error) {
        console.error('Erreur totalLieux:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.totalLieux = totalLieux;
