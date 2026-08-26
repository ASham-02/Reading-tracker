// Import the admin service
import adminService from "../services/adminService.js";

// Get all books from every user
const getAllBooks = async (request, h) => {
  try {
    // Check that the logged-in user is an admin
    if (request.auth.credentials.role !== "ADMIN") {
      return h
        .response({
          message: "Admin access required",
        })
        .code(403);
    }

    // Get every book in the database
    const books = await adminService.getAllBooks();

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

// Delete any user's book
const deleteBook = async (request, h) => {
  try {
    // Check that the logged-in user is an admin
    if (request.auth.credentials.role !== "ADMIN") {
      return h
        .response({
          message: "Admin access required",
        })
        .code(403);
    }

    // Get the book ID from the URL
    const bookId = Number(request.params.id);

    // Delete the book
    const result = await adminService.deleteBook(bookId);

    // If no book matched the ID
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

// Export the admin controller functions
export default {
  getAllBooks,
  deleteBook,
};