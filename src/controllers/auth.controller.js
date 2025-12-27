import { register, login } from "../services/auth.service.js";

export const registerUser = async (req, res, next) => {
  try {
    const user = await register(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const user = await login(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next)=>{
  try{
    res.json({message: "Logout success"})
  }
  catch(err){
    next(err)
  }
}