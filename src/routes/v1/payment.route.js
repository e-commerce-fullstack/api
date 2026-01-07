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
router.get('/pending', authMiddleware, protectRoute('admin'), getPendingPayments);
router.patch('/verify/:orderId', authMiddleware, protectRoute('admin'), verifyPayment);

export default router;