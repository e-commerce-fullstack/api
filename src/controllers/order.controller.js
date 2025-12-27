import { placeOrder, listOrders } from '../services/order.service.js';

export const create = async (req, res, next) => {
    try {
        const data = {
            user: req.user._id,          // req.user set by JWT middleware
            products: req.body.products,
            total: req.body.total,
            status: req.body.status
        };
        res.json(await placeOrder(data));
    } catch(err) {
        next(err);
    }
};

export const getAll = async (req, res, next) => {
    try {
        res.json(await listOrders());
    } catch(err) {
        next(err);
    }
};

