import product from '../models/product.model.js'

// Create a product
export const createProduct = (data) => product.create(data);

// Get all products with pagination and optional search
export const getAllProducts = async ({ skip = 0, limit = 10, search = "" }) => {
  const query = search ? { name: { $regex: search, $options: "i" } } : {};
  return await product.find(query).skip(skip).limit(limit);
}

// Get a single product by ID
export const getProductById = (id) => product.findById(id);

// Count products, optionally filtered by search
export const countAllProducts = async (search = "") => {
  const query = search ? { name: { $regex: search, $options: "i" } } : {};
  return await product.countDocuments(query);
}
