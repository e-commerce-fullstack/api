import userModel from "../models/user.model.js";

export const createUser = (data) => userModel.create(data);
export const findUserByEmail = (email) => userModel.findOne({ email });
export const findUserById = (id) => userModel.findUserById(id);

export const getUser = async (email) =>{
  return await userModel.findOne({email})
}