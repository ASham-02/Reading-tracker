// Import the shared Prisma client
const prisma = require("../lib/prisma");

// Get all books from the database
const getAllBooks = async () => {
  return await prisma.book.findMany();
};

// Export the service functions
module.exports = {
  getAllBooks,
};