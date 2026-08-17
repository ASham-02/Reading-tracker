// Import Jest so we can create mock functions
import { jest } from "@jest/globals";


// Create mock versions of the Prisma functions used by bookService
// These prevent the tests from making requests to the real database
const mockFindMany = jest.fn();
const mockFindFirst = jest.fn();
const mockCreate = jest.fn();
const mockUpdateMany = jest.fn();
const mockDeleteMany = jest.fn();


// Replace the real Prisma client with a mock Prisma client
jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  default: {
    book: {
      findMany: mockFindMany,
      findFirst: mockFindFirst,
      create: mockCreate,
      updateMany: mockUpdateMany,
      deleteMany: mockDeleteMany,
    },
  },
}));


// Import bookService after Prisma has been mocked
// This ensures bookService uses our mock instead of the real database
const { default: bookService } = await import(
  "../src/services/bookService.js"
);


// Clear the mock history before every test
beforeEach(() => {
  jest.clearAllMocks();
});


// Group all book service tests together
describe("bookService", () => {

  // Test that getAllBooks only searches for books belonging to the user
  test("getAllBooks returns books belonging to the logged-in user", async () => {
    const userId = 1;

    const mockBooks = [
      {
        id: 1,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        userId: 1,
      },
      {
        id: 2,
        title: "1984",
        author: "George Orwell",
        userId: 1,
      },
    ];

    mockFindMany.mockResolvedValue(mockBooks);

    const result = await bookService.getAllBooks(userId);

    // Check that Prisma filters using the logged-in user's ID
    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        userId: 1,
      },
    });

    expect(result).toEqual(mockBooks);
  });


  // Test that getBookById searches using both book ID and user ID
  test("getBookById returns a book belonging to the logged-in user", async () => {
    const bookId = 1;
    const userId = 1;

    const mockBook = {
      id: 1,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      userId: 1,
    };

    mockFindFirst.mockResolvedValue(mockBook);

    const result = await bookService.getBookById(bookId, userId);

    // Both IDs must match
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        id: bookId,
        userId: userId,
      },
    });

    expect(result).toEqual(mockBook);
  });


  // Test that a new book is automatically assigned to the logged-in user
  test("createBook creates a book belonging to the logged-in user", async () => {
    const userId = 1;

    const bookData = {
      title: "The Hunger Games",
      author: "Suzanne Collins",
    };

    const createdBook = {
      id: 3,
      title: "The Hunger Games",
      author: "Suzanne Collins",
      status: "WANT_TO_READ",
      userId: 1,
    };

    mockCreate.mockResolvedValue(createdBook);

    const result = await bookService.createBook(bookData, userId);

    // Check that the logged-in user's ID was added to the book
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        ...bookData,
        userId: userId,
      },
    });

    expect(result).toEqual(createdBook);
  });


  // Test that updateBook only updates a book belonging to the user
  test("updateBook updates a book belonging to the logged-in user", async () => {
    const bookId = 1;
    const userId = 1;

    const bookData = {
      status: "READING",
      notes: "Started reading this book",
    };

    // updateMany returns the number of records that were updated
    const updateResult = {
      count: 1,
    };

    mockUpdateMany.mockResolvedValue(updateResult);

    const result = await bookService.updateBook(
      bookId,
      bookData,
      userId
    );

    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: {
        id: bookId,
        userId: userId,
      },
      data: bookData,
    });

    expect(result).toEqual(updateResult);
  });


  // Test that deleteBook only deletes a book belonging to the user
  test("deleteBook deletes a book belonging to the logged-in user", async () => {
    const bookId = 1;
    const userId = 1;

    // deleteMany returns the number of records that were deleted
    const deleteResult = {
      count: 1,
    };

    mockDeleteMany.mockResolvedValue(deleteResult);

    const result = await bookService.deleteBook(bookId, userId);

    expect(mockDeleteMany).toHaveBeenCalledWith({
      where: {
        id: bookId,
        userId: userId,
      },
    });

    expect(result).toEqual(deleteResult);
  });


  // Test that User 2 cannot update a book belonging to User 1
  test("User 2 cannot update User 1's book", async () => {
    const bookId = 1;

    // The logged-in user is User 2
    const userId = 2;

    const bookData = {
      status: "COMPLETED",
    };

    // No record matched both bookId 1 AND userId 2,
    // so Prisma reports that zero books were updated
    mockUpdateMany.mockResolvedValue({
      count: 0,
    });

    const result = await bookService.updateBook(
      bookId,
      bookData,
      userId
    );

    // Check that Prisma includes User 2's ID in the query
    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: {
        id: 1,
        userId: 2,
      },
      data: bookData,
    });

    // Nothing should have been updated
    expect(result.count).toBe(0);
  });
});