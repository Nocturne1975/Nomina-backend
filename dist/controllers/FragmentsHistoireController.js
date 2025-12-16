"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalFragmentsHistoire = exports.deleteFragmentHistoire = exports.updateFragmentHistoire = exports.createFragmentHistoire = exports.getFragmentHistoireById = exports.getFragmentsHistoire = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// GET - lister tous les fragments d'histoire
const getFragmentsHistoire = async (_req, res) => {
    try {
        const fragments = await prisma_1.default.fragmentsHistoire.findMany({
            include: {
                culture: true,
                categorie: true,
            },
            orderBy: { id: 'asc' },
        });
        res.json(fragments);
    }
    catch (error) {
        console.error('Erreur getFragmentsHistoire:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getFragmentsHistoire = getFragmentsHistoire;
// GET - récupérer un fragment par id (avec relations)
const getFragmentHistoireById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const fragment = await prisma_1.default.fragmentsHistoire.findUnique({
            where: { id },
            include: {
                culture: true,
                categorie: true,
            },
        });
        if (!fragment)
            return res.status(404).json({ error: "Fragment d'histoire non trouvé" });
        res.json(fragment);
    }
    catch (error) {
        console.error('Erreur getFragmentHistoireById:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getFragmentHistoireById = getFragmentHistoireById;
// POST - créer un nouveau fragment d'histoire
const createFragmentHistoire = async (req, res) => {
    try {
        const { texte, appliesTo, genre, minNameLength, maxNameLength, cultureId, categorieId, } = req.body;
        // texte est requis selon le schema Prisma
        if (!texte || typeof texte !== 'string') {
            return res.status(400).json({ error: 'Le champ "texte" est requis et doit être une chaîne' });
        }
        const minLenNum = minNameLength !== undefined && minNameLength !== null ? Number(minNameLength) : null;
        const maxLenNum = maxNameLength !== undefined && maxNameLength !== null ? Number(maxNameLength) : null;
        const cultureIdNum = cultureId !== undefined && cultureId !== null ? Number(cultureId) : null;
        const categorieIdNum = categorieId !== undefined && categorieId !== null ? Number(categorieId) : null;
        const newFragment = await prisma_1.default.fragmentsHistoire.create({
            data: {
                texte,
                appliesTo: appliesTo ?? null,
                genre: genre ?? null,
                minNameLength: minLenNum,
                maxNameLength: maxLenNum,
                cultureId: cultureIdNum,
                categorieId: categorieIdNum,
            },
        });
        res.status(201).json(newFragment);
    }
    catch (error) {
        console.error('Erreur createFragmentHistoire:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.createFragmentHistoire = createFragmentHistoire;
// PUT - modifier un fragment par son id
const updateFragmentHistoire = async (req, res) => {
    try {
        const { texte, appliesTo, genre, minNameLength, maxNameLength, cultureId, categorieId, } = req.body;
        const minLenNum = minNameLength !== undefined && minNameLength !== null ? Number(minNameLength) : null;
        const maxLenNum = maxNameLength !== undefined && maxNameLength !== null ? Number(maxNameLength) : null;
        const cultureIdNum = cultureId !== undefined && cultureId !== null ? Number(cultureId) : null;
        const categorieIdNum = categorieId !== undefined && categorieId !== null ? Number(categorieId) : null;
        const updated = await prisma_1.default.fragmentsHistoire.update({
            where: { id: Number(req.params.id) },
            data: {
                // si un champ n'est pas fourni dans le body, on ne l'écrase pas (undefined)
                texte: texte ?? undefined,
                appliesTo: appliesTo ?? null,
                genre: genre ?? null,
                minNameLength: minNameLength === undefined ? undefined : minLenNum,
                maxNameLength: maxNameLength === undefined ? undefined : maxLenNum,
                cultureId: cultureId === undefined ? undefined : cultureIdNum,
                categorieId: categorieId === undefined ? undefined : categorieIdNum,
            },
        });
        res.json(updated);
    }
    catch (error) {
        console.error('Erreur updateFragmentHistoire:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.updateFragmentHistoire = updateFragmentHistoire;
// DELETE - supprimer un fragment
const deleteFragmentHistoire = async (req, res) => {
    try {
        await prisma_1.default.fragmentsHistoire.delete({ where: { id: Number(req.params.id) } });
        res.status(204).end();
    }
    catch (error) {
        console.error('Erreur deleteFragmentHistoire:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.deleteFragmentHistoire = deleteFragmentHistoire;
// Aggregation - obtenir le nombre total de fragments d'histoire
const totalFragmentsHistoire = async (_req, res) => {
    try {
        const count = await prisma_1.default.fragmentsHistoire.count();
        res.json({ total: count });
    }
    catch (error) {
        console.error('Erreur totalFragmentsHistoire:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.totalFragmentsHistoire = totalFragmentsHistoire;
