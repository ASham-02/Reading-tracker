const bookController = require("../controllers/bookController");

const bookRoutes = [
  {
    method: "GET",
    path: "/books",
    handler: bookController.getAllBooks,
  },
];

module.exports = bookRoutes;