import order from '../models/order.model.js';

// ✅ Add this: Export the model itself for use in services if needed
export const OrderModel = order;

export const createOrder = (data) => order.create(data);

// ✅ Add this: Repository function for finding by ID
export const getOrderRepoById = (id) => 
    order.findById(id)
         .populate('user', 'name email')
         .populate('products.product', 'name price category image');

export const getAllOrder = () =>
    order.find()
         .populate('user', 'name email')
         .populate('products.product', 'name price category image');