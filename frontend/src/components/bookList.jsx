import { useEffect, useState } from "react";

const BookList = ({ refreshBooks }) => {
  // Store the books returned by the backend
  const [books, setBooks] = useState([]);

  // Store any error message
  const [error, setError] = useState("");

  // Run once when this component first loads
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Get the JWT that was saved when the user logged in
        const token = localStorage.getItem("token");

        // Send a request to the protected /books endpoint
        const response = await fetch("http://localhost:3000/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        // If the request failed, show an error
        if (!response.ok) {
          setError(data.message || "Failed to load books");
          return;
        }

        // Save the books in React state
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to load books");
      }
    };

    fetchBooks();
  }, [refreshBooks]);

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
              <p>Status: {book.status}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BookList;