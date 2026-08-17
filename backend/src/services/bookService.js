// Import the shared Prisma client
import prisma from "../lib/prisma.js";

// Get all books belonging to the logged-in user
const getAllBooks = async (userId) => {
  return await prisma.book.findMany({
    where: {
      userId: userId,
    },
  });
};

// Get one book belonging to the logged-in user
const getBookById = async (id, userId) => {
  return await prisma.book.findFirst({
    where: {
      id: id,
      userId: userId,
    },
  });
};

// Create a book belonging to the logged-in user
const createBook = async (bookData, userId) => {
  return await prisma.book.create({
    data: {
      ...bookData,
      userId: userId,
    },
  });
};

// Update a book belonging to the logged-in user
const updateBook = async (id, bookData, userId) => {
  return await prisma.book.updateMany({
    where: {
      id: id,
      userId: userId,
    },
    data: bookData,
  });
};

// Delete a book belonging to the logged-in user
const deleteBook = async (id, userId) => {
  return await prisma.book.deleteMany({
    where: {
      id: id,
      userId: userId,
    },
  });
};

// Export the service functions so they can be used by the controller
export default {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};