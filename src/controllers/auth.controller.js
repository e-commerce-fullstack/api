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
    const tokens = await login(req.body);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) =>{
  try{
    const { refreshToken } = req.body
    if(!refreshToken){
      return res.status(401).json({message: "Refresh token missing"})
    }

    const accessToken = refreshAccessToken(refreshToken)
    res.json({accessToken})
  }catch(err){
    next(err)
  }
}

export const logoutUser = async (req, res, next)=>{
  try{
    res.json({message: "Logout success"})
  }
  catch(err){
    next(err)
  }
}

// NEW: /auth/me controller
// controllers/auth.controller.js
export const getMe = async (req, res, next) => {
  try {
    // req.user.id comes from authMiddleware (access token)
    const user = await getUserById(req.user.id);

    // return only safe fields
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({ user: safeUser });
  } catch (err) {
    next(err);
  }
};
