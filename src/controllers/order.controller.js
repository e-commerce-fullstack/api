import { placeOrder, listOrders, getOrderById } from "../services/order.service.js";

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
    res.json(await listOrders({ user: req.user._id }));
  } catch (err) {
    next(err);
  }
};


export const getById = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const order = await getOrderById(id); 
    
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🛡️ PROTECT: If protectRoute failed or was skipped
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // 🛡️ SAFE CHECK: Compare IDs
    // Check if order.user exists (it might be an object if populated, or an ID)
    const orderOwnerId = order.user?._id || order.user;
    
    if (orderOwnerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You do not have permission to view this order" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error in getById:", err);
    next(err); // This will only send a 500 if a REAL DB error happens
  }
};