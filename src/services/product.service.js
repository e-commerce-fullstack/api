import mongoose from "mongoose";
import { createProduct, getAllProducts, countAllProducts, getProductById } from "../database/repositories/prodouct.repository.js";

export const addProduct = (data) => createProduct(data);

// Pass search to repository
export const listProducts = ({ skip, limit, search = "" }) => {
  return getAllProducts({ skip, limit, search });
}

export const listProductById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await getProductById(id);
}

// Accept search for counting
export const countProducts = (search = "") => {
  return countAllProducts(search); 
}