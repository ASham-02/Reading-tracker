import { useState } from "react";

const Login = ({ setToken }) => {
  // Store what the user types into the email input
  const [email, setEmail] = useState("");

  // Store what the user types into the password input
  const [password, setPassword] = useState("");

  // Store any login error message
  const [error, setError] = useState("");

  // Run when the login form is submitted
  const handleSubmit = async (event) => {
    // Prevent the page from refreshing
    event.preventDefault();

    // Clear any previous error message
    setError("");

    try {
      // Send the email and password to the backend
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Convert the response into JavaScript data
      const data = await response.json();

      // If the login failed, show an error message
      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Show the successful response in the console
      console.log("Login successful:", data);

      // Store the JWT so we can use it for protected requests
      localStorage.setItem("token", data.token);

      // Tell App that the user has logged in
      setToken(data.token);

    } catch (error) {
      console.error("Login error:", error);

      // Show an error if the frontend cannot connect to the backend
      setError("Unable to connect to the server");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {/* Show an error message if login fails */}
        {error && <p>{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;