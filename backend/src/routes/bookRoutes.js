import bookController from "../controllers/bookController.js";

const bookRoutes = [
  {
    method: "GET",
    path: "/books",
    handler: bookController.getAllBooks,
  },
];

export default bookRoutes;