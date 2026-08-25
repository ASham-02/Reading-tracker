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

  // Start editing a selected book
  const startEditing = (book) => {
    // Clear previous messages
    setError("");
    setSuccess("");

    // Remember which book is being edited
    setEditingBookId(book.id);

    // Fill the edit form with the book's current information
    setEditStatus(book.status);
    setEditNotes(book.notes || "");
  };

  // Update the selected book
  const updateBook = async (bookId) => {
    // Clear previous messages
    setError("");
    setSuccess("");

    // Get the JWT for the logged-in user
    const token = localStorage.getItem("token");

    try {
      // Send the updated information to the backend
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

      // Convert the response into JavaScript data
      const data = await response.json();

      // Check whether the update failed
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

      // Show a success message
      setSuccess("Book updated successfully!");
    } catch (error) {
      console.error("Error updating book:", error);

      // Show an error message on the page
      setError("Unable to update book. Please try again.");
    }
  };

  // Delete a selected book
  const deleteBook = async (bookId) => {
    // Clear previous messages
    setError("");
    setSuccess("");

    // Ask the user to confirm before deleting
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    // Stop if the user presses Cancel
    if (!confirmed) {
      return;
    }

    // Get the JWT for the logged-in user
    const token = localStorage.getItem("token");

    try {
      // Send a DELETE request to the backend
      const response = await fetch(
        `http://localhost:3000/books/${bookId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Convert the response into JavaScript data
      const data = await response.json();

      // Check whether deleting the book failed
      if (!response.ok) {
        setError(data.message || "Failed to delete book");
        return;
      }

      console.log("Book deleted:", data);

      // Remove the deleted book from the page immediately
      setBooks((currentBooks) =>
        currentBooks.filter((book) => book.id !== bookId)
      );

      // Close the edit form if the deleted book was being edited
      setEditingBookId(null);

      // Show a success message
      setSuccess("Book deleted successfully!");
    } catch (error) {
      console.error("Error deleting book:", error);

      // Show an error message on the page
      setError("Unable to delete book. Please try again.");
    }
  };

  return (
    <section>
      <h2>My Books</h2>

      {/* Show error messages */}
      {error && <p>{error}</p>}

      {/* Show success messages */}
      {success && <p>{success}</p>}

      {books.length === 0 && !error ? (
        <p>No books added yet.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <h3>{book.title}</h3>

              <p>{book.author}</p>

              {/* Show the edit form if this book is being edited */}
              {editingBookId === book.id ? (
                <div>
                  <div>
                    <label htmlFor={`status-${book.id}`}>
                      Status
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

                  <div>
                    <label htmlFor={`notes-${book.id}`}>
                      Notes
                    </label>

                    <textarea
                      id={`notes-${book.id}`}
                      value={editNotes}
                      onChange={(event) =>
                        setEditNotes(event.target.value)
                      }
                    />
                  </div>

                  {/* Save the changes */}
                  <button
                    type="button"
                    onClick={() => updateBook(book.id)}
                  >
                    Save
                  </button>

                  {/* Cancel editing */}
                  <button
                    type="button"
                    onClick={() => setEditingBookId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  {/* Normal book information */}
                  <p>Status: {book.status}</p>

                  {book.notes && (
                    <p>Notes: {book.notes}</p>
                  )}

                  {/* Open the edit form */}
                  <button
                    type="button"
                    onClick={() => startEditing(book)}
                  >
                    Edit
                  </button>

                  {/* Delete the book */}
                  <button
                    type="button"
                    onClick={() => deleteBook(book.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BookList;