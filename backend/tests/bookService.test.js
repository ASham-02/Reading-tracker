// Import Jest so we can create mock functions
import { jest } from "@jest/globals";


// Create a mock version of Prisma's findMany function
// This prevents the test from making a request to the real database
const mockFindMany = jest.fn();


// Replace the real Prisma client with a mock Prisma client for this test
jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  default: {
    book: {
      findMany: mockFindMany,
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
});