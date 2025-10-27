// middlewares/authAdmin.js
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";

export const authAdmin = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Acceso denegado. Token requerido." });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar el admin en la base de datos
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return res.status(403).json({ message: "Acceso no autorizado. No eres administrador." });
        }

        req.admin = admin; // Guardamos el admin en la request
        next();
    } catch (error) {
        console.error("Error en authAdmin:", error.message);
        res.status(401).json({ message: "Token inválido o expirado." });
    }
};
