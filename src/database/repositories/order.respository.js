// import Order from '../database/models/order.model.js';
import Order from '../models/order.model.js'

export const createOrder = (data) => Order.create(data);

export const getOrderRepoById = (id) => 
    Order.findById(id)
         .populate('user', 'name email')
         .populate('products.product', 'name price category image');

// Renamed from getAllOrder to listOrders to match service
export const listOrders = (filter = {}) =>
    Order.find(filter)
         .populate('user', 'name email')
         .populate('products.product', 'name price category image')
         .sort({ createdAt: -1 });

export const updateOrderPaymentRepo = (orderId, bankHash) => {
    return Order.findByIdAndUpdate(
        orderId,
        { 
            paymentStatus: 'paid',
            status: 'processing',
            transactionId: bankHash 
        },
        { new: true }
    );
};