import { createOrder, getAllOrder } from "../database/repositories/order.respository.js";
import ProductModel from '../database/models/product.model.js'

export const placeOrder = async (data) => {
    // Calculate total server-side
    let total = 0
    for(let item of data.products){
        const product = await ProductModel.findById(item.product)
        if(!product) throw new Error(`Product not found: ${item.product} `)
        total += product.price * item.quantity;
    }

    const orderData = {
        ...data,
        total,
        status: data.status || 'pending'
    }

    return createOrder(orderData)
}

export const listOrders = async () => {
    const orders = await getAllOrder()
    return orders
}