import mongoose from "mongoose";
import { addProduct, listProducts, listProductById, countProducts } from "../services/product.service.js";

export const create = async (req, res, next) => {
  try {
    const product = await addProduct({
      ...req.body,
      image: req.file.path,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};



// delete product admin 
export const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await listProducts({ skip, limit });

    const totalItems = await countProducts();
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      page: page,
      limit: limit,
      totalPages,
      totalItems,
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next)=>{
  try{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({message: "Invalid Product"})
    }

    const product = await listProductById(id)
    if(!product){
      return res.status(400).json({message: "Invalid Product"})
    }

    res.json(product)
  }
  catch(err){
    next(err)
  }
}