// Import the shared Prisma client
import prisma from "../lib/prisma.js";

// Get all books from the database
const getAllBooks = async () => {
  return await prisma.book.findMany();
};

// Get one book from the database using its ID
const getBookById = async (id) => {
  return await prisma.book.findUnique({
    where: {
      id: id,
    },
  });
};

// Create a new book in the database
const createBook = async (bookData) => {
  return await prisma.book.create({
    data: bookData,
  });
};

// Update an existing book in the database
const updateBook = async (id, bookData) => {
  return await prisma.book.update({
    where: {
      id: id,
    },
    data: bookData,
  });
};

// Delete a book from the database
const deleteBook = async (id) => {
  return await prisma.book.delete({
    where: {
      id: id,
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