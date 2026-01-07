import { getAllUserRepo } from "../database/repositories/user.repository.js";


export const fetchAllUsers = async () => {
  try {
    // Find all users, exclude passwords, and sort by newest first
    const users = await getAllUserRepo()
    return users;
  } catch (err) {
    console.error("User Service Error (fetchAllUsers):", err.message);
    throw new Error("Could not retrieve users from database");
  }

};