import { useEffect, useState } from "react";

const AdminBookList = () => {
  // Store all books returned from the admin endpoint
  const [books, setBooks] = useState([]);

  // Store error and success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load all books when the component first appears
  useEffect(() => {
    const fetchAllBooks = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:3000/admin/books",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load admin books");
          return;
        }

        setBooks(data);
      } catch (error) {
        console.error("Admin book error:", error);
        setError("Unable to load books");
      }
    };

    fetchAllBooks();
  }, []);

  // Delete any user's book
  const deleteBook = async (bookId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3000/admin/books/${bookId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete book");
        return;
      }

      // Remove the deleted book from the page immediately
      setBooks((currentBooks) =>
        currentBooks.filter((book) => book.id !== bookId)
      );

      setSuccess("Book deleted successfully!");
    } catch (error) {
      console.error("Admin delete error:", error);
      setError("Unable to delete book");
    }
  };

  return (
    <section>
      <h2>Admin - All Books</h2>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      {books.length === 0 && !error ? (
        <p>No books found.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <h3>{book.title}</h3>

              <p>{book.author}</p>

              <p>Status: {book.status}</p>

              <p>
                Owner: {book.user?.email || "No owner"}
              </p>

              <button
                type="button"
                onClick={() => deleteBook(book.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AdminBookList;