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
];

export default bookRoutes;