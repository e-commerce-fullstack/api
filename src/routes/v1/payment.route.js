import { Router } from 'express';
import { 
    submitKHQRPayment, 
    checkPaymentStatus, 
    // getAllPayments      
} from '../../controllers/payment.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { protectRoute } from '../../middlewares/protect.middleware.js';

const router = Router();

// --- USER ROUTES ---
// Requires authentication to create or check their own payment
router.post('/khqr', authMiddleware, submitKHQRPayment);
router.get('/check-status/:md5', authMiddleware, checkPaymentStatus);

// --- ADMIN ROUTES ---
// Added authMiddleware before protectRoute to ensure req.user exists before checking roles
// router.get('/all', authMiddleware, protectRoute('admin'), getAllPayments);

export default router;