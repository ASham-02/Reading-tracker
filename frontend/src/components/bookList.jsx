import { useEffect, useState } from "react";

const BookList = ({ refreshBooks }) => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  // Store success messages for updating and deleting books
  const [success, setSuccess] = useState("");

  // Track which book is currently being edited
  const [editingBookId, setEditingBookId] = useState(null);

  // Store the edited values
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Get the logged-in user's JWT
        const token = localStorage.getItem("token");

        // Get the user's books from the backend
        const response = await fetch("http://localhost:3000/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Convert the response into JavaScript data
        const data = await response.json();

        // Check whether getting the books failed
        if (!response.ok) {
          setError(data.message || "Failed to load books");
          return;
        }

        // Store the books in state
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to load books");
      }
    };

    fetchBooks();
  }, [refreshBooks]);

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

  // Start editing a selected book
  const startEditing = (book) => {
    setError("");
    setSuccess("");

    setEditingBookId(book.id);

    setEditStatus(book.status);
    setEditNotes(book.notes || "");
  };

  // Update the selected book
  const updateBook = async (bookId) => {
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3000/books/${bookId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: editStatus,
            notes: editNotes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update book");
        return;
      }

      console.log("Book updated:", data);

      // Close the edit form
      setEditingBookId(null);

      // Update the book on the page immediately
      setBooks((currentBooks) =>
        currentBooks.map((book) =>
          book.id === bookId
            ? {
                ...book,
                status: editStatus,
                notes: editNotes,
              }
            : book
        )
      );

      setSuccess("Book updated successfully!");
    } catch (error) {
      console.error("Error updating book:", error);
      setError("Unable to update book. Please try again.");
    }
  };

  // Delete a selected book
  const deleteBook = async (bookId) => {
    setError("");
    setSuccess("");

    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3000/books/${bookId}`,
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

      console.log("Book deleted:", data);

      // Remove the deleted book from the page immediately
      setBooks((currentBooks) =>
        currentBooks.filter((book) => book.id !== bookId)
      );

      setEditingBookId(null);

      setSuccess("Book deleted successfully!");
    } catch (error) {
      console.error("Error deleting book:", error);
      setError("Unable to delete book. Please try again.");
    }
  };

  return (
    <section className="book-list">
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

      {books.length === 0 && !error ? (
        <div className="empty-library">
          <p className="eyebrow">YOUR SHELF IS EMPTY</p>
          <p>
            Add your first book to start building your library.
          </p>
        </div>
      ) : (
        <div className="book-rows">
          {books.map((book) => (
            <article className="book-row" key={book.id}>
              {/* Main information about the book */}
              <div className="book-row__header">
                <div className="book-row__identity">
                  <h3>{book.title}</h3>
                  <p className="book-author">
                    {book.author}
                  </p>
                </div>

                <span
                  className={`book-status book-status--${book.status.toLowerCase()}`}
                >
                  {formatStatus(book.status)}
                </span>
              </div>

              {/* Editing area */}
              {editingBookId === book.id ? (
                <div className="book-edit">
                  <div className="book-edit__field">
                    <label htmlFor={`status-${book.id}`}>
                      Reading Status
                    </label>

                    <select
                      id={`status-${book.id}`}
                      value={editStatus}
                      onChange={(event) =>
                        setEditStatus(event.target.value)
                      }
                    >
                      <option value="WANT_TO_READ">
                        Want to Read
                      </option>

                      <option value="READING">
                        Reading
                      </option>

                      <option value="COMPLETED">
                        Completed
                      </option>

                      <option value="DID_NOT_FINISH">
                        Did Not Finish
                      </option>
                    </select>
                  </div>

                  <div className="book-edit__field">
                    <label htmlFor={`notes-${book.id}`}>
                      Notes
                    </label>

                    <textarea
                      id={`notes-${book.id}`}
                      value={editNotes}
                      onChange={(event) =>
                        setEditNotes(event.target.value)
                      }
                      placeholder="Add your thoughts about this book..."
                    />
                  </div>

                  <div className="book-edit__actions">
                    <button
                      type="button"
                      className="primary-action"
                      onClick={() => updateBook(book.id)}
                    >
                      Save Changes
                    </button>

                    <button
                      type="button"
                      className="text-action"
                      onClick={() =>
                        setEditingBookId(null)
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Notes */}
                  <div className="book-row__details">
                    {book.notes ? (
                      <p className="book-notes">
                        {book.notes}
                      </p>
                    ) : (
                      <p className="book-notes book-notes--empty">
                        No notes added.
                      </p>
                    )}
                  </div>

                  {/* Book controls */}
                  <div className="book-row__actions">
                    <button
                      type="button"
                      className="text-action"
                      onClick={() => startEditing(book)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="text-action text-action--danger"
                      onClick={() => deleteBook(book.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default BookList;