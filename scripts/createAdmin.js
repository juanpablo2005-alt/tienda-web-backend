import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "./models/Admin.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const createAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const username = "admin";
        const password = "admin123";

        // Verificar si ya existe
        const exists = await Admin.findOne({ username });
        if (exists) {
            console.log("⚠️ El admin ya existe");
            process.exit();
        }

        // Crear nuevo admin (con hash)
        const hashed = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ username, password: hashed });
        await newAdmin.save();

        console.log("✅ Admin creado correctamente");
        console.log("Usuario:", username);
        console.log("Contraseña:", password);
        process.exit();
    } catch (error) {
        console.error("❌ Error al crear admin:", error);
        process.exit(1);
    }
};

createAdmin();
