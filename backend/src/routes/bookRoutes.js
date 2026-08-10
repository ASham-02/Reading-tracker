import bookController from "../controllers/bookController.js";

const bookRoutes = [
  {
    method: "GET",
    path: "/books",
    handler: bookController.getAllBooks,
  },
  {
    method: "POST",
    path: "/books",
    handler: bookController.createBook,
  },
  {
    method: "PUT",
    path: "/books/{id}",
    handler: bookController.updateBook,
  },
  {
    method: "DELETE",
    path: "/books/{id}",
    handler: bookController.deleteBook,
  },
];

export default bookRoutes;