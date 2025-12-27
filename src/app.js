import express from "express";
import path from "path";

// =======================
// Initialize App Express
// =======================

import connectDB from "./database/connection.js";
import authRoute from "./routes/v1/auth.route.js";
import productRoute from './routes/v1/product.routes.js';
import orderRoute from './routes/v1/order.routes.js';
import cors from "cors";

const app = express();

// Allow requests from your frontend
app.use(cors({
  origin: "http://localhost:5173",  // or "*" for any origin
  credentials: true                 // if sending cookies or auth headers
}));

app.use(express.json()); 

// Serve uploads folder
app.use("/api/v1/uploads", express.static(path.join(process.cwd(), "uploads")));
// now images at "uploads/filename.jpg" are accessible at "http://localhost:3000/uploads/filename.jpg"

connectDB(); // connect to MongoDB

// register routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);

// app.use(global error handler)

export default app;
