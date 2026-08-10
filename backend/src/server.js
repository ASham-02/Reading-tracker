// Import the Hapi framework so we can create our server
import Hapi from "@hapi/hapi";

// Import the book routes from own folder
import bookRoutes from "./routes/bookRoutes.js";

// Function to create and configure the server
const createServer = async (port = 3000) => {
  // Create a new Hapi server using supplied port
  const server = Hapi.server({
    port,
    // The host where the server will run
    host: "localhost",
  });

  // Register a route (endpoint) with the server
  server.route({
    method: "GET",

    // The URL path for this endpoint
    path: "/health",

    // The handler function runs whenever this endpoint is requested
    handler: () => {
      // Send a JSON response back to the client
      return {
        status: "ok",
        service: "reading-tracker-api",
      };
    },
  });
  // Register all of our book routes
  server.route(bookRoutes);

  // Return the configured server
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
