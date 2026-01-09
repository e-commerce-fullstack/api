// import mongoose from 'mongoose';

// const paymentSchema = new mongoose.Schema({
//     order: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'order',
//         required: [true, 'Order ID is required']
//     },
//     amount: {
//         type: Number,
//         required: true
//     },
//     method: {
//         type: String,
//         default: 'KHQR'
//     },
//     transactionId: {
//         type: String,
//         required: [true, 'Bank Reference Number is required'],
//         unique: true, // This is what caused the 11000 error
//         trim: true
//     },
//     status: {
//         type: String,
//         enum: ['PENDING', 'PAID', 'FAILED'],
//         default: 'PENDING'
//     }
// }, { timestamps: true });

// export default mongoose.model('payment', paymentSchema);

import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: [true, 'Order ID is required']
    },
    amount: { type: Number, required: true },
    method: { type: String, default: 'KHQR' },
    
    // MD5 is the "ID" of the QR code itself before payment happens
    md5: {
        type: String,
        required: true,
        unique: true
    },

    // TransactionId is only provided by the bank AFTER payment is successful
    transactionId: {
        type: String,
        unique: true,
        sparse: true, // IMPORTANT: Allows multiple 'null' values for pending payments
        trim: true
    },

    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED'],
        default: 'PENDING'
    }
}, { timestamps: true });

export default mongoose.model('payment', paymentSchema);