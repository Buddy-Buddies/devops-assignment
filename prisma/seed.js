// seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({
        where: {
          email: 'hello@rolla.app', // Replace with the actual email you're trying to create
        },
      });

      if (existingUser) {
        // User already exists, handle accordingly
        console.log('User already exists:', existingUser);
      } else {
        // User doesn't exist, proceed with creating it
        const newUser = await prisma.user.create({
          data: {
            name: 'Rolla User',
            email: 'hello@rolla.app', // Replace with the actual email you're trying to create
            location: 'Mostar',
          },
        });

        console.log('User created:', newUser);
      }
  } finally {
    await prisma.$disconnect();
  }
}

// Export the seedDatabase function
module.exports = seedDatabase;
