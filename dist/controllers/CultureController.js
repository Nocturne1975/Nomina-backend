"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalCulture = exports.deleteCulture = exports.updateCulture = exports.createCulture = exports.getCultureById = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getCultureById = async (req, res) => {
    try {
        const culture = await prisma_1.default.culture.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                nomPersonnages: true,
                fragmentsHistoire: true,
                titres: true,
            },
        });
        if (!culture)
            return res.status(404).json({ error: 'Culture non trouvée' });
        res.json(culture);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getCultureById = getCultureById;
// POST - creer une nouvelle culture
const createCulture = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCulture = await prisma_1.default.culture.create({
            data: { name, description },
        });
        res.status(201).json(newCulture);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.createCulture = createCulture;
// PUT - modifier la culture par son id
const updateCulture = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedCulture = await prisma_1.default.culture.update({
            where: { id: Number(req.params.id) },
            data: { name, description },
        });
        res.json(updatedCulture);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.updateCulture = updateCulture;
// DELETE - supprimer une culture
const deleteCulture = async (req, res) => {
    try {
        await prisma_1.default.culture.delete({ where: { id: Number(req.params.id) } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.deleteCulture = deleteCulture;
// Aggregation - obtenir le nombre total de cultures
const totalCulture = async (req, res) => {
    try {
        const count = await prisma_1.default.culture.count();
        res.json({ total: count });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.totalCulture = totalCulture;
