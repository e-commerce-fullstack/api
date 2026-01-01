import express from 'express'
import {
  payByKHQR,
  listPayments, 
  getPaymentByOrderId
} from '../../controllers/payment.controller.js'

const router = express.Router();

router.post("/khqr", payByKHQR);
router.get("/", listPayments);
router.get("/order/:orderId", getPaymentByOrderId);

export default router;