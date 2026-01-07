import { Router } from 'express';
import { 
    submitKHQRPayment, 
    verifyPayment, 
    getPendingPayments 
} from '../../controllers/payment.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { protectRoute } from '../../middlewares/protect.middleware.js';

const router = Router();

// User Route: Submit payment
router.post('/khqr', authMiddleware, submitKHQRPayment);

// Admin Routes: View and Approve (Added protectRoute for security)
// Admin can view pending payments
router.get('/pending', protectRoute('admin'), getPendingPayments);

// Admin can verify a specific order
router.patch('/verify/:orderId', protectRoute('admin'), verifyPayment);

export default router;