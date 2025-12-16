"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalCategorie = exports.deleteCategorie = exports.updateCategorie = exports.createCategorie = exports.getCategorieById = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getCategorieById = async (req, res) => {
    try {
        const categorie = await prisma_1.default.categorie.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                nomPersonnages: true,
                lieux: true,
                fragmentsHistoire: true,
                titres: true,
                concepts: true,
            },
        });
        if (!categorie)
            return res.status(404).json({ error: 'Catégorie non trouvée' });
        res.json(categorie);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getCategorieById = getCategorieById;
// POST - creer une nouvelle catégorie
const createCategorie = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategorie = await prisma_1.default.categorie.create({
            data: { name, description },
        });
        res.status(201).json(newCategorie);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.createCategorie = createCategorie;
// PUT - modifier la categorie par son id
const updateCategorie = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedCategorie = await prisma_1.default.categorie.update({
            where: { id: Number(req.params.id) },
            data: { name, description },
        });
        res.json(updatedCategorie);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.updateCategorie = updateCategorie;
// DELETE - supprimer une categorie
const deleteCategorie = async (req, res) => {
    try {
        await prisma_1.default.categorie.delete({ where: { id: Number(req.params.id) } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.deleteCategorie = deleteCategorie;
// Aggregation - obtenir le nombre total de categories
const totalCategorie = async (_req, res) => {
    try {
        const count = await prisma_1.default.categorie.count();
        res.json({ total: count });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
exports.totalCategorie = totalCategorie;
