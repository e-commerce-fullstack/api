import Payment from '../database/models/payment.model.js';
import Order from '../database/models/order.model.js'
/**
 * @desc    Submit a new KHQR Payment (User Action)
 * @route   POST /api/v1/payment/khqr
 */
export const submitKHQRPayment = async (req, res) => {
    try {
        const { orderId, transactionId, amount } = req.body;

        // 1. Create the payment record in the payments collection
        const payment = await Payment.create({
            order: orderId,
            transactionId: transactionId.trim(), // Clean whitespace
            amount,
            status: 'PENDING'
        });

        // 2. Update the Order to show it is now waiting for admin review
        // This changes paymentStatus from 'unpaid' to 'pending_verification'
        await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'pending_verification',
            transactionId: transactionId // Store ref on order for easy admin search
        });

        res.status(201).json({ 
            success: true, 
            message: "Payment submitted! Please wait for admin approval.", 
            payment 
        });
    } catch (err) {
        // Handle MongoDB E11000 Duplicate Key Error
        if (err.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: "This Reference Number has already been used. Please check your bank receipt." 
            });
        }
        
        console.error("Payment Submission Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error. Please try again." 
        });
    }
};

/**
 * @desc    Verify/Approve Payment (Admin Action)
 * @route   PATCH /api/v1/payments/verify/:orderId
 */
export const verifyPayment = async (req, res) => {
    try {
        const { orderId } = req.params;

        // 1. Update Order Status to PAID
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId, 
            { paymentStatus: 'paid', status: 'processing' }, 
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // 2. Update the associated Payment record to PAID
        await Payment.findOneAndUpdate(
            { order: orderId }, 
            { status: 'PAID' }
        );

        res.status(200).json({ 
            success: true, 
            message: "Payment verified successfully. Order is now being processed.", 
            order: updatedOrder 
        });
    } catch (err) {
        console.error("Verification Error:", err);
        res.status(500).json({ success: false, message: "Failed to verify payment." });
    }
};

/**
 * @desc    Get all pending payments for Admin Dashboard
 * @route   GET /api/v1/payments/pending
 */
export const getPendingPayments = async (req, res) => {
    try {
        const pending = await Payment.find({ status: 'PENDING' }).populate('order');
        res.status(200).json(pending);
    } catch (err) {
        res.status(500).json({ message: "Error fetching payments" });
    }
};