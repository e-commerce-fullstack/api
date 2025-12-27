import { Router } from 'express'
import { create, getAll } from '../../controllers/order.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'
import { protectRoute } from '../../middlewares/protect.middleware.js'
const router = Router()
router.post('/',authMiddleware, protectRoute(), create)
router.get('/',authMiddleware, protectRoute(), getAll)

export default router;