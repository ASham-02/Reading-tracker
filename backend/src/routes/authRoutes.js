import authController from "../controllers/authController.js";

const authRoutes = [
  {
    method: "POST",
    path: "/auth/register",
    handler: authController.registerUser,
  },
    {
    method: "POST",
    path: "/auth/login",
    handler: authController.loginUser,
  },
];
export default authRoutes;