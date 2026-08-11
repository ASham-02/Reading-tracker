import bookService from "../services/bookService.js";

const getAllBooks = async (request, h) => {
  try {
    const books = await bookService.getAllBooks();

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
    // Get the ID from the URL and convert it to a number
    const id = Number(request.params.id);

    // Ask the service to find the book
    const book = await bookService.getBookById(id);

    // If no book was found, return 404
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

const createBook = async (request, h) => {
  try {
    const book = await bookService.createBook(request.payload);

    return h.response(book).code(201);
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

    // Get the updated book information from the request body
    const bookData = request.payload;

    // Pass the ID and updated data to the service
    const updatedBook = await bookService.updateBook(id, bookData);

    // Return the updated book
    return h.response(updatedBook).code(200);

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

    // Delete the book using the service
    await bookService.deleteBook(id);

    // Return a success message
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

export default {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};