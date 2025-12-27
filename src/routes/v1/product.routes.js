import { Router } from "express";

import { create, getAll, getById } from "../../controllers/product.controller.js";
import {validateProduct} from "../../middlewares/validate.middleware.js";
import { protectRoute } from "../../middlewares/protect.middleware.js";

const router = Router()
router.post('/',validateProduct, protectRoute(), create)
router.get('/', getAll)
router.get('/:id',protectRoute(), getById)

export default router;