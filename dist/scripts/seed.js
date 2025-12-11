"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Ajoute ici tes données de seed, exemple :
    // await prisma.user.create({ data: { name: 'Alice', email: 'alice@example.com' } });
    console.log('Seed terminé !');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
