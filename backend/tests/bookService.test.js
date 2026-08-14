// Import Jest so we can create mock functions
import { jest } from "@jest/globals";


// Create a mock version of Prisma's findMany function
// This prevents the test from making a request to the real database
const mockFindMany = jest.fn();
// Create a mock version of Prisma's findUnique function
const mockFindUnique = jest.fn();
// Create a mock version of Prisma's create, update and delete funtion
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();


// Replace the real Prisma client with a mock Prisma client for this test
jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  default: {
    book: {
      findMany: mockFindMany,
      findUnique: mockFindUnique,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
    },
  },
}));


// Import the book service after Prisma has been mocked
// This ensures bookService uses the mock instead of the real Prisma client
const { default: bookService } = await import(
  "../src/services/bookService.js"
);


// Group the book service tests together
describe("bookService", () => {

  // Test that getAllBooks returns the books provided by Prisma
  test("getAllBooks returns all books", async () => {

    // Create fake book data to use instead of data from the real database
    const mockBooks = [
      {
        id: 1,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
      },
      {
        id: 2,
        title: "1984",
        author: "George Orwell",
      },
    ];

    // Tell the mocked findMany function what it should return
    mockFindMany.mockResolvedValue(mockBooks);

    // Call the real getAllBooks service function
    const result = await bookService.getAllBooks();

    // Check that the service returned the expected books
    expect(result).toEqual(mockBooks);

    // Check that the service called Prisma's findMany function once
    expect(mockFindMany).toHaveBeenCalledTimes(1);
  });


  // Test that getBookById returns the correct book
  test("getBookById returns a book by its ID", async () => {

    // Create a fake book to use instead of data from the real database
    const mockBook = {
      id: 1,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
    };

    // Tell the mocked findUnique function what it should return
    mockFindUnique.mockResolvedValue(mockBook);

    // Call the real getBookById service function
    const result = await bookService.getBookById(1);

    // Check that the correct book was returned
    expect(result).toEqual(mockBook);

    // Check that Prisma searched using the correct ID
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
  });
  // Test that createBook creates and returns a new book
test("createBook creates a new book", async () => {
  // Data being sent to create the book
  const bookData = {
    title: "The Hunger Games",
    author: "Suzanne Collins",
  };

  // Fake result returned by Prisma after creating the book
  const createdBook = {
    id: 3,
    title: "The Hunger Games",
    author: "Suzanne Collins",
    status: "WANT_TO_READ",
  };

  // Tell the mocked create function what it should return
  mockCreate.mockResolvedValue(createdBook);

  // Call the real service function
  const result = await bookService.createBook(bookData);

  // Check that Prisma received the correct data
  expect(mockCreate).toHaveBeenCalledWith({
    data: bookData,
  });

  // Check that the created book was returned
  expect(result).toEqual(createdBook);
  });
  // Test that updateBook updates and returns a book
test("updateBook updates an existing book", async () => {
  // ID of the book we want to update
  const bookId = 1;

  // New information for the book
  const bookData = {
    status: "READING",
    notes: "Started reading this book",
  };

  // Fake updated book returned by Prisma
  const updatedBook = {
    id: 1,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    status: "READING",
    notes: "Started reading this book",
  };

  // Tell the mocked update function what it should return
  mockUpdate.mockResolvedValue(updatedBook);

  // Call the real service function
  const result = await bookService.updateBook(bookId, bookData);

  // Check that Prisma received the correct ID and updated data
  expect(mockUpdate).toHaveBeenCalledWith({
    where: {
      id: bookId,
    },
    data: bookData,
  });

  // Check that the updated book was returned
  expect(result).toEqual(updatedBook);
  });
  // Test that deleteBook deletes and returns the selected book
test("deleteBook deletes a book", async () => {
  // ID of the book we want to delete
  const bookId = 1;

  // Fake deleted book returned by Prisma
  const deletedBook = {
    id: 1,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
  };

  // Tell the mocked delete function what it should return
  mockDelete.mockResolvedValue(deletedBook);

  // Call the real service function
  const result = await bookService.deleteBook(bookId);

  // Check that Prisma was given the correct book ID
  expect(mockDelete).toHaveBeenCalledWith({
    where: {
      id: bookId,
    },
  });

  // Check that the deleted book was returned
  expect(result).toEqual(deletedBook);
  });
});