import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Admin } from "../models/Admin.js";

dotenv.config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Conectado a MongoDB");

        // Eliminar admins antiguos
        await Admin.deleteMany({});
        console.log("🗑️ Todos los admins antiguos eliminados");

        // Crear nuevo admin
        const hashed = await bcrypt.hash("admin123", 10);
        const newAdmin = new Admin({
            username: "admin",
            password: hashed,
        });

        await newAdmin.save();
        console.log("✅ Nuevo admin creado con éxito");
        console.log("Usuario: admin");
        console.log("Contraseña: admin123");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error al resetear admin:", error);
        process.exit(1);
    }
};

resetAdmin();
