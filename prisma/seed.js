const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'Rolla User',
      email: 'hello@rolla.app',
      location: 'Mostar',
    },
  });

  await prisma.$disconnect();
}

main().catch((e) => {
  throw e;
});