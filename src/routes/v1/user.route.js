import { getAllUser } from "../../controllers/user.controller.js";
import { protectRoute} from "../../middlewares/protect.middleware.js"
import { Router } from "express";
const router = Router()

router.get("/all", protectRoute("admin"), getAllUser);

export default router