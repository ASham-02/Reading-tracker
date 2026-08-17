import bookController from "../controllers/bookController.js";

const bookRoutes = [
  {
    method: "GET",
    path: "/books",
    handler: bookController.getAllBooks,
    // User must be logged in to access this route
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/books/{id}",
    handler: bookController.getBookById,
    // User must be logged in to access this route
    options: {
      auth: "jwt",
    },
  },
  {
    method: "POST",
    path: "/books",
    handler: bookController.createBook,
    // User must be logged in to create a book
    options: {
      auth: "jwt",
    },
  },
  {
    method: "PUT",
    path: "/books/{id}",
    handler: bookController.updateBook,
    // User must be logged in to update a book
    options: {
      auth: "jwt",
    },
  },
  {
    method: "DELETE",
    path: "/books/{id}",
    handler: bookController.deleteBook,
    // User must be logged in to delete a book
    options: {
      auth: "jwt",
    },
  },
];

export default bookRoutes;