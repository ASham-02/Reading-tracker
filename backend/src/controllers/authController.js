import authService from "../services/authService.js";

const registerUser = async (request, h) => {
  try {
    // Get the registration details from the request body
    const { email, password } = request.payload;

    // Create the new user
    const user = await authService.registerUser(email, password);

    // Return the new user's information
    return h
      .response({
        id: user.id,
        email: user.email,
        role: user.role,
      })
      .code(201);

  } catch (error) {
    console.error(error);

    // Prisma error P2002 means a unique value already exists
    // In this case, the email address is already registered
    if (error.code === "P2002") {
      return h
        .response({
          message: "An account with this email already exists",
        })
        .code(409);
    }

    // Handle any other unexpected registration error
    return h
      .response({
        message: "Failed to register user",
      })
      .code(500);
  }
};

// Log in an existing user
const loginUser = async (request, h) => {
  try {
    // Get the login details from the request body
    const { email, password } = request.payload;

    // Pass the details to the authentication service
    const result = await authService.loginUser(email, password);

    // Return the user information and JWT
    return h.response(result).code(200);

  } catch (error) {
    return h
      .response({
        message: "Invalid email or password",
      })
      .code(401);
  }
};

export default {
  registerUser,
  loginUser,
};