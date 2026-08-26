import { useState } from "react";
import Login from "./components/login";
import Register from "./components/register";
import BookList from "./components/bookList";
import AddBook from "./components/addBook";
import AdminBookList from "./components/adminBookList";
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

  // Used to tell BookList when a new book has been added
  const [refreshBooks, setRefreshBooks] = useState(0);

  // Log the user out
  const handleLogout = () => {
    // Remove login information from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear the logged-in user from React
    setToken(null);
    setUser(null);

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

          {/* Show different content depending on the user's role */}
          {user?.role === "ADMIN" ? (
            <AdminBookList />
          ) : (
            <>
              <AddBook
                onBookAdded={() =>
                  setRefreshBooks((current) => current + 1)
                }
              />

              <BookList refreshBooks={refreshBooks} />
            </>
          )}
        </>
      ) : showRegister ? (
        <Register
          showLogin={() => setShowRegister(false)}
        />
      ) : (
        <>
          <Login
            setToken={setToken}
            setUser={setUser}
          />

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