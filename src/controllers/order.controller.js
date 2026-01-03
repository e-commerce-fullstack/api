import { placeOrder, listOrders } from "../services/order.service.js";

export const create = async (req, res, next) => {
  console.log("req.user:", req.user);
  console.log("req.body:", req.body);
  try {
    const data = {
      user: req.user._id,
      products: req.body.products,
      total: req.body.total,
      status: req.body.status,
    };
    const order = await placeOrder(data);  // save to variable
    res.json(order);
    console.log("Order created:", order);
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    res.json(await listOrders());
  } catch (err) {
    next(err);
  }
};
