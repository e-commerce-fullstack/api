import { createOrder, getOrderRepoById, updateOrderPaymentRepo } from "../database/repositories/order.respository.js";
import ProductModel from '../database/models/product.model.js';
import OrderModel from '../database/models/order.model.js';


// import { createOrder, getOrderRepoById } from "../database/repositories/order.respository.js";
// import ProductModel from '../database/models/product.model.js';

export const placeOrder = async (data) => {
    // 1. Define productIds immediately to prevent ReferenceError
    if (!data.products || !Array.isArray(data.products)) {
        throw new Error("Products array is required");
    }

    const productIds = data.products.map(item => item.product); 
    const products = await ProductModel.find({ _id: { $in: productIds } });

    let calculatedTotal = 0;
    const validatedProducts = data.products.map(item => {
        const product = products.find(p => p._id.toString() === item.product.toString());
        
        if (!product) throw new Error(`Product ${item.product} not found in database`);
        
        // Ensure price is a number, default to 0
        const price = Number(product.price) || 0;
        calculatedTotal += price * Number(item.quantity);

        return { product: product._id, quantity: item.quantity };
    });

    const orderData = {
        user: data.user,
        products: validatedProducts,
        total: Number(calculatedTotal.toFixed(2)),
        status: 'pending',
        paymentStatus: 'unpaid'
    };

    // Use repository to save
    return await createOrder(orderData); 
};

/**
 * @desc Marks an order as paid in the database
 */
export const markOrderAsPaid = async (orderId, bankHash) => {
    try {
        return await updateOrderPaymentRepo(orderId, bankHash);
    } catch (err) {
        console.error("markOrderAsPaid error:", err);
        throw err;
    }
};

export const listOrders = async (filter = {}) => {
  try {
    return await OrderModel.find(filter)
        .populate("products.product")
        .populate("user", "name email") // Added populate user for the list view
        .sort({ createdAt: -1 });
  } catch (err) {
    console.error("listOrders error:", err);
    throw err;
  }
};

export const getOrderById = async (id) => {
  try {
    return await getOrderRepoById(id);
  } catch (err) {
    console.error("Service Error:", err);
    throw err;
  }
};