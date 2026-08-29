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

  // Test that getAllBooks only returns books belonging to a normal user
  test("getAllBooks returns books belonging to the logged-in user", async () => {
    const userId = 1;
    const role = "USER";

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

    const result = await bookService.getAllBooks(userId, role);

    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        userId: userId,
      },
    });

    expect(result).toEqual(mockBooks);
  });


  // Test that getBookById searches using both book ID and user ID for a normal user
  test("getBookById returns a book belonging to the logged-in user", async () => {
    const bookId = 1;
    const userId = 1;
    const role = "USER";

    const mockBook = {
      id: 1,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      userId: 1,
    };

    mockFindFirst.mockResolvedValue(mockBook);

    const result = await bookService.getBookById(
      bookId,
      userId,
      role
    );

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

    const result = await bookService.createBook(
      bookData,
      userId
    );

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        ...bookData,
        userId: userId,
      },
    });

    expect(result).toEqual(createdBook);
  });


  // Test that a normal user can update their own book
  test("updateBook updates a book belonging to the logged-in user", async () => {
    const bookId = 1;
    const userId = 1;
    const role = "USER";

    const bookData = {
      status: "READING",
      notes: "Started reading this book",
    };

    const updateResult = {
      count: 1,
    };

    mockUpdateMany.mockResolvedValue(updateResult);

    const result = await bookService.updateBook(
      bookId,
      bookData,
      userId,
      role
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


  // Test that a normal user can delete their own book
  test("deleteBook deletes a book belonging to the logged-in user", async () => {
    const bookId = 1;
    const userId = 1;
    const role = "USER";

    const deleteResult = {
      count: 1,
    };

    mockDeleteMany.mockResolvedValue(deleteResult);

    const result = await bookService.deleteBook(
      bookId,
      userId,
      role
    );

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
    const userId = 2;
    const role = "USER";

    const bookData = {
      status: "COMPLETED",
    };

    mockUpdateMany.mockResolvedValue({
      count: 0,
    });

    const result = await bookService.updateBook(
      bookId,
      bookData,
      userId,
      role
    );

    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: {
        id: bookId,
        userId: userId,
      },
      data: bookData,
    });

    expect(result.count).toBe(0);
  });


  // Test that an ADMIN can update another user's book
  test("ADMIN can update another user's book", async () => {
    const bookId = 1;
    const adminUserId = 3;
    const role = "ADMIN";

    const bookData = {
      status: "COMPLETED",
    };

    mockUpdateMany.mockResolvedValue({
      count: 1,
    });

    const result = await bookService.updateBook(
      bookId,
      bookData,
      adminUserId,
      role
    );

    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: {
        id: bookId,
      },
      data: bookData,
    });

    expect(result.count).toBe(1);
  });


  // Test that a user cannot delete a book belonging to another user
  test("User 2 cannot delete User 1's book", async () => {
    const bookId = 1;
    const userId = 2;
    const role = "USER";

    // No book matches both this book ID and User 2's ID
    mockDeleteMany.mockResolvedValue({
      count: 0,
    });

    const result = await bookService.deleteBook(
      bookId,
      userId,
      role
    );

    // The delete must include the logged-in user's ID
    expect(mockDeleteMany).toHaveBeenCalledWith({
      where: {
        id: bookId,
        userId: userId,
      },
    });

    // No book should have been deleted
    expect(result.count).toBe(0);
  });


  // Test that a user cannot retrieve a book belonging to another user
  test("User 2 cannot retrieve User 1's book", async () => {
    const bookId = 1;
    const userId = 2;
    const role = "USER";

    // Prisma finds nothing because the book does not belong to User 2
    mockFindFirst.mockResolvedValue(null);

    const result = await bookService.getBookById(
      bookId,
      userId,
      role
    );

    // The query must require both the book ID and logged-in user ID
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        id: bookId,
        userId: userId,
      },
    });

    expect(result).toBeNull();
  });
});