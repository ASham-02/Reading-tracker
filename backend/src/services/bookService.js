// Import the shared Prisma client
import prisma from "../lib/prisma.js";

// Get all books from the database
const getAllBooks = async () => {
  return await prisma.book.findMany();
};

// Export the service functions
export default {
  getAllBooks,
};