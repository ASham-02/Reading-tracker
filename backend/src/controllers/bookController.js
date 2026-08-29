import bookService from "../services/bookService.js";


// Get all books
const getAllBooks = async (request, h) => {
  try {
    // Get the logged-in user's ID and role from their JWT
    const { userId, role } = request.auth.credentials;

    // USER gets their own books
    // ADMIN can get all books
    const books = await bookService.getAllBooks(userId, role);

    return h.response(books).code(200);

  } catch (error) {
    console.error(error);

    return h
      .response({
        message: "Failed to retrieve books",
      })
      .code(500);
  }
};


// Get one book by its ID
const getBookById = async (request, h) => {
  try {
    // Get the book ID from the URL
    const id = Number(request.params.id);

    // Get the logged-in user's ID and role from their JWT
    const { userId, role } = request.auth.credentials;

    // USER can only find their own book
    // ADMIN can find any user's book
    const book = await bookService.getBookById(
      id,
      userId,
      role
    );

    // If the book cannot be accessed, return 404
    if (!book) {
      return h
        .response({
          message: "Book not found",
        })
        .code(404);
    }

    return h.response(book).code(200);

  } catch (error) {
    console.error(error);

    return h
      .response({
        message: "Failed to retrieve book",
      })
      .code(500);
  }
};


// Create a new book
const createBook = async (request, h) => {
  try {
    // Get the logged-in user's ID from their JWT
    const userId = request.auth.credentials.userId;

    // Get the book information from the request body
    const bookData = request.payload;

    // The new book belongs to the logged-in user
    const newBook = await bookService.createBook(
      bookData,
      userId
    );

    return h.response(newBook).code(201);

  } catch (error) {
    console.error(error);

    return h
      .response({
        message: "Failed to create book",
      })
      .code(500);
  }
};


// Update an existing book
const updateBook = async (request, h) => {
  try {
    // Get the book ID from the URL
    const id = Number(request.params.id);

    // Get the logged-in user's ID and role from their JWT
    const { userId, role } = request.auth.credentials;

    // Get the updated information from the request body
    const bookData = request.payload;

    // USER can only update their own book
    // ADMIN can update any user's book
    const result = await bookService.updateBook(
      id,
      bookData,
      userId,
      role
    );

    // No matching book was found
    if (result.count === 0) {
      return h
        .response({
          message: "Book not found",
        })
        .code(404);
    }

    return h
      .response({
        message: "Book updated successfully",
      })
      .code(200);

  } catch (error) {
    console.error(error);

    return h
      .response({
        message: "Failed to update book",
      })
      .code(500);
  }
};


// Delete an existing book
const deleteBook = async (request, h) => {
  try {
    // Get the book ID from the URL
    const id = Number(request.params.id);

    // Get the logged-in user's ID and role from their JWT
    const { userId, role } = request.auth.credentials;

    // USER can only delete their own book
    // ADMIN can delete any user's book
    const result = await bookService.deleteBook(
      id,
      userId,
      role
    );

    // No matching book was found
    if (result.count === 0) {
      return h
        .response({
          message: "Book not found",
        })
        .code(404);
    }

    return h
      .response({
        message: "Book deleted successfully",
      })
      .code(200);

  } catch (error) {
    console.error(error);

    return h
      .response({
        message: "Failed to delete book",
      })
      .code(500);
  }
};


// Export the controller functions
export default {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};