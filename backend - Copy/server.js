import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database/connection.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import productRoutes from "./routes/product.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Conectar base de datos
connectDB();

// Rutas
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
