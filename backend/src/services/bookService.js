// Import the shared Prisma client
import prisma from "../lib/prisma.js";


// Get books
const getAllBooks = async (userId, role) => {

  // ADMIN can see every book in the database
  if (role === "ADMIN") {
    return await prisma.book.findMany();
  }

  // USER can only see their own books
  return await prisma.book.findMany({
    where: {
      userId: userId,
    },
  });
};


// Get one book
const getBookById = async (id, userId, role) => {

  // ADMIN can access any book
  if (role === "ADMIN") {
    return await prisma.book.findFirst({
      where: {
        id: id,
      },
    });
  }

  // USER can only access a book that belongs to them
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


// Update a book
const updateBook = async (id, bookData, userId, role) => {

  // ADMIN can update any book
  if (role === "ADMIN") {
    return await prisma.book.updateMany({
      where: {
        id: id,
      },
      data: bookData,
    });
  }

  // USER can only update their own book
  return await prisma.book.updateMany({
    where: {
      id: id,
      userId: userId,
    },
    data: bookData,
  });
};


// Delete a book
const deleteBook = async (id, userId, role) => {

  // ADMIN can delete any book
  if (role === "ADMIN") {
    return await prisma.book.deleteMany({
      where: {
        id: id,
      },
    });
  }

  // USER can only delete their own book
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
  deleteBook,
};