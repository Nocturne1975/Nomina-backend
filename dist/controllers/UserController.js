"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalUser = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// const prisma = new PrismaClient();
//  GET - tous les users de ma base de donnees
const getAllUsers = async (_req, res) => {
    try {
        const users = await prisma_1.default.user.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getAllUsers = getAllUsers;
// GET - un user par son id
const getUserById = async (req, res) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: Number(req.params.id) },
        });
        if (!user)
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getUserById = getUserById;
// POST - creer un nouveau user
const createUser = async (req, res) => {
    try {
        const { username, email, role, password } = req.body;
        const newUser = await prisma_1.default.user.create({
            data: { username, email, role, password },
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.createUser = createUser;
// PUT - modifier un user par son id
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role } = req.body;
        const updatedUser = await prisma_1.default.user.update({
            where: { id: Number(req.params.id) },
            data: { username, email, role },
        });
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.updateUser = updateUser;
// DELETE - supprimer un user par son
const deleteUser = async (req, res) => {
    try {
        await prisma_1.default.user.delete({ where: { id: Number(req.params.id) } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.deleteUser = deleteUser;
// Aggregation - obtenir le nombre total de users
const totalUser = async (req, res) => {
    try {
        const count = await prisma_1.default.user.count(); //where: {username: {contains: 'john'}}
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
exports.totalUser = totalUser;
