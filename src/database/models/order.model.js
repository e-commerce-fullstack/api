import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        // the way we write to get user id and product id for order 
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        products:[
            {
                product: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
                quantity: Number,
            }
        ],
        total: Number,
        status: String,
    },
    {
        timestamps: true
    }
)

export default mongoose.model('order', orderSchema)