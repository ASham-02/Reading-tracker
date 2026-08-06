// Import the Prisma Client generated from the schema
const { PrismaClient } = require("../../generated/prisma");

// Create a single Prisma Client instance
const prisma = new PrismaClient();

// Export the Prisma Client so it can be used in the application
module.exports = prisma;