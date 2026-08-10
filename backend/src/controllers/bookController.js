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

export default {
  getAllBooks,
  createBook,
};