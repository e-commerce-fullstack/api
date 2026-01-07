import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        products:[
            {
                product: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
                quantity: Number,
            }
        ],
        total: Number,
        // Change status to use specific words (enum) for better control
        status: { 
            type: String, 
            enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'],
            default: 'pending' 
        },
        // NEW: Track if the user has paid
        paymentStatus: {
            type: String,
            enum: ['unpaid', 'pending_verification', 'paid', 'refunded'],
            default: 'unpaid'
        },
        // NEW: Store the Bank Ref Number here too for easy lookup
        transactionId: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('order', orderSchema)