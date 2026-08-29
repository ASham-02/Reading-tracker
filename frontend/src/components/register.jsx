import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const Register = ({ showLogin }) => {
  // Store what the user types into the form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Store error and success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Run when the registration form is submitted
  const handleSubmit = async (event) => {
    // Prevent the page from refreshing
    event.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");

    // Check that the passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Send the new user's details to the backend
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      // Convert the response into JavaScript data
      const data = await response.json();

      // Check whether registration failed
      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      console.log("Registration successful:", data);

      // Clear the form
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Show a success message
      setSuccess(
        "Account created successfully! You can now log in."
      );
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to create account. Please try again."
      );
    }
  };

  return (
    <div>
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="register-email">
            Email
          </label>

          <input
            type="email"
            id="register-email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="register-password">
            Password
          </label>

          <input
            type="password"
            id="register-password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="confirm-password">
            Confirm Password
          </label>

          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            required
          />
        </div>

        {/* Show registration errors */}
        {error && <p>{error}</p>}

        {/* Show successful registration */}
        {success && <p>{success}</p>}

        <button type="submit">
          Create Account
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <button
          type="button"
          onClick={showLogin}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;