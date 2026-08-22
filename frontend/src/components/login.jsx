import { useState } from "react";

const Login = () => {
  // Store what the user types into the email input
  const [email, setEmail] = useState("");

  // Store what the user types into the password input
  const [password, setPassword] = useState("");

  // Run when the login form is submitted
  const handleSubmit = async (event) => {
    // Prevent the page from refreshing
    event.preventDefault();

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

      // If the login failed, show the error in the console
      if (!response.ok) {
        console.log("Login failed:", data.message);
        return;
      }

      // For now, show the successful response in the console
      console.log("Login successful:", data);
      // Store the JWT so we can use it for protected requests
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("Login error:", error);
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
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
