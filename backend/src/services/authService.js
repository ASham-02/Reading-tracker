import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

const registerUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
};

export default {
  registerUser,
};