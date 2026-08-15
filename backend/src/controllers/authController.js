import authService from "../services/authService.js";

const registerUser = async (request, h) => {
  try {
    const { email, password } = request.payload;

    const user = await authService.registerUser(email, password);

    return h
      .response({
        id: user.id,
        email: user.email,
        role: user.role,
      })
      .code(201);

  } catch (error) {
    console.error(error);

    return h
      .response({
        message: "Failed to register user",
      })
      .code(500);
  }
};

export default {
  registerUser,
};