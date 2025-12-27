import { createOrder, getAllOrder } from "../database/repositories/order.respository.js";

export const placeOrder = (data) => createOrder(data);
export const listOrders = () => getAllOrder()