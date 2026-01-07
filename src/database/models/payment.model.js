import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: [true, 'Order ID is required']
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        default: 'KHQR'
    },
    transactionId: {
        type: String,
        required: [true, 'Bank Reference Number is required'],
        unique: true, // This is what caused the 11000 error
        trim: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED'],
        default: 'PENDING'
    }
}, { timestamps: true });

export default mongoose.model('payment', paymentSchema);