import { useState } from "react";

const BookSearch = () => {
  // Store what the user types into the search box
  const [searchTerm, setSearchTerm] = useState("");

  // Store books returned by Google Books
  const [results, setResults] = useState([]);

  // Store any error message
  const [error, setError] = useState("");

  // Track whether a search is currently running
  const [loading, setLoading] = useState(false);

  // Search Google Books
  const searchBooks = async (event) => {
    event.preventDefault();

    // Don't search if the input is empty
    if (!searchTerm.trim()) {
      setError("Enter a book title to search.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchTerm
        )}&maxResults=10`
      );

      const data = await response.json();

      if (!response.ok) {
        setError("Unable to search for books.");
        return;
      }

      // Google Books returns results inside "items"
      setResults(data.items || []);
    } catch (error) {
      console.error("Book search error:", error);

      setError("Unable to search for books.");
    } finally {
      setLoading(false);
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

      <div className="search-results">
        {results.map((book) => {
          const info = book.volumeInfo;

          return (
            <article
              className="search-result"
              key={book.id}
            >
              {info.imageLinks?.thumbnail && (
                <img
                  src={info.imageLinks.thumbnail}
                  alt={`Cover of ${info.title}`}
                />
              )}

              <div>
                <h3>{info.title}</h3>

                <p>
                  {info.authors?.join(", ") ||
                    "Unknown author"}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default BookSearch;