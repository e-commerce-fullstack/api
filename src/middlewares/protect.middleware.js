import jwt from "jsonwebtoken";
import User from "../database/models/user.model.js";

// Define route permission rules
const routePermissions = [
  { path: "/product/*", method: "GET", requireAuth: false },
  { path: "/product/*", method: "POST", requireAuth: true },
  { path: "/order/*", method: "GET", requireAuth: true },
  { path: "/order/*", method: "POST", requireAuth: true },
];
// not use yet


export const protectRoute = () => {
  return async (req, res, next) => {
    // Read the Authorization header
    const authHeader = req.headers.authorization;

    // Reject if no header or not starting with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Extract the token
      const token = authHeader.split(" ")[1];

      // Verify the token using your secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database
      const foundUser = await User.findById(decoded.id);

      // Reject if user does not exist
      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Attach the user to the request object for later use
      req.user = foundUser;

      // Continue to the next middleware/controller
      next();
    } catch (err) {
      // Invalid token or expired
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
