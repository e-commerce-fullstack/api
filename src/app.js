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

const allowedOrigins = [
  "http://localhost:5173",          // local frontend
  "https://e-smart-shop.vercel.app/" // deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
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
