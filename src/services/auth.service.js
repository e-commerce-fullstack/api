import {
  createUser,
  findUserByEmail,
  getUser,
  findUserById,
} from "../database/repositories/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { refreshToken } from "../controllers/auth.controller.js";


export const register = async (data) => {
  const user = await findUserByEmail(data.email);

  if (user) throw new Error("User already exist");

  if (!data.password) throw new Erroor("Password can't be empty");

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const savedUser = await createUser({
    ...data,
    password: hashedPassword,
  });
  console.log("Saved user:", savedUser);
  return savedUser
};

export const login = async (data) => {
  const user = await getUser(data.email);

  if(!user) throw new Error("Incorrect password or email")

  const isMatch = await bcrypt.compare(data.password, user.password)
  if(!isMatch) throw new Error("Incorrect password or email")


  const payload = {
    id: user._id,
    email: user.email
  }

  const accessToken = generateAccessToken(payload)
  const refreshToken = generateRefreshToken(payload)

  return {
    user, 
    accessToken,
    refreshToken
  }
};

// refresh token
export const refreshAccessToken = (refreshToken) => {
  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  )

  return generateAccessToken({
    id: decoded.id,
    email: decoded.email
  })
}


// NEW: fetch user by ID
export const getUserById = async (id) => {
  const user = await findUserById(id);
  if (!user) throw new Error("User not found");
  return user;
};