import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: [true, 'Order ID is required']
    },
    amount: { type: Number, required: true },
    method: { type: String, default: 'KHQR' },
    
    // The "ID" of the QR itself. Required for tracking personal account payments.
    md5: {
        type: String,
        required: true,
        unique: true,
        lowercase: true // Best practice for hashes
    },

    // TransactionId is null while PENDING. 
    // Sparse: true allows multiple PENDING payments to exist at once.
    transactionId: {
        type: String,
        unique: true,
        sparse: true, 
        trim: true
    },

    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED'],
        default: 'PENDING'
    }
}, { timestamps: true });

export default mongoose.model('payment', paymentSchema);