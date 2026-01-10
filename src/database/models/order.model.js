import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products", // Usually 'product' (singular)
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending_verification", "paid", "refunded"],
      default: "unpaid",
    },
    // This stores the Bakong Blockchain Hash once paid
    // order.model.js
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("order", orderSchema);
