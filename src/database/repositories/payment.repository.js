// src/repositories/payment.repository.js
import Payment from '../models/payment.model.js'
export const createPaymentRepo = (data) => {
  return Payment.create(data);
};

export const findAllPaymentsRepo = () => {
  return Payment.find().populate("order");
};

export const findPaymentByOrderRepo = (orderId) => {
  return Payment.findOne({ order: orderId });
};
