
// import paymentModel from '../models/payment.model.js';

// export const createPaymentRepo = (data) => {
//   return paymentModel.create(data);
// };

// export const findAllPaymentsRepo = () => {
//   return paymentModel.find().populate("order");
// };

// export const findPaymentByOrderRepo = (orderId) => {
//   return paymentModel.findOne({ order: orderId }).populate("order");
// };

// export const updatePaymentStatusRepo = async (transactionId, status) => {
//   return paymentModel.findOneAndUpdate(
//     { transactionId },
//     { status },
//     { new: true }
//   );
// };

import paymentModel from '../models/payment.model.js';

export const createPaymentRepo = (data) => {
    // data should include: order, amount, md5, and status: 'PENDING'
    return paymentModel.create(data);
};

// Use this to check if a specific QR code has been paid
export const findPaymentByMd5Repo = (md5) => {
    return paymentModel.findOne({ md5 }).populate("order");
};

// Use this to update the payment once the user scans and pays
export const finalizePaymentRepo = async (md5, bankTransactionId) => {
    return paymentModel.findOneAndUpdate(
        { md5 },
        { 
            status: 'PAID', 
            transactionId: bankTransactionId // Now we add the unique bank ID
        },
        { new: true }
    );
};