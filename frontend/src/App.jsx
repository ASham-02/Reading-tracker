import { useState } from "react";
import Login from "./components/login";
import Register from "./components/register";
import BookList from "./components/bookList";
import AddBook from "./components/addBook";
import AdminBookList from "./components/adminBookList";
import BookSearch from "./components/booksearch";
import "./App.css";

function App() {
  // Check whether the user already has a saved token
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Get the saved user's information
  const savedUser = localStorage.getItem("user");

  // Store the logged-in user's information
  const [user, setUser] = useState(
    savedUser ? JSON.parse(savedUser) : null
  );

  // Track whether the user wants to see Login or Register
  const [showRegister, setShowRegister] = useState(false);

  // Track whether the Add Book form is open
  const [showAddBook, setShowAddBook] = useState(false);

  // Used to tell BookList when a new book has been added
  const [refreshBooks, setRefreshBooks] = useState(0);

  // Log the user out
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setShowRegister(false);
    setShowAddBook(false);
  };

  // Run after a book has successfully been added
  const handleBookAdded = () => {
    // Refresh the book list
    setRefreshBooks((current) => current + 1);

    // Close the manual Add Book form if it is open
    setShowAddBook(false);
  };

  return (
    <>
      {token ? (
        <main className="app">
          {/* Top navigation */}
          <header className="app-header">
            <p className="logo">READLIST</p>

            <div className="header-actions">
              <span>{user?.email}</span>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </header>

          {user?.role === "ADMIN" ? (
            /* Admin interface */
            <AdminBookList />
          ) : (
            <>
              {/* Library introduction */}
              <section className="library-hero">
                <p className="eyebrow">PERSONAL LIBRARY</p>

                <h1>
                  Your
                  <br />
                  Library.
                </h1>

                <p className="hero-description">
                  Keep track of the books you want to read,
                  the stories you're currently exploring,
                  and everything you've finished.
                </p>
              </section>

              {/* Search for books using the external API */}
              <BookSearch onBookAdded={handleBookAdded} />

              {/* Library controls */}
              <div className="library-toolbar">
                <div>
                  <p className="eyebrow">COLLECTION</p>
                  <h2>Your Books</h2>
                </div>

                <button
                  type="button"
                  className="add-book-button"
                  onClick={() =>
                    setShowAddBook((current) => !current)
                  }
                >
                  {showAddBook ? "Close" : "+ Add a Book"}
                </button>
              </div>

              {/* Only show the form when requested */}
              {showAddBook && (
                <AddBook onBookAdded={handleBookAdded} />
              )}

              <BookList refreshBooks={refreshBooks} />
            </>
          )}
        </main>
      ) : (
        <main className="auth-page">
          <p className="logo">READLIST</p>

          {showRegister ? (
            <Register
              showLogin={() => setShowRegister(false)}
            />
          ) : (
            <>
              <Login
                setToken={setToken}
                setUser={setUser}
              />

              <p className="auth-switch">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                >
                  Create Account
                </button>
              </p>
            </>
          )}
        </main>
      )}
    </>
  );
}

export default App;