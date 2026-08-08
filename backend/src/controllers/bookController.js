const bookService = require("../services/bookService");

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

module.exports = {
  getAllBooks,
};