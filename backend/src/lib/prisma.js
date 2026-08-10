// Load environment variables from the .env file
import "dotenv/config";

// Import Prisma Client
import { PrismaClient } from "@prisma/client";

// Create a single Prisma Client instance
const prisma = new PrismaClient();

// Export the Prisma Client so it can be used throughout the app
export default prisma;