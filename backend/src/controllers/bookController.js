import bookService from "../services/bookService.js";


// Get all books belonging to the logged-in user
const getAllBooks = async (request, h) => {
  try {
    // Get the logged-in user's ID from their JWT
    const userId = request.auth.credentials.userId;

    // Only get books belonging to this user
    const books = await bookService.getAllBooks(userId);

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

    // Get the logged-in user's ID from their JWT
    const userId = request.auth.credentials.userId;

    // Find the book only if it belongs to the logged-in user
    const book = await bookService.getBookById(id, userId);

    // If the book does not exist or belongs to another user
    if (!book) {
      return h
        .response({
          message: "Book not found",
        })
        .code(404);
    }

    // Return the book
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

    // Create the book and associate it with the logged-in user
    const newBook = await bookService.createBook(bookData, userId);

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

    // Get the logged-in user's ID from their JWT
    const userId = request.auth.credentials.userId;

    // Get the updated book information from the request body
    const bookData = request.payload;

    // Only update the book if it belongs to the logged-in user
    const result = await bookService.updateBook(
      id,
      bookData,
      userId
    );

    // updateMany returns a count of how many records were updated
    // If nothing was updated, the book was not found for this user
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

    // Get the logged-in user's ID from their JWT
    const userId = request.auth.credentials.userId;

    // Only delete the book if it belongs to the logged-in user
    const result = await bookService.deleteBook(id, userId);

    // deleteMany returns a count of how many records were deleted
    // If nothing was deleted, the book was not found for this user
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