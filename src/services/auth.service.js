import {
  createUser,
  findUserByEmail,
  getUser,
  findUserById,
} from "../database/repositories/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

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

  const isMatch = await bcrypt.compare(data.password, user.password);
  // compare plain password with hashed password

  if (!isMatch || !user) throw new Error("Incorrect password or email");

  // service handle logic and here is jwt
  const token = jwt.sign(
    { id: user._id, email: user.email , password: user.password, createdAt: user.createdAt, updatedAt: user.updatedAt},
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {user, token}; // or return token/session info
};


// NEW: fetch user by ID
export const getUserById = async (id) => {
  const user = await findUserById(id);
  if (!user) throw new Error("User not found");
  return user;
};