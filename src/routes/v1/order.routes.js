import { Router } from 'express'
import { create, getAll, getById } from '../../controllers/order.controller.js'
import { protectRoute } from '../../middlewares/protect.middleware.js' // Or your preferred auth middleware

const router = Router()

// All order routes should be protected
router.use(protectRoute()); 

router.post('/', create)
router.get('/', getAll)
router.get("/:id", getById);

export default router;