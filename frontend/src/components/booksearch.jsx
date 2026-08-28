import { useState } from "react";

const BookSearch = ({ onBookAdded }) => {
  // Store what the user types into the search box
  const [searchTerm, setSearchTerm] = useState("");

  // Store books returned by Open Library
  const [results, setResults] = useState([]);

  // Store any error message
  const [error, setError] = useState("");

  // Store a success message
  const [success, setSuccess] = useState("");

  // Track whether a search is currently running
  const [loading, setLoading] = useState(false);

  // Search Open Library
  const searchBooks = async (event) => {
    event.preventDefault();

    if (!searchTerm.trim()) {
      setError("Enter a book title or author to search.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);
    setResults([]);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          searchTerm,
        )}&limit=10`,
      );

      if (!response.ok) {
        throw new Error(
          `Book search failed with status ${response.status}`,
        );
      }

      const data = await response.json();

      // Open Library returns its books inside "docs"
      setResults(data.docs || []);
    } catch (error) {
      console.error("Book search error:", error);

      setError("Unable to search for books.");
    } finally {
      setLoading(false);
    }
  };

  // Add a book from Open Library to the user's own library
  const addBookToLibrary = async (book) => {
    // Clear previous messages
    setError("");
    setSuccess("");

    // Get the logged-in user's JWT
    const token = localStorage.getItem("token");

    try {
      // Send the selected book to our own backend
      const response = await fetch(
        "http://localhost:3000/books",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: book.title,

            // Open Library may return more than one author
            author:
              book.author_name?.join(", ") ||
              "Unknown author",

            // Save the Open Library cover if one exists
            coverImage: book.cover_i
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
              : null,
          }),
        },
      );

      // Convert our backend response into JavaScript data
      const data = await response.json();

      // Check whether adding the book failed
      if (!response.ok) {
        setError(
          data.message ||
            "Failed to add book to your library.",
        );
        return;
      }

      console.log(
        "Book added from Open Library:",
        data,
      );

      // Show confirmation to the user
      setSuccess(
        `${book.title} was added to your library!`,
      );

      // Tell App.jsx to refresh BookList
      onBookAdded();
    } catch (error) {
      console.error(
        "Error adding book to library:",
        error,
      );

      setError(
        "Unable to add book to your library.",
      );
    }
  };

  return (
    <section className="book-search">
      <p className="eyebrow">DISCOVER</p>

      <h2>Find a Book</h2>

      <form onSubmit={searchBooks}>
        <label htmlFor="book-search">
          Search by title or author
        </label>

        <input
          type="text"
          id="book-search"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          placeholder="e.g. The Hobbit"
        />

        <button type="submit">
          Search
        </button>
      </form>

      {loading && <p>Searching...</p>}

      {error && (
        <p className="message message--error">
          {error}
        </p>
      )}

      {success && (
        <p className="message message--success">
          {success}
        </p>
      )}

      <div className="search-results">
        {results.map((book, index) => (
          <article
            className="search-result"
            key={`${book.key}-${index}`}
          >
            {/* Show a cover if Open Library has one */}
            {book.cover_i && (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={`Cover of ${book.title}`}
              />
            )}

            <div>
              <h3>{book.title}</h3>

              <p>
                {book.author_name?.join(", ") ||
                  "Unknown author"}
              </p>

              {book.first_publish_year && (
                <p>
                  First published:{" "}
                  {book.first_publish_year}
                </p>
              )}

              {/* Add this Open Library result to our database */}
              <button
                type="button"
                onClick={() =>
                  addBookToLibrary(book)
                }
              >
                + Add to Library
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BookSearch;