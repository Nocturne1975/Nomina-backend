import prisma from '../prisma';

async function main() {
  await prisma.user.upsert({
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
  await prisma.$disconnect();
});