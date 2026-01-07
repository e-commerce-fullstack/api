import { createOrder, getOrderRepoById } from "../database/repositories/order.respository.js";
import ProductModel from '../database/models/product.model.js';
import OrderModel from '../database/models/order.model.js'; // 1. Added Order Model import

export const placeOrder = async (data) => {
    const productIds = data.products.map(i => i.product);
    const products = await ProductModel.find({ _id: { $in: productIds } });

    let calculatedTotal = 0;
    const validatedProducts = data.products.map(item => {
        const product = products.find(p => p._id.equals(item.product));
        if (!product) throw new Error(`Product not found: ${item.product}`);
        
        calculatedTotal += product.price * item.quantity;
        return { product: product._id, quantity: item.quantity };
    });

    const orderData = {
        ...data,
        products: validatedProducts,
        total: calculatedTotal, // 2. Use the total calculated from DB prices for security
        status: data.status || 'pending'
    };

    return createOrder(orderData);
};

export const listOrders = async (filter = {}) => {
  try {
    // 3. Changed "Order" to "OrderModel" and added populate
    return await OrderModel.find(filter).populate("products.product").sort({ createdAt: -1 });
  } catch (err) {
    console.error("listOrders error:", err);
    throw err;
  }
};

export const getOrderById = async (id) => {
  try {
    // Call the repository function we just created
    return await getOrderRepoById(id);
  } catch (err) {
    console.error("Service Error:", err);
    throw err;
  }
};