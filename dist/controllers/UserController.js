"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const prisma_1 = __importDefault(require("../prisma"));
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
const createUser = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        const newUser = await prisma_1.default.user.create({
            data: { username, password, email, role },
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        const updatedUser = await prisma_1.default.user.update({
            where: { id: Number(req.params.id) },
            data: { username, password, email, role },
        });
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.updateUser = updateUser;
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
