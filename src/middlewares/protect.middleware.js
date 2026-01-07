import jwt from "jsonwebtoken";
import User from "../database/models/user.model.js";

/**
 * Middleware to protect routes based on authentication and roles.
 * @param {string} requiredRole - Optional role required to access the route (e.g., 'admin').
 */
export const protectRoute = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // 1. Read the Authorization header
      const authHeader = req.headers.authorization;

      // 2. Reject if no header or not starting with "Bearer "
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      // 3. Extract and Verify the token
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      // 4. Find the user in the database
      // Using decoded.id or decoded._id depending on your token payload structure
      const foundUser = await User.findById(decoded.id || decoded._id);

      // 5. Reject if user does not exist in DB
      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized: User no longer exists" });
      }

      // 6. Role Authorization Check
      // If a specific role is required (like 'admin'), check it here
      if (requiredRole && foundUser.role !== requiredRole) {
        console.warn(`Access denied for user ${foundUser.email}. Required: ${requiredRole}, Found: ${foundUser.role}`);
        return res.status(403).json({ message: "Forbidden: You do not have the required permissions" });
      }

      // 7. Attach the full user object to the request for use in controllers
      req.user = foundUser;

      // 8. Continue to the next middleware or controller
      next();
    } catch (err) {
      console.error("Auth Middleware Error:", err.message);
      
      // Handle specific JWT errors
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};