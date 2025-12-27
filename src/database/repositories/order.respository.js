import order from '../models/order.model.js';

// Create a new order
export const createOrder = (data) => order.create(data);

// Get all orders with populated user and product info
export const getAllOrder = () =>
    order.find()
         .populate('user', 'name email')               // populate user details
         .populate('products.product', 'name price category');  // populate each product in the array
