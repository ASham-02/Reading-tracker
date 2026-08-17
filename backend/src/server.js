// Import the Hapi framework so we can create our server
import Hapi from "@hapi/hapi";

// Import the book routes from own folder
import bookRoutes from "./routes/bookRoutes.js";

// Import the authRoutes from own folder
import authRoutes from "./routes/authRoutes.js";

// Import the jwtAuth from own folder
import jwtAuth from "./auth/jwtAuth.js";

// Function to create and configure the server
const createServer = async (port = 3000) => {
  const server = Hapi.server({
    port,
    host: "0.0.0.0",
  });

  // Register JWT authentication
  server.auth.scheme("jwt", jwtAuth);
  server.auth.strategy("jwt", "jwt");

  // Health route
  server.route({
    method: "GET",
    path: "/health",
    handler: () => {
      return {
        status: "ok",
        service: "reading-tracker-api",
      };
    },
  });

  // Register book routes
  server.route(bookRoutes);

  // Register auth routes
  server.route(authRoutes);

  return server;
};

// Function responsible for starting the server
const startServer = async () => {
  try {
    // Use the environment variable
    // so the hosting provider can choose the port
    const port = process.env.PORT || 3000;

    // Create the configured server
    const server = await createServer(port);

    // Start listening for incoming requests
    await server.start();

    // Display the server URL in the terminal
    console.log(`Server running at ${server.info.uri}`);
  } catch (error) {
    // If something goes wrong while starting the server,
    // print the error to the console
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the application
startServer();
