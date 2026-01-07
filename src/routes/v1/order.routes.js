import { Router } from 'express'
import { create, getAll, getById } from '../../controllers/order.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'
import { protectRoute } from '../../middlewares/protect.middleware.js'
const router = Router()
router.post('/',authMiddleware, protectRoute(), create)
router.get('/',authMiddleware, protectRoute(), getAll)
// Add protectRoute() to your GET by ID route
router.get("/:id", authMiddleware, protectRoute(), getById);
export default router;