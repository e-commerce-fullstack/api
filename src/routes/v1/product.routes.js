import { Router } from "express";
import { create, getAll, getById, getCategories, deleted } from "../../controllers/product.controller.js";
import { validateProduct } from "../../middlewares/validate.middleware.js";
import { upload } from "../../middlewares/image.middleware.js"; // 1. Keep this import
import { protectRoute } from "../../middlewares/protect.middleware.js";

const router = Router();

router.get("/categories", getCategories);

// POST routes
router.post(
  "/",
  protectRoute(),
  upload.single("image"), // 2. MUST include this here!
  validateProduct,
  create
);

// GET routes
router.get("/", getAll);
router.delete("/:id", protectRoute(), deleted)
router.get("/:id", protectRoute(), getById);

export default router;