import { placeOrder, listOrders, getOrderById } from "../services/order.service.js";

export const create = async (req, res) => {
  try {
    console.log('--- Incoming Order Request ---');
    
    // Ensure user exists from middleware
    if (!req.user || !req.user._id) {
        return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const data = {
      user: req.user._id,
      products: req.body.products,
    };

    const order = await placeOrder(data);

    console.log("✅ Order created successfully:", order._id);
    res.status(201).json(order);
  } catch (err) {
    console.error("❌ CREATE ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const orders = await listOrders({ user: req.user._id });
    res.json(orders);
  } catch (err) {
    console.error("❌ GET ALL ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // CRASH PROTECTION: Use optional chaining before .toString()
    const orderOwnerId = order.user?._id?.toString() || order.user?.toString();
    const currentUserId = req.user?._id?.toString();

    if (orderOwnerId !== currentUserId) {
      return res.status(403).json({ message: "Permission denied" });
    }

    res.json(order);
  } catch (err) {
    console.error("❌ GET BY ID ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};