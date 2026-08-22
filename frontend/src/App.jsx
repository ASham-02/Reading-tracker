import { useState } from "react";
import Login from "./components/login";
import BookList from "./components/bookList";
import AddBook from "./components/addBook";

function App() {
  // Check whether the user already has a saved token
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Used to tell BookList when a new book has been added
  const [refreshBooks, setRefreshBooks] = useState(0);

  return (
    <main>
      <h1>Reading Tracker</h1>

      {token ? (
        <>
          <AddBook
            onBookAdded={() => setRefreshBooks(refreshBooks + 1)}
          />

          <BookList refreshBooks={refreshBooks} />
        </>
      ) : (
        <Login setToken={setToken} />
      )}
    </main>
  );
}

export default App;