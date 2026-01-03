import { Router } from "express";
import { registerUser, loginUser, logoutUser, getMe, refreshToken } from "../../controllers/auth.controller.js";

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken)
router.post("/logout", logoutUser)
// GET /auth/me
// Use the authMiddleware here
router.get("/me", getMe); // protected route

export default router;
