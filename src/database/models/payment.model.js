import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "order", required: true},
    amount: { type: Number, required: true},
    method: {type: String, enum:["KHQR"], required: true},
    transactionId: { type: String, unique: true, required: true},
    status: { type: String, enum: ["PENDING", "PAID", "FAILED"], default: "PENDING"},

  },
  {
    timestamps: true
  }
)

const paymentModel = mongoose.model("payment", paymentSchema)
export default paymentModel