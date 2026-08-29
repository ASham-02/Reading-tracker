import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

const registerUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
};

// Log in an existing user
const loginUser = async (email, password) => {

  // Find the user in the database using their email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // Stop the login if the email does not belong to a user
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare the password entered by the user
  // with the hashed password stored in the database
  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  );

  // Stop the login if the password is incorrect
  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  // Create a JWT for the logged-in user
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  // Return the token and basic user information
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

export default {
  registerUser,
  loginUser,
};