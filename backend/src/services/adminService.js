// Import the shared Prisma client
import prisma from "../lib/prisma.js";

// Get all books from every user
const getAllBooks = async () => {
  return await prisma.book.findMany({
    // Include basic information about the user who owns each book
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

// Delete any book regardless of which user owns it
const deleteBook = async (bookId) => {
  return await prisma.book.deleteMany({
    where: {
      id: bookId,
    },
  });
};

// Export the admin service functions
export default {
  getAllBooks,
  deleteBook,
};