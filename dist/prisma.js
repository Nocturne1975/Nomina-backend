"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_neon_1 = require("@prisma/adapter-neon");
const client_1 = require("./generated/prisma/client");
require("dotenv/config");
const adapter = new adapter_neon_1.PrismaNeon({
    connectionString: process.env.DATABASE_URL,
});
// Créer le client Prisma avec l'adaptateur Neon
const prisma = new client_1.PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
});
exports.default = prisma;
