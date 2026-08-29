// Import the admin controller
import adminController from "../controllers/adminController.js";

const adminRoutes = [
  {
    // Admin can view books belonging to every user
    method: "GET",
    path: "/admin/books",
    handler: adminController.getAllBooks,

    options: {
      // User must be logged in
      auth: "jwt",
    },
  },

  {
    // Admin can delete any user's book
    method: "DELETE",
    path: "/admin/books/{id}",
    handler: adminController.deleteBook,

    options: {
      // User must be logged in
      auth: "jwt",
    },
  },
];

export default adminRoutes;