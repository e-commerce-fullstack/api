import {
  createPayment,
  getPayments,
  getPaymentByOrder,
} from '../services/payment.service.js'

export const payByKHQR = async (req, res) => {
  try {
    const { orderId, transactionId, amount } = req.body;
    const payment = await createPayment({ orderId, transactionId, amount });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listPayments = async (req, res) => {
  try {
    const payments = await getPayments();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPaymentByOrderId = async (req, res) => {
  try {
    const payment = await getPaymentByOrder(req.params.orderId);
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};