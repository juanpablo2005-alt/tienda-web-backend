import express from "express";
import { loginAdmin, getDashboardData } from "../controllers/adminController.js";
import { createProduct, updateProduct, getProducts, deleteProduct } from "../controllers/productController.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/dashboard", authAdmin, getDashboardData);
router.get("/products", authAdmin, getProducts);
router.post("/products", authAdmin, createProduct);
router.put("/products/:id", authAdmin, updateProduct);
router.delete("/products/:id", authAdmin, deleteProduct);

export default router;
