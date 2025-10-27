import express from "express";
import { getAvailableProducts } from "../controllers/productController.js";

const router = express.Router();
router.get("/", getAvailableProducts);
export default router;
