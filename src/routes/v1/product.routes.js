import { Router } from "express";
import { create, getAll, getById, getCategories } from "../../controllers/product.controller.js";
import { validateProduct } from "../../middlewares/validate.middleware.js";
import { upload } from "../../middlewares/image.middleware.js";
import { protectRoute } from "../../middlewares/protect.middleware.js";

const router = Router();

router.post(
  "/",
  protectRoute(),
  upload.single("image"),
  validateProduct,
  create
);

router.get("/", getAll);
router.get("/:id", protectRoute(), getById);
router.get("/categories", getCategories);

export default router;
