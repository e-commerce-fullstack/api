import { register, login, getUserById, refreshAccessToken } from "../services/auth.service.js";

export const registerUser = async (req, res, next) => {
  try {
    const user = await register(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};


export const loginUser = async (req, res, next) => {
  try {
    // 1. Your service already returns { user, accessToken, refreshToken }
    const { user, accessToken, refreshToken } = await login(req.body);

    // 2. Send the user object (which now includes the 'role' from your schema)
    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role // <--- CHECK THIS LINE
      }
    });
  } catch (err) {
    next(err);
  }
};


export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body; // frontend must send this
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    // Generate a new access token
    const accessToken = refreshAccessToken(refreshToken);

    // Return the new access token to the frontend
    res.json({ accessToken });
  } catch (err) {
    console.error("Refresh Token Error:", err.message);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

export const logoutUser = async (req, res, next)=>{
  try{
    res.json({message: "Logout success"})
  }
  catch(err){
    next(err)
  }
}

// NEW: /auth/me controller
// backend/controllers/auth.controller.js

export const getMe = async (req, res, next) => {
  try {
    // req.user.id comes from authMiddleware (access token)
    const user = await getUserById(req.user.id);

    // return only safe fields - MUST INCLUDE ROLE
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // <--- ADD THIS LINE
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({ user: safeUser });
  } catch (err) {
    next(err);
  }
};
