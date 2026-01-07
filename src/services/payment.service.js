// // src/services/payment.service.js
// import {
//   createPaymentRepo,
//   findAllPaymentsRepo,
//   findPaymentByOrderRepo,
// } from "../database/repositories/payment.repository.js";

// export const createPayment = async ({ orderId, transactionId, amount }) => {
//   return createPaymentRepo({
//     order: orderId,
//     method: "KHQR",
//     transactionId,
//     amount,
//     status: "PENDING",
//   });
// };

// export const getPayments = async () => findAllPaymentsRepo();

// export const getPaymentByOrder = async (orderId) => findPaymentByOrderRepo(orderId);

import { 
  createPaymentRepo, 
  updatePaymentStatusRepo,
  findAllPaymentsRepo,
  findPaymentByOrderRepo
} from "../database/repositories/payment.repository.js";
import mongoose from "mongoose";

export const createPayment = async ({ orderId, transactionId, amount }) => {
  // Logic: Create the pending record
  return createPaymentRepo({
    order: orderId,
    transactionId,
    amount,
    method: "KHQR",
    status: "PENDING",
  });
};

export const approvePayment = async (transactionId) => {
  // 1. Update payment to PAID
  const payment = await updatePaymentStatusRepo(transactionId, "PAID");
  if (!payment) throw new Error("Payment record not found");

  // 2. Update order to paid (using the order model reference)
  await mongoose.model("order").findByIdAndUpdate(payment.order, { status: "paid" });
  
  return payment;
};

export const getPayments = async () => findAllPaymentsRepo();
export const getPaymentByOrder = async (orderId) => findPaymentByOrderRepo(orderId);