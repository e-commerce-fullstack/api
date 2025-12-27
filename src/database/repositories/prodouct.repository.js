import product from '../models/product.model.js'

export const createProduct = (data) => product.create(data);
export const getAllProducts = async ({skip, limit}) => {
    return await product.find().skip(skip).limit(limit)
}
export const getProductById = (id) => product.findById(id);

export const countAllProducts = async () =>{
    return await product.countDocuments()
}