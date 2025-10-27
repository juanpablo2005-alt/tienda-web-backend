import express from "express";
import { registerUser, loginUser, payForProducts } from "../controllers/userController.js";
import { verifyUserToken } from "../middlewares/authUser.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/pay", verifyUserToken, payForProducts);

export default router;
