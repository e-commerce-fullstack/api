// src/services/payment.service.js
import {
  createPaymentRepo,
  findAllPaymentsRepo,
  findPaymentByOrderRepo,
} from "../database/repositories/payment.repository.js";

export const createPayment = async ({ orderId, transactionId, amount }) => {
  return createPaymentRepo({
    order: orderId,
    method: "KHQR",
    transactionId,
    amount,
    status: "PENDING",
  });
};

export const getPayments = async () => findAllPaymentsRepo();

export const getPaymentByOrder = async (orderId) => findPaymentByOrderRepo(orderId);