import { useState } from "react";
import Login from "./components/Login";
import BookList from "./components/BookList";

function App() {
  // Check whether a token already exists
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <main>
      <h1>Reading Tracker</h1>

      {token ? (
        <BookList />
      ) : (
        <Login setToken={setToken} />
      )}
    </main>
  );
}

export default App;