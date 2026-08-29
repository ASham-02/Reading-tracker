import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const AddBook = ({ onBookAdded }) => {
  // Store the information entered into the form
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  // Store error and success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Run when the Add Book form is submitted
  const handleSubmit = async (event) => {
    // Prevent the page from refreshing
    event.preventDefault();

    // Clear any previous messages
    setError("");
    setSuccess("");

    // Check that title and author are not just empty spaces
    if (!title.trim() || !author.trim()) {
      setError("Please enter both a title and author.");
      return;
    }

    // Get the logged-in user's JWT
    const token = localStorage.getItem("token");

    try {
      // Send the new book to the backend
      const response = await fetch(`${API_URL}/books`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
        }),
      });

      // Convert the response into JavaScript data
      const data = await response.json();

      // Check whether creating the book failed
      if (!response.ok) {
        setError(data.message || "Failed to add book");
        return;
      }

      console.log("Book added:", data);

      // Clear the form
      setTitle("");
      setAuthor("");

      // Show a success message
      setSuccess("Book added successfully!");

      // Tell App that a new book has been added
      onBookAdded();

    } catch (error) {
      console.error("Error adding book:", error);

      // Show an error message on the page
      setError("Unable to add book. Please try again.");
    }
  };

  return (
    <section>
      <h2>Add a Book</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>

          <input
            type="text"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="author">Author</label>

          <input
            type="text"
            id="author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            required
          />
        </div>

        {/* Show an error if adding the book fails */}
        {error && <p>{error}</p>}

        {/* Show a message when the book is added successfully */}
        {success && <p>{success}</p>}

        <button type="submit">Add Book</button>
      </form>
    </section>
  );
};

export default AddBook;