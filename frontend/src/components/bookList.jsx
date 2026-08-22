import { useEffect, useState } from "react";

const BookList = ({ refreshBooks }) => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

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
    // Remember which book is being edited
    setEditingBookId(book.id);

    // Fill the edit form with the book's current information
    setEditStatus(book.status);
    setEditNotes(book.notes || "");
  };

  // Update the selected book
  const updateBook = async (bookId) => {
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
        console.log("Failed to update book:", data.message);
        return;
      }

      console.log("Book updated:", data);

      // Close the edit form
      setEditingBookId(null);

      // Update the book on the page immediately
      // so the user does not need to refresh
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
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

    // Delete a selected book
    const deleteBook = async (bookId) => {
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
        console.log("Failed to delete book:", data.message);
        return;
        }

        console.log("Book deleted:", data);

        // Remove the deleted book from the page immediately
        setBooks((currentBooks) =>
        currentBooks.filter((book) => book.id !== bookId)
        );
    } catch (error) {
        console.error("Error deleting book:", error);
    }
    };

  return (
    <section>
      <h2>My Books</h2>

      {error && <p>{error}</p>}

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

                  {/* Delete the book */}    
                  <button
                    type="button"
                    onClick={() => deleteBook(book.id)}
                    >
                    Delete
                 </button>   

                  {/* Close the edit form without saving */}
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