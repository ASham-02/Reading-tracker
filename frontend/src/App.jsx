import { useState } from "react";
import Login from "./components/login";
import Register from "./components/register";
import BookList from "./components/bookList";
import AddBook from "./components/addBook";
import "./App.css";

function App() {
  // Check whether the user already has a saved token
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Track whether the user wants to see Login or Register
  const [showRegister, setShowRegister] = useState(false);

  // Used to tell BookList when a new book has been added
  const [refreshBooks, setRefreshBooks] = useState(0);

  // Log the user out
  const handleLogout = () => {
    // Remove the JWT from local storage
    localStorage.removeItem("token");

    // Update React so the login page is shown again
    setToken(null);

    // Return to the login screen
    setShowRegister(false);
  };

  return (
    <main>
      <h1>Reading Tracker</h1>

      {token ? (
        <>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>

          <AddBook
            onBookAdded={() =>
              setRefreshBooks((current) => current + 1)
            }
          />

          <BookList refreshBooks={refreshBooks} />
        </>
      ) : showRegister ? (
        <Register
          showLogin={() => setShowRegister(false)}
        />
      ) : (
        <>
          <Login setToken={setToken} />

          <p>
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
  );
}

export default App;