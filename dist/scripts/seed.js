"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../prisma"));
async function main() {
    await prisma_1.default.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: 'changeme', // Remplacer par un vrai hash en production
            email: 'admin@example.com',
            role: 'admin'
        }
    });
    console.log('Seed done');
}
main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma_1.default.$disconnect();
});
