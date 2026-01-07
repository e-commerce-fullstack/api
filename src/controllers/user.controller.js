import { fetchAllUsers } from "../services/user.service.js";


export const getAllUser = async (req, res, next)=>{
    try {
        const allUsers = await fetchAllUsers()
        res.status(200).json({allUsers})
    } catch (err) {
        console.log("Fetch all user faild", err.message);
        next(err)
    }

}