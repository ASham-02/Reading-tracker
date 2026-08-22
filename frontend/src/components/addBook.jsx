import { useState } from "react";

const AddBook = ({ onBookAdded }) => {
  // Store the information entered into the form
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  // Run when the Add Book form is submitted
  const handleSubmit = async (event) => {
    // Prevent the page from refreshing
    event.preventDefault();

    // Get the logged-in user's JWT
    const token = localStorage.getItem("token");

    try {
      // Send the new book to the backend
      const response = await fetch("http://localhost:3000/books", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title,
          author,
        }),
      });

      // Convert the response into JavaScript data
      const data = await response.json();

      // Check whether creating the book failed
      if (!response.ok) {
        console.log("Failed to add book:", data.message);
        return;
      }

      console.log("Book added:", data);

      // Clear the form
      setTitle("");
      setAuthor("");
      // Tell App that a new book has been added
      onBookAdded();

    } catch (error) {
      console.error("Error adding book:", error);
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
          />
        </div>

        <div>
          <label htmlFor="author">Author</label>

          <input
            type="text"
            id="author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </div>

        <button type="submit">Add Book</button>
      </form>
    </section>
  );
};

export default AddBook;