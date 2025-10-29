import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller";
import upload from "../config/multer";

const router = Router();

// product routes
// POST /api/products (accepts multipart/form-data with optional `image` field)
router.post("/products", upload.single("image"), createProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
// PUT with optional image replace
router.put("/products/:id", upload.single("image"), updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
