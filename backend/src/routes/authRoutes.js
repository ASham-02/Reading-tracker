import authController from "../controllers/authController.js";

const authRoutes = [
  {
    method: "POST",
    path: "/auth/register",
    handler: authController.registerUser,
  },
];

export default authRoutes;