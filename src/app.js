import express from "express";

// =======================
// Initialize App Express
// =======================

import connectDB from "./database/connection.js";
import authRoute from "./routes/v1/auth.route.js";
import productRoute from './routes/v1/product.routes.js'
import orderRoute from './routes/v1/order.routes.js'
const app = express();

app.use(express.json()); //

connectDB(); // call function to connect to MongoDB

// register route
app.use("/api/v1/auth", authRoute);

// product route
app.use("/api/v1/product", productRoute)

// order router
app.use("/api/v1/order", orderRoute)
// app.use(golbal error handle)

export default app;
