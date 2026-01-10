import paymentModel from '../models/payment.model.js';

export const createPaymentRepo = (data) => {
    return paymentModel.create(data);
};

// ADD THIS BACK: Useful for your Vue.js "Recent Transactions" list
export const findAllPaymentsRepo = () => {
    return paymentModel.find().populate("order").sort({ createdAt: -1 });
};

export const findPaymentByMd5Repo = (md5) => {
    return paymentModel.findOne({ md5 }).populate("order");
};

export const finalizePaymentRepo = async (md5, bankTransactionId) => {
    return paymentModel.findOneAndUpdate(
        { md5 },
        { 
            status: 'PAID', 
            transactionId: bankTransactionId 
        },
        { new: true }
    );
};