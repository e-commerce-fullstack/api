// // src/repositories/payment.repository.js
// import Payment from '../models/payment.model.js'
// export const createPaymentRepo = (data) => {
//   return Payment.create(data);
// };

// export const findAllPaymentsRepo = () => {
//   return Payment.find().populate("order");
// };

// export const findPaymentByOrderRepo = (orderId) => {
//   return Payment.findOne({ order: orderId });
// };
import paymentModel from '../models/payment.model.js';

export const createPaymentRepo = (data) => {
  return paymentModel.create(data);
};

export const findAllPaymentsRepo = () => {
  return paymentModel.find().populate("order");
};

export const findPaymentByOrderRepo = (orderId) => {
  return paymentModel.findOne({ order: orderId }).populate("order");
};

export const updatePaymentStatusRepo = async (transactionId, status) => {
  return paymentModel.findOneAndUpdate(
    { transactionId },
    { status },
    { new: true }
  );
};