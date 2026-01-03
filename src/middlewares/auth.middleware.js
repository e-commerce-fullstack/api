// Import jsonwebtoken library to verify JWT tokens
import jwt from "jsonwebtoken";

// Middleware function to protect routes
const authMiddleware = (req, res, next) => {
  // Read the 'Authorization' header from the request
  const authHeader = req.headers.authorization;

  // If the header is missing, respond with 401 Unauthorized
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Header should be in format "Bearer <token>", so split by space
  // The token itself is the second part
  const token = authHeader.split(" ")[1];

  // If no token is found after splitting, respond with 401
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    // Verify the token using the secret key
    // This checks both signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Attach the decoded payload to req.user
    // Controllers can use this to identify the authenticated user
    req.user = decoded;

    // Token is valid → pass control to the next middleware or route
    next();
  } catch (err) {
    // Token verification failed → respond with 401 Unauthorized
    return res.status(401).json({ message: "Access token invalid or expired" });
  }
};

// Export the middleware for use in protected routes
export default authMiddleware;
