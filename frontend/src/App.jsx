import { useState } from "react";
import Login from "./components/login";
import BookList from "./components/bookList";
import AddBook from "./components/addBook";

function App() {
  // Check whether a token already exists
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <main>
      <h1>Reading Tracker</h1>

      {token ? (
        <>
          <AddBook />
          <BookList />
        </>
       ) : (
        <Login setToken={setToken} />
      )}
    </main>
  );
}

export default App;