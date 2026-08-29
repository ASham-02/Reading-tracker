import { useEffect, useState } from "react";

const AdminBookList = () => {
  // Store all books returned from the admin endpoint
  const [books, setBooks] = useState([]);

  // Store error and success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load all books when the admin page opens
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
          setError(data.message || "Failed to load books");
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

  // Turn database statuses into readable text
  const formatStatus = (status) => {
    const statusLabels = {
      WANT_TO_READ: "Want to Read",
      READING: "Reading",
      COMPLETED: "Completed",
      DID_NOT_FINISH: "Did Not Finish",
    };

    return statusLabels[status] || status;
  };

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
    <div className="admin-page">
      {/* Admin introduction */}
      <section className="admin-hero">
        <p className="eyebrow">ADMINISTRATION</p>

        <div className="admin-hero__content">
          <h1>
            Library
            <br />
            Overview.
          </h1>

          <p>
            Manage books across all registered users
            and keep an overview of the entire library.
          </p>
        </div>
      </section>

      {/* Admin library heading */}
      <div className="admin-toolbar">
        <div>
          <p className="eyebrow">MANAGEMENT</p>
          <h2>All Books</h2>
        </div>

        <p className="admin-count">
          {books.length} {books.length === 1 ? "BOOK" : "BOOKS"}
        </p>
      </div>

      {/* Feedback messages */}
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

      {/* Admin book list */}
      {books.length === 0 && !error ? (
        <div className="empty-library">
          <p className="eyebrow">NO BOOKS</p>
          <p>There are currently no books in the library.</p>
        </div>
      ) : (
        <div className="admin-books">
          {/* Column headings */}
          <div className="admin-books__head">
            <span>Book</span>
            <span>Owner</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {books.map((book) => (
            <article
              className="admin-book-row"
              key={book.id}
            >
              <div className="admin-book-row__book">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </div>

              <div className="admin-book-row__owner">
                <span className="mobile-label">Owner</span>

                <p>
                  {book.user?.email || "No owner"}
                </p>
              </div>

              <div className="admin-book-row__status">
                <span className="mobile-label">
                  Status
                </span>

                <span
                  className={`book-status book-status--${book.status.toLowerCase()}`}
                >
                  {formatStatus(book.status)}
                </span>
              </div>

              <div className="admin-book-row__action">
                <button
                  type="button"
                  className="text-action text-action--danger"
                  onClick={() => deleteBook(book.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookList;