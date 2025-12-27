import mongoose from "mongoose";
import { createProduct, getAllProducts, countAllProducts, getProductById } from "../database/repositories/prodouct.repository.js";

export const addProduct = (data) => createProduct(data)

export const listProducts = ({skip, limit}) => {
    return getAllProducts({skip, limit})
}

export const listProductById = async (id) =>{
    if(!mongoose.Types.ObjectId.isValid(id)) return null
    return await getProductById(id)
}

// count product
export const countProducts = () =>{
    return countAllProducts(); 
}