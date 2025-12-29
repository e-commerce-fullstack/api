import { Router } from "express";
import { create, getAll, getById, getCategories } from "../../controllers/product.controller.js";
import { validateProduct } from "../../middlewares/validate.middleware.js";
import { upload } from "../../middlewares/image.middleware.js";
import { protectRoute } from "../../middlewares/protect.middleware.js";

const router = Router();

router.get("/categories", getCategories); // Moved up to prevent conflict with /:id

// POST routes
router.post(
  "/",
  protectRoute(),
  upload.single("image"),
  validateProduct,
  create
);

// GET routes - ORDER MATTERS HERE
router.get("/", getAll);
router.get("/:id", protectRoute(), getById); // Now only matches if it's not "/categories"

export default router;