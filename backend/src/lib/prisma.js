// Load environment variables from the .env file
require("dotenv").config();

// Import the PostgreSQL adapter for Prisma
const { PrismaPg } = require("@prisma/adapter-pg");

// Import the Prisma files generated from the schema
const { PrismaClient } = require("../../generated/prisma/client.js");

// Create a PostgreSQL adapter using the database connection string
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Create a single Prisma Client instance
const prisma = new PrismaClient({ adapter });

// Export the Prisma Client so it can be used throughout the app
module.exports = prisma;
